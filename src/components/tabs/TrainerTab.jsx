import { useState, useMemo, useCallback } from 'react'
import { 
  Box, Text, Heading, VStack, HStack, Badge, Button, Card, Stack, 
  SimpleGrid, Progress, Flex
} from '@chakra-ui/react'
import { TRAINER_MODES, DIFFICULTY_OPTIONS, INITIAL_SESSION_STATS } from '@/constants'

/**
 * Тренажер для самоподготовки по дисциплине
 * 
 * Режимы работы:
 * - flashcards: Карточки - показ вопроса, по клику раскрытие ключевых аспектов
 * - quiz: Викторина - последовательный проход по вопросам с оценкой
 * - random: Случайный вопрос - для быстрой проверки
 * 
 * @param {Object} props
 * @param {Array} props.questions - Массив вопросов дисциплины
 * @param {string} props.disciplineId - ID дисциплины
 */

// Иконки
const ShuffleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16,3 21,3 21,8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21,16 21,21 16,21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
)

const CardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
)

// Утилита для перемешивания массива
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const TrainerTab = ({ questions = [], disciplineId }) => {
  // Состояние тренажера
  const [mode, setMode] = useState(TRAINER_MODES.SELECT)
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    reviewed: [],
  })

  // Фильтрация вопросов по сложности
  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === 'all') return questions
    return questions.filter(q => q.difficulty === difficultyFilter)
  }, [questions, difficultyFilter])

  // Текущий вопрос
  const currentQuestion = useMemo(() => {
    const questionList = mode === TRAINER_MODES.FLASHCARDS || mode === TRAINER_MODES.QUIZ
      ? shuffledQuestions
      : filteredQuestions
    return questionList[currentIndex] || null
  }, [shuffledQuestions, filteredQuestions, currentIndex, mode])

  // Прогресс сессии
  const progress = useMemo(() => {
    const total = shuffledQuestions.length
    if (total === 0) return 0
    return Math.round(((sessionStats.correct + sessionStats.incorrect + sessionStats.skipped) / total) * 100)
  }, [shuffledQuestions.length, sessionStats])

  // Начать режим
  const startMode = useCallback((selectedMode) => {
    const questionsToUse = filteredQuestions
    if (questionsToUse.length === 0) return

    setShuffledQuestions(shuffleArray(questionsToUse))
    setCurrentIndex(0)
    setShowAnswer(false)
    setSessionStats({ correct: 0, incorrect: 0, skipped: 0, reviewed: [] })
    setMode(selectedMode)
  }, [filteredQuestions])

  // Случайный вопрос
  const getRandomQuestion = useCallback(() => {
    if (filteredQuestions.length === 0) return
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
    setCurrentIndex(randomIndex)
    setShowAnswer(false)
    setMode(TRAINER_MODES.RANDOM)
  }, [filteredQuestions])

  // Навигация
  const goToNext = useCallback(() => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
    } else {
      setMode(TRAINER_MODES.RESULTS)
    }
  }, [currentIndex, shuffledQuestions.length])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setShowAnswer(false)
    }
  }, [currentIndex])

  // Оценка ответа (для викторины)
  const rateAnswer = useCallback((rating) => {
    setSessionStats(prev => ({
      ...prev,
      [rating]: prev[rating] + 1,
      reviewed: [...prev.reviewed, { questionId: currentQuestion?.id, rating }]
    }))
    goToNext()
  }, [currentQuestion, goToNext])

  // Сброс
  const resetTrainer = useCallback(() => {
    setMode(TRAINER_MODES.SELECT)
    setCurrentIndex(0)
    setShowAnswer(false)
    setShuffledQuestions([])
    setSessionStats({ correct: 0, incorrect: 0, skipped: 0, reviewed: [] })
  }, [])

  // Если нет вопросов
  if (questions.length === 0) {
    return (
      <Box p={6} bg="gray.50" borderRadius="lg" textAlign="center">
        <Text color="gray.500">Вопросы для тренажера не найдены</Text>
      </Box>
    )
  }

  // Экран выбора режима
  if (mode === TRAINER_MODES.SELECT) {
    return (
      <VStack gap={6} align="stretch">
        {/* Фильтр по сложности */}
        <Card.Root variant="outline">
          <Card.Body>
            <Text fontWeight="semibold" mb={3}>Фильтр по сложности</Text>
            <HStack gap={2} flexWrap="wrap">
              {DIFFICULTY_OPTIONS.map(opt => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={difficultyFilter === opt.value ? 'solid' : 'outline'}
                  colorPalette={difficultyFilter === opt.value ? 'blue' : 'gray'}
                  onClick={() => setDifficultyFilter(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </HStack>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Доступно вопросов: {filteredQuestions.length} из {questions.length}
            </Text>
          </Card.Body>
        </Card.Root>

        {/* Выбор режима */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <ModeCard
            title="📚 Карточки"
            description="Изучайте вопросы в режиме флеш-карточек. Нажмите на карточку, чтобы увидеть ключевые аспекты."
            color="blue"
            onClick={() => startMode(TRAINER_MODES.FLASHCARDS)}
            disabled={filteredQuestions.length === 0}
            icon={<CardIcon />}
          />
          <ModeCard
            title="✅ Викторина"
            description="Проверьте свои знания. После каждого вопроса оцените, насколько хорошо вы его знаете."
            color="green"
            onClick={() => startMode(TRAINER_MODES.QUIZ)}
            disabled={filteredQuestions.length === 0}
            icon={<CheckIcon />}
          />
          <ModeCard
            title="🎲 Случайный"
            description="Получите случайный вопрос для быстрой проверки знаний."
            color="purple"
            onClick={getRandomQuestion}
            disabled={filteredQuestions.length === 0}
            icon={<ShuffleIcon />}
          />
        </SimpleGrid>

        {/* Статистика */}
        <Card.Root variant="subtle" bg="gray.50">
          <Card.Body>
            <Heading size="sm" mb={3}>📊 Статистика дисциплины</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              <StatItem label="Всего вопросов" value={questions.length} />
              <StatItem label="Базовых" value={questions.filter(q => q.difficulty === 'easy').length} />
              <StatItem label="Средних" value={questions.filter(q => q.difficulty === 'medium').length} />
              <StatItem label="Сложных" value={questions.filter(q => q.difficulty === 'hard').length} />
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </VStack>
    )
  }

  // Экран результатов
  if (mode === TRAINER_MODES.RESULTS) {
    const total = sessionStats.correct + sessionStats.incorrect + sessionStats.skipped
    const percentage = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0

    return (
      <VStack gap={6} align="stretch">
        <Card.Root variant="outline" borderColor="blue.200" bg="blue.50">
          <Card.Body>
            <VStack gap={4}>
              <Heading size="lg" color="blue.700">🎉 Сессия завершена!</Heading>
              
              <SimpleGrid columns={3} gap={4} w="full">
                <ResultCard label="Знаю" value={sessionStats.correct} color="green" />
                <ResultCard label="Повторить" value={sessionStats.incorrect} color="red" />
                <ResultCard label="Пропущено" value={sessionStats.skipped} color="gray" />
              </SimpleGrid>

              <Box w="full">
                <Text fontSize="sm" color="gray.600" mb={1}>Результат</Text>
                <Progress.Root value={percentage} colorPalette={percentage >= 70 ? 'green' : percentage >= 40 ? 'yellow' : 'red'}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
                <Text fontSize="lg" fontWeight="bold" color="blue.700" mt={1}>{percentage}%</Text>
              </Box>

              <HStack gap={3}>
                <Button colorPalette="blue" onClick={() => startMode(TRAINER_MODES.QUIZ)}>
                  <RefreshIcon />
                  Начать заново
                </Button>
                <Button variant="outline" colorPalette="gray" onClick={resetTrainer}>
                  К выбору режима
                </Button>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    )
  }

  // Экран тренировки (Карточки / Викторина / Случайный)
  return (
    <VStack gap={4} align="stretch">
      {/* Хедер с прогрессом */}
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
        <Button size="sm" variant="ghost" onClick={resetTrainer}>
          <ArrowLeftIcon />
          Назад
        </Button>
        
        {mode !== TRAINER_MODES.RANDOM && (
          <HStack gap={2}>
            <Text fontSize="sm" color="gray.600">
              {currentIndex + 1} / {shuffledQuestions.length}
            </Text>
            <Box w="100px">
              <Progress.Root value={progress} size="sm" colorPalette="blue">
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>
          </HStack>
        )}

        {mode === TRAINER_MODES.RANDOM && (
          <Button size="sm" colorPalette="purple" onClick={getRandomQuestion}>
            <ShuffleIcon />
            Другой вопрос
          </Button>
        )}
      </Flex>

      {/* Карточка вопроса */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          showAnswer={showAnswer}
          onFlip={() => setShowAnswer(!showAnswer)}
          mode={mode}
        />
      )}

      {/* Навигация / Оценка */}
      {mode === TRAINER_MODES.FLASHCARDS && (
        <HStack justify="center" gap={3}>
          <Button 
            variant="outline" 
            onClick={goToPrev} 
            disabled={currentIndex === 0}
          >
            <ArrowLeftIcon />
            Назад
          </Button>
          <Button 
            colorPalette="blue" 
            onClick={goToNext}
          >
            {currentIndex < shuffledQuestions.length - 1 ? 'Далее' : 'Завершить'}
            <ArrowRightIcon />
          </Button>
        </HStack>
      )}

      {mode === TRAINER_MODES.QUIZ && showAnswer && (
        <VStack gap={3}>
          <Text fontWeight="semibold" color="gray.600">Как хорошо вы знаете этот вопрос?</Text>
          <HStack justify="center" gap={3}>
            <Button colorPalette="green" onClick={() => rateAnswer('correct')}>
              ✅ Знаю
            </Button>
            <Button colorPalette="red" onClick={() => rateAnswer('incorrect')}>
              ❌ Повторить
            </Button>
            <Button variant="outline" onClick={() => rateAnswer('skipped')}>
              ⏭️ Пропустить
            </Button>
          </HStack>
        </VStack>
      )}

      {mode === TRAINER_MODES.QUIZ && !showAnswer && (
        <HStack justify="center">
          <Button colorPalette="blue" size="lg" onClick={() => setShowAnswer(true)}>
            Показать ответ
          </Button>
        </HStack>
      )}
    </VStack>
  )
}

// Карточка выбора режима
const ModeCard = ({ title, description, color, onClick, disabled, icon }) => (
  <Card.Root 
    variant="outline" 
    borderColor={`${color}.200`}
    bg={`${color}.50`}
    cursor={disabled ? 'not-allowed' : 'pointer'}
    opacity={disabled ? 0.5 : 1}
    onClick={disabled ? undefined : onClick}
    _hover={disabled ? {} : { shadow: 'md', transform: 'translateY(-2px)' }}
    transition="all 0.2s"
  >
    <Card.Body>
      <VStack gap={2} align="start">
        <HStack>
          {icon}
          <Heading size="md" color={`${color}.700`}>{title}</Heading>
        </HStack>
        <Text fontSize="sm" color="gray.600">{description}</Text>
      </VStack>
    </Card.Body>
  </Card.Root>
)

// Карточка статистики
const StatItem = ({ label, value }) => (
  <Box textAlign="center">
    <Text fontSize="2xl" fontWeight="bold" color="blue.600">{value}</Text>
    <Text fontSize="xs" color="gray.500">{label}</Text>
  </Box>
)

// Карточка результата
const ResultCard = ({ label, value, color }) => (
  <Box textAlign="center" p={3} bg={`${color}.100`} borderRadius="md">
    <Text fontSize="2xl" fontWeight="bold" color={`${color}.700`}>{value}</Text>
    <Text fontSize="sm" color={`${color}.600`}>{label}</Text>
  </Box>
)

// Карточка вопроса
const QuestionCard = ({ question, showAnswer, onFlip, mode }) => {
  const difficultyColors = {
    easy: 'green',
    medium: 'yellow', 
    hard: 'red',
  }
  const difficultyLabels = {
    easy: 'Базовый',
    medium: 'Средний',
    hard: 'Повышенный',
  }

  return (
    <Card.Root 
      variant="outline" 
      borderColor="blue.200"
      minH="300px"
      cursor={mode === TRAINER_MODES.FLASHCARDS ? 'pointer' : 'default'}
      onClick={mode === TRAINER_MODES.FLASHCARDS ? onFlip : undefined}
      _hover={mode === TRAINER_MODES.FLASHCARDS ? { shadow: 'lg' } : {}}
      transition="all 0.3s"
    >
      <Card.Body>
        <VStack gap={4} align="stretch" h="full">
          {/* Заголовок */}
          <Flex justify="space-between" align="start" flexWrap="wrap" gap={2}>
            <Badge colorPalette="blue" size="lg">Вопрос #{question.id}</Badge>
            <HStack gap={2}>
              {question.difficulty && (
                <Badge colorPalette={difficultyColors[question.difficulty]} size="sm">
                  {difficultyLabels[question.difficulty]}
                </Badge>
              )}
              {question.estimated_time_minutes && (
                <Badge colorPalette="gray" size="sm">~{question.estimated_time_minutes} мин</Badge>
              )}
            </HStack>
          </Flex>

          {/* Вопрос */}
          <Box flex={1}>
            <Heading size="md" color="gray.800" mb={2}>
              {question.title || question.topic}
            </Heading>
            {question.topic && question.title && (
              <Text color="gray.600" fontSize="sm">{question.topic}</Text>
            )}
          </Box>

          {/* Ответ (ключевые аспекты) */}
          {showAnswer && question.key_aspects && (
            <Box 
              bg="green.50" 
              p={4} 
              borderRadius="md" 
              borderLeft="4px solid"
              borderColor="green.400"
            >
              <Text fontWeight="semibold" color="green.700" mb={2}>
                🔑 Ключевые аспекты:
              </Text>
              <Stack gap={2}>
                {question.key_aspects.map((aspect, index) => (
                  <HStack key={index} align="start">
                    <Text color="green.600" fontWeight="bold">{index + 1}.</Text>
                    <Text color="gray.700" fontSize="sm">{aspect}</Text>
                  </HStack>
                ))}
              </Stack>
            </Box>
          )}

          {/* Подсказка для флеш-карточек */}
          {mode === TRAINER_MODES.FLASHCARDS && !showAnswer && (
            <Text fontSize="sm" color="gray.400" textAlign="center" fontStyle="italic">
              Нажмите на карточку, чтобы увидеть ключевые аспекты
            </Text>
          )}

          {/* Теги */}
          {question.tags && question.tags.length > 0 && (
            <HStack gap={1} flexWrap="wrap">
              {question.tags.map((tag, index) => (
                <Badge key={index} colorPalette="gray" size="sm" variant="subtle">
                  {tag}
                </Badge>
              ))}
            </HStack>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

