import { create } from 'zustand'
import { chaptersConfig } from '@/config/chapters'
import { CACHE_TTL } from '@/constants/cache'
import { pb } from '@/services/pocketbase'
import { discipinesConfig } from '@/config/disciplines'

// Promise для отслеживания загрузки дисциплин
let disciplinesLoadingPromise = null

export const useAppStore = create((set, get) => ({
  // UI State
  isOpen: false,
  
  // Static data
  chapters: chaptersConfig,
  
  // Кэшированные данные
  disciplines: {},           // { slug: { id, slug, title, pbId, questionsCount } }
  disciplineData: {},        // { slug: { discipline, questions, answers, loadedAt } }
  
  // Loading states
  isLoadingDisciplines: false,
  isLoadingDisciplineData: {},  // { slug: boolean }
  
  // Errors
  errors: {},
  
  // ==================== ДИСЦИПЛИНЫ ====================
  
  /**
   * Загрузка списка дисциплин (с кэшем)
   */
  loadDisciplines: async (forceRefresh = false) => {
    const state = get()
    
    // Проверяем кэш
    if (!forceRefresh && Object.keys(state.disciplines).length > 0) {
      return state.disciplines
    }
    
    // Если уже загружаем — ждём завершения
    if (disciplinesLoadingPromise) {
      await disciplinesLoadingPromise
      return get().disciplines
    }

    set({ isLoadingDisciplines: true, errors: { ...get().errors, disciplines: null } })
    
    // Создаём Promise для отслеживания
    disciplinesLoadingPromise = (async () => {
      try {
        // Один запрос — все дисциплины
        const records = await pb.collection('disciplines').getFullList({
          sort: 'order',
        })
        
        // Загружаем количество вопросов одним запросом
        const questionsCounts = await loadQuestionsCountBatch(records)
        
        // Преобразуем в формат { slug: discipline }
        const disciplinesMap = {}
        records.forEach((record) => {
          disciplinesMap[record.slug] = {
            id: record.slug,
            slug: record.slug,
            pbId: record.id,  // ID из PocketBase для запросов
            title: record.title,
            description: record.description,
            category: record.category,
            order: record.order,
            questionsCount: questionsCounts[record.id] || 0,
          }
        })

        set({ disciplines: disciplinesMap, isLoadingDisciplines: false })
        return disciplinesMap
      } catch (error) {
        console.error('Ошибка загрузки дисциплин:', error)
        
        // Fallback на статические данные
        const fallbackMap = {}
        Object.entries(discipinesConfig).forEach(([key, value]) => {
          fallbackMap[key] = {
            id: key,
            slug: key,
            pbId: null,
            title: value.title,
            category: value.data?.discipline || 'humanitarian',
            order: 0,
            questionsCount: value.questions?.length || 0,
          }
        })
        
        set({ 
          disciplines: fallbackMap, 
          isLoadingDisciplines: false,
          errors: { ...get().errors, disciplines: error.message }
        })
        return fallbackMap
      } finally {
        disciplinesLoadingPromise = null
      }
    })()

    return disciplinesLoadingPromise
  },

  // ==================== ДАННЫЕ ДИСЦИПЛИНЫ ====================
  
  /**
   * Загрузка данных дисциплины (вопросы + ответы) с кэшем
   */
  loadDisciplineData: async (disciplineSlug, forceRefresh = false) => {
    const state = get()
    const cached = state.disciplineData[disciplineSlug]
    
    // Проверяем кэш (TTL)
    if (!forceRefresh && cached && (Date.now() - cached.loadedAt) < CACHE_TTL) {
      return cached
    }
    
    // Проверяем, не загружаем ли уже
    if (state.isLoadingDisciplineData[disciplineSlug]) {
      // Ждём немного и проверяем снова
      await new Promise(resolve => setTimeout(resolve, 100))
      const newState = get()
      if (newState.disciplineData[disciplineSlug]) {
        return newState.disciplineData[disciplineSlug]
      }
    }

    set({ 
      isLoadingDisciplineData: { ...get().isLoadingDisciplineData, [disciplineSlug]: true },
      errors: { ...get().errors, [disciplineSlug]: null }
    })
    
    try {
      // 1. Получаем дисциплину (из кэша или загружаем)
      let discipline = get().disciplines[disciplineSlug]
      
      if (!discipline?.pbId) {
        // Ждём загрузки дисциплин
        await get().loadDisciplines()
        discipline = get().disciplines[disciplineSlug]
      }
      
      if (!discipline?.pbId) {
        // Попробуем загрузить напрямую из PocketBase
        try {
          const pbDiscipline = await pb.collection('disciplines').getFirstListItem(
            `slug = "${disciplineSlug}"`
          )
          discipline = {
            id: disciplineSlug,
            slug: disciplineSlug,
            pbId: pbDiscipline.id,
            title: pbDiscipline.title,
            description: pbDiscipline.description,
            category: pbDiscipline.category,
          }
        } catch (err) {
          console.error(`Дисциплина ${disciplineSlug} не найдена в PocketBase`)
          throw new Error(`Дисциплина "${disciplineSlug}" не найдена`)
        }
      }
      
      // 2. Загружаем вопросы
      const questions = await pb.collection('questions').getFullList({
        filter: `discipline = "${discipline.pbId}"`,
        sort: 'number',
      })
      
      // 3. Загружаем ВСЕ ответы одним запросом (решение N+1)
      const questionIds = questions.map(q => q.id)
      let answers = []
      
      if (questionIds.length > 0) {
        // Разбиваем на чанки по 30 (PocketBase ограничение фильтра)
        const chunks = chunkArray(questionIds, 30)
        
        for (const chunk of chunks) {
          try {
            // PocketBase синтаксис для OR условий
            const filter = chunk.map(id => `question = "${id}"`).join(' || ')
            const chunkAnswers = await pb.collection('answers').getFullList({
              filter,
            })
            answers = answers.concat(chunkAnswers)
          } catch (error) {
            console.error('Ошибка загрузки ответов для чанка:', error)
            // Fallback: загружаем по одному, если чанк не работает
            for (const id of chunk) {
              try {
                const singleAnswer = await pb.collection('answers').getFirstListItem(
                  `question = "${id}"`,
                  { $autoCancel: false }
                )
                if (singleAnswer) {
                  answers.push(singleAnswer)
                }
              } catch (err) {
                // Ответа может не быть для этого вопроса - это нормально
                // Не логируем, чтобы не засорять консоль
              }
            }
          }
        }
      }
      
      // 4. Создаём мапу ответов
      const answersMap = {}
      answers.forEach(answer => {
        if (answer && answer.question) {
          answersMap[answer.question] = answer
        }
      })
      
      // Проверяем, что все вопросы имеют ответы (для отладки)
      const questionsWithoutAnswers = questions.filter(q => !answersMap[q.id])
      if (questionsWithoutAnswers.length > 0) {
        console.warn(`Вопросы без ответов (${questionsWithoutAnswers.length}):`, 
          questionsWithoutAnswers.map(q => ({ id: q.id, number: q.number })))
      }
      
      const data = {
        discipline,
        questions,
        answers: answersMap,
        loadedAt: Date.now(),
      }
      
      set({ 
        disciplineData: { ...get().disciplineData, [disciplineSlug]: data },
        isLoadingDisciplineData: { ...get().isLoadingDisciplineData, [disciplineSlug]: false }
      })
      
      return data
    } catch (error) {
      console.error(`Ошибка загрузки данных дисциплины ${disciplineSlug}:`, error)
      
      // Fallback на статические данные
      const fallback = discipinesConfig[disciplineSlug]
      if (fallback) {
        const fallbackAnswers = {}
        if (fallback.answers?.answers) {
          // Используем answer.id как ключ (соответствует question.id в статических данных)
          fallback.answers.answers.forEach((answer) => {
            fallbackAnswers[answer.id] = answer
          })
        }
        
        const data = {
          discipline: {
            id: fallback.id,
            slug: fallback.id,
            title: fallback.title,
          },
          questions: fallback.questions || [],
          answers: fallbackAnswers,
          loadedAt: Date.now(),
          isStatic: true,
        }
        
        set({ 
          disciplineData: { ...get().disciplineData, [disciplineSlug]: data },
          isLoadingDisciplineData: { ...get().isLoadingDisciplineData, [disciplineSlug]: false },
          errors: { ...get().errors, [disciplineSlug]: error.message }
        })
        
        return data
      }
      
      set({ 
        isLoadingDisciplineData: { ...get().isLoadingDisciplineData, [disciplineSlug]: false },
        errors: { ...get().errors, [disciplineSlug]: error.message }
      })
      
      return null
    }
  },

  // ==================== ВОПРОС + ОТВЕТ ====================
  
  /**
   * Получить вопрос из кэша или загрузить
   */
  getQuestion: async (disciplineSlug, questionNumber) => {
    let data = get().disciplineData[disciplineSlug]
    
    // Если нет в кэше — загружаем
    if (!data) {
      data = await get().loadDisciplineData(disciplineSlug)
    }
    
    if (!data || !data.questions) {
      return { question: null, answer: null }
    }
    
    // Ищем вопрос по номеру или ID
    const question = data.questions.find(q => 
      String(q.number) === String(questionNumber) || 
      String(q.id) === String(questionNumber) ||
      String(q.id) === String(questionNumber)
    )
    
    if (!question) {
      return { question: null, answer: null }
    }
    
    // Получаем ответ из мапы
    const answer = data.answers && data.answers[question.id] ? data.answers[question.id] : null
    
    // Если ответ не найден в кэше, но данные загружены, попробуем загрузить напрямую
    if (!answer && data.questions && !data.isStatic) {
      try {
        const directAnswer = await pb.collection('answers').getFirstListItem(
          `question = "${question.id}"`,
          { $autoCancel: false }
        )
        if (directAnswer) {
          // Обновляем кэш
          const updatedAnswers = { ...data.answers, [question.id]: directAnswer }
          set({
            disciplineData: {
              ...get().disciplineData,
              [disciplineSlug]: {
                ...data,
                answers: updatedAnswers
              }
            }
          })
          return { question, answer: directAnswer }
        }
      } catch (err) {
        // Ответа нет - это нормально
      }
    }
    
    return { question, answer }
  },

  // ==================== ИНВАЛИДАЦИЯ КЭША ====================
  
  /**
   * Сброс кэша дисциплины
   */
  invalidateDisciplineData: (disciplineSlug) => {
    const state = get()
    const newData = { ...state.disciplineData }
    delete newData[disciplineSlug]
    set({ disciplineData: newData })
  },
  
  /**
   * Полный сброс кэша
   */
  invalidateAll: () => {
    set({ 
      disciplines: {}, 
      disciplineData: {},
      errors: {}
    })
  },

  // ==================== REALTIME ПОДПИСКИ ====================
  
  isSubscribed: false,
  
  /**
   * Подписка на realtime изменения в PocketBase
   */
  subscribeToChanges: async () => {
    const state = get()
    if (state.isSubscribed) return
    
    try {
      // Подписка на изменения дисциплин
      await pb.collection('disciplines').subscribe('*', (e) => {
        
        if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
          // Перезагружаем список дисциплин
          get().loadDisciplines(true)
        }
      })
      
      // Подписка на изменения вопросов
      await pb.collection('questions').subscribe('*', (e) => {
        
        if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
          // Инвалидируем кэш дисциплины, к которой относится вопрос
          const disciplineId = e.record?.discipline
          if (disciplineId) {
            // Находим slug дисциплины по pbId
            const disciplines = get().disciplines
            const discipline = Object.values(disciplines).find(d => d.pbId === disciplineId)
            if (discipline) {
              get().invalidateDisciplineData(discipline.slug)
              // Также обновляем количество вопросов
              get().loadDisciplines(true)
            }
          }
        }
      })
      
      // Подписка на изменения ответов
      await pb.collection('answers').subscribe('*', (e) => {
        
        if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
          // Находим дисциплину через вопрос
          const questionId = e.record?.question
          if (questionId) {
            // Инвалидируем все кэши дисциплин (ответ не содержит прямую ссылку на дисциплину)
            const disciplineData = get().disciplineData
            Object.keys(disciplineData).forEach(slug => {
              const data = disciplineData[slug]
              if (data?.answers?.[questionId] || data?.questions?.some(q => q.id === questionId)) {
                get().invalidateDisciplineData(slug)
              }
            })
          }
        }
      })
      
      set({ isSubscribed: true })
    } catch (error) {
      console.error('❌ Ошибка подписки на realtime:', error)
    }
  },
  
  /**
   * Отписка от realtime изменений
   */
  unsubscribeFromChanges: async () => {
    try {
      await pb.collection('disciplines').unsubscribe('*')
      await pb.collection('questions').unsubscribe('*')
      await pb.collection('answers').unsubscribe('*')
      set({ isSubscribed: false })
    } catch (error) {
      console.error('Ошибка отписки:', error)
    }
  },

  // ==================== UI ACTIONS ====================
  
  setIsOpen: (isOpen) => set({ isOpen }),

  // Для обратной совместимости
  getQuestionsByChapter: (chapter) => {
    const state = get()
    const data = state.disciplineData[chapter]
    return data?.questions || []
  },
}))

// ==================== УТИЛИТЫ ====================

/**
 * Разбивает массив на чанки
 */
function chunkArray(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Загружает количество вопросов для всех дисциплин одним запросом
 */
async function loadQuestionsCountBatch(disciplines) {
  const counts = {}
  
  try {
    // Загружаем все вопросы (только id и discipline)
    const allQuestions = await pb.collection('questions').getFullList({
      fields: 'id,discipline',
    })
    
    // Считаем по дисциплинам
    allQuestions.forEach(q => {
      counts[q.discipline] = (counts[q.discipline] || 0) + 1
    })
  } catch (error) {
    console.error('Ошибка загрузки количества вопросов:', error)
  }
  
  return counts
}
