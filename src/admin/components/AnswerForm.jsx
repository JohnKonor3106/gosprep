import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Alert,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import { ADMIN_ROUTES } from '@/admin/constants/routes'
import { withAuditFields } from '@/admin/utils/auditFields'
import AnswerContentEditor from './AnswerContentEditor'

// Типы структуры ответа
const STRUCTURE_TYPES = [
  { value: 'system_analysis', label: '📊 Системный анализ', hint: 'Структура, устройство систем' },
  { value: 'control_mechanisms', label: '🔍 Механизмы контроля', hint: 'Контроль, надзор, проверки' },
  { value: 'activity_organization', label: '📋 Организация деятельности', hint: 'Процессы, порядок работы' },
  { value: 'concept_analysis', label: '💡 Анализ концепции', hint: 'Понятия, термины, теория' },
  { value: 'procedural', label: '📝 Процедурный', hint: 'Этапы, последовательность' },
  { value: 'feature_analysis', label: '🔎 Анализ особенностей', hint: 'Специфика, характерные черты' },
  { value: 'comparative_analysis', label: '⚖️ Сравнительный анализ', hint: 'Сравнение, различия' },
]

const AnswerForm = ({ answer = null, isEdit = false }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [questions, setQuestions] = useState([])
  const [disciplines, setDisciplines] = useState({})

  // Сохраняем ID ответа отдельно (для надёжности при редактировании)
  const [answerId] = useState(answer?.id || null)

  // Form state
  const [formData, setFormData] = useState({
    question: answer?.question || '',
    number: answer?.number || '',
    title: answer?.title || '',
    decription: answer?.decription || '',
    structure_type: answer?.structure_type || 'system_analysis',
  })

  // Content отдельно для удобства
  const [content, setContent] = useState(answer?.content || {})

  // Загрузка вопросов и дисциплин
  useEffect(() => {
    const loadData = async () => {
      try {
        const disciplineRecords = await pb.collection('disciplines').getFullList({
          sort: 'order',
        })
        const disciplineMap = {}
        disciplineRecords.forEach((d) => {
          disciplineMap[d.id] = d
        })
        setDisciplines(disciplineMap)

        const questionRecords = await pb.collection('questions').getFullList({
          sort: 'number',
        })
        setQuestions(questionRecords)

        if (!formData.question && questionRecords.length > 0) {
          setFormData((prev) => ({ ...prev, question: questionRecords[0].id }))
        }
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
      }
    }
    loadData()
  }, [])

  // Автозаполнение номера ответа и описания из вопроса
  useEffect(() => {
    if (formData.question && !isEdit) {
      const selectedQuestion = questions.find(q => q.id === formData.question)
      if (selectedQuestion) {
        setFormData(prev => ({
          ...prev,
          number: prev.number || selectedQuestion.number,
          decription: prev.decription || selectedQuestion.title,
          structure_type: selectedQuestion.structure_type || prev.structure_type,
        }))
        
        // Автозаполнение title из дисциплины
        const discipline = disciplines[selectedQuestion.discipline]
        if (discipline && !formData.title) {
          setFormData(prev => ({
            ...prev,
            title: discipline.title,
          }))
        }
      }
    }
  }, [formData.question, questions, disciplines, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Подготовка данных
      const baseData = {
        question: formData.question,
        number: parseInt(formData.number, 10),
        title: formData.title,
        decription: formData.decription,
        structure_type: formData.structure_type,
        content: typeof content === 'object' ? content : JSON.parse(content),
      }

      // Добавляем поля аудита (кто изменил)
      const data = withAuditFields(baseData, isEdit)

      if (isEdit) {
        const recordId = answerId || answer?.id
        
        if (!recordId) {
          throw new Error('ID ответа не найден. Попробуйте обновить страницу.')
        }
        
        await pb.collection('answers').update(recordId, data)
      } else {
        await pb.collection('answers').create(data)
      }

      navigate(ADMIN_ROUTES.ANSWERS)
    } catch (err) {
      console.error('Ошибка сохранения:', err.message)
      setError(err.message || 'Ошибка сохранения ответа')
    } finally {
      setIsLoading(false)
    }
  }

  // Группируем вопросы по дисциплинам
  const questionsByDiscipline = {}
  questions.forEach((q) => {
    const disciplineId = q.discipline
    if (!questionsByDiscipline[disciplineId]) {
      questionsByDiscipline[disciplineId] = []
    }
    questionsByDiscipline[disciplineId].push(q)
  })

  const selectedType = STRUCTURE_TYPES.find(t => t.value === formData.structure_type)

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        {error && (
          <Alert.Root status="error" borderRadius="md">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        {/* Основные поля */}
        <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow="sm" w="full" minW={0}>
          <Heading size={{ base: 'sm', md: 'md' }} mb={4}>1️⃣ Выберите вопрос</Heading>
          
          <Box>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              К какому вопросу этот ответ? *
            </Text>
            <Box
              as="select"
              name="question"
              value={formData.question}
              onChange={handleChange}
              w="full"
              p={{ base: 2.5, md: 3 }}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              fontSize={{ base: 'sm', md: 'md' }}
              required
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              {Object.entries(questionsByDiscipline).map(([disciplineId, disciplineQuestions]) => (
                <optgroup key={disciplineId} label={disciplines[disciplineId]?.title || 'Без дисциплины'}>
                  {disciplineQuestions.map((q) => (
                    <option key={q.id} value={q.id}>
                      #{q.number} — {q.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Box>
            <Text fontSize="xs" color="gray.500" mt={1}>
              После выбора вопроса поля ниже заполнятся автоматически
            </Text>
          </Box>
        </Box>

        {/* Метаданные */}
        <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow="sm" w="full" minW={0}>
          <Heading size={{ base: 'sm', md: 'md' }} mb={4}>2️⃣ Информация об ответе</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Номер ответа *
              </Text>
              <Input
                name="number"
                type="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="1"
                required
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Обычно совпадает с номером вопроса
              </Text>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Название дисциплины
              </Text>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Заполнится автоматически"
              />
            </Box>
          </SimpleGrid>

          <Box mt={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Описание ответа
            </Text>
            <Input
              name="decription"
              value={formData.decription}
              onChange={handleChange}
              placeholder="Краткое описание (обычно = название вопроса)"
            />
          </Box>
        </Box>

        {/* Тип структуры */}
        <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow="sm" w="full" minW={0}>
          <Heading size={{ base: 'sm', md: 'md' }} mb={4}>3️⃣ Тип ответа</Heading>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Выберите тип, который лучше всего подходит для вашего вопроса
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            {STRUCTURE_TYPES.map((type) => (
              <Box
                key={type.value}
                p={4}
                borderRadius="lg"
                border="2px solid"
                borderColor={formData.structure_type === type.value ? 'blue.500' : 'gray.200'}
                bg={formData.structure_type === type.value ? 'blue.50' : 'white'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'blue.300' }}
                onClick={() => setFormData(prev => ({ ...prev, structure_type: type.value }))}
              >
                <Text fontWeight="bold" mb={1}>{type.label}</Text>
                <Text fontSize="sm" color="gray.600">{type.hint}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Содержимое ответа */}
        <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow="sm" w="full" minW={0}>
          <Heading size={{ base: 'sm', md: 'md' }} mb={2}>4️⃣ Содержимое ответа</Heading>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Тип: <strong>{selectedType?.label}</strong> — {selectedType?.hint}
          </Text>
          
          <AnswerContentEditor
            structureType={formData.structure_type}
            content={content}
            onChange={setContent}
          />
        </Box>

        {/* Actions */}
        <HStack 
          spacing={4} 
          justify="flex-end" 
          flexWrap="wrap"
          gap={2}
          w="full"
        >
          <Button
            variant="outline"
            onClick={() => navigate(ADMIN_ROUTES.ANSWERS)}
            size={{ base: 'sm', md: 'md' }}
            w={{ base: 'full', sm: 'auto' }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            size={{ base: 'sm', md: 'lg' }}
            loading={isLoading}
            loadingText="Сохранение..."
            w={{ base: 'full', sm: 'auto' }}
          >
            {isEdit ? '💾 Сохранить изменения' : '✅ Создать ответ'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default AnswerForm
