import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  Textarea,
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

// Типы структуры ответа
const STRUCTURE_TYPES = [
  { value: 'system_analysis', label: 'Системный анализ' },
  { value: 'control_mechanisms', label: 'Механизмы контроля' },
  { value: 'activity_organization', label: 'Организация деятельности' },
  { value: 'concept_analysis', label: 'Анализ концепции' },
  { value: 'procedural', label: 'Процедурный' },
  { value: 'feature_analysis', label: 'Анализ особенностей' },
  { value: 'comparative_analysis', label: 'Сравнительный анализ' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Лёгкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'hard', label: 'Сложный' },
]

const IMPORTANCE_OPTIONS = [
  { value: 'core', label: 'Основной' },
  { value: 'often', label: 'Частый' },
  { value: 'rare', label: 'Редкий' },
]

const QuestionForm = ({ question = null, isEdit = false }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [disciplines, setDisciplines] = useState([])

  // Form state
  const [formData, setFormData] = useState({
    discipline: question?.discipline || '',
    number: question?.number || '',
    title: question?.title || '',
    topic: question?.topic || '',
    prompt: question?.prompt || '',
    structure_type: question?.structure_type || 'system_analysis',
    question_type: question?.question_type || 'theory',
    difficulty: question?.difficulty || 'medium',
    importance: question?.importance || 'core',
    estimated_time_minutes: question?.estimated_time_minutes || 20,
    key_aspects: question?.key_aspects?.join('\n') || '',
    tags: question?.tags?.join(', ') || '',
    sources: question?.sources?.join('\n') || '',
    learning_goals: question?.learning_goals?.join('\n') || '',
    ai_instructions: question?.ai_instructions || '',
  })

  // Загрузка дисциплин
  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const records = await pb.collection('disciplines').getFullList({
          sort: 'order',
        })
        setDisciplines(records)
        
        // Если нет выбранной дисциплины — выбираем первую
        if (!formData.discipline && records.length > 0) {
          setFormData((prev) => ({ ...prev, discipline: records[0].id }))
        }
      } catch (err) {
        console.error('Ошибка загрузки дисциплин:', err)
      }
    }
    loadDisciplines()
  }, [])

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
        discipline: formData.discipline,
        number: parseInt(formData.number, 10),
        title: formData.title,
        topic: formData.topic,
        prompt: formData.prompt,
        structure_type: formData.structure_type,
        question_type: formData.question_type,
        difficulty: formData.difficulty,
        importance: formData.importance,
        estimated_time_minutes: parseInt(formData.estimated_time_minutes, 10) || 0,
        key_aspects: formData.key_aspects.split('\n').filter(Boolean),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        sources: formData.sources.split('\n').filter(Boolean),
        learning_goals: formData.learning_goals.split('\n').filter(Boolean),
        ai_instructions: formData.ai_instructions,
      }

      // Добавляем поля аудита (кто изменил)
      const data = withAuditFields(baseData, isEdit)

      if (isEdit && question?.id) {
        await pb.collection('questions').update(question.id, data)
      } else {
        await pb.collection('questions').create(data)
      }

      navigate(ADMIN_ROUTES.QUESTIONS)
    } catch (err) {
      console.error('Ошибка сохранения:', err)
      setError(err.message || 'Ошибка сохранения вопроса')
    } finally {
      setIsLoading(false)
    }
  }

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
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <Heading size="md" mb={4}>Основная информация</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Дисциплина *
              </Text>
              <Box
                as="select"
                name="discipline"
                value={formData.discipline}
                onChange={handleChange}
                w="full"
                p={2}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                required
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </Box>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Номер вопроса *
              </Text>
              <Input
                name="number"
                type="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="1"
                required
              />
            </Box>
          </SimpleGrid>

          <Box mt={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Название вопроса *
            </Text>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Как проанализировать..."
              required
            />
          </Box>

          <Box mt={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Тема
            </Text>
            <Input
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Система МВД: учебный анализ"
            />
          </Box>

          <Box mt={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Промпт (полный текст вопроса)
            </Text>
            <Textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              placeholder="Как проанализировать организационно-правовой статус..."
              rows={3}
            />
          </Box>
        </Box>

        {/* Категории */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <Heading size="md" mb={4}>Категории</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Тип структуры
              </Text>
              <Box
                as="select"
                name="structure_type"
                value={formData.structure_type}
                onChange={handleChange}
                w="full"
                p={2}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                {STRUCTURE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Box>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Сложность
              </Text>
              <Box
                as="select"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                w="full"
                p={2}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Box>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Важность
              </Text>
              <Box
                as="select"
                name="importance"
                value={formData.importance}
                onChange={handleChange}
                w="full"
                p={2}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                {IMPORTANCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Box>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Время (минуты)
              </Text>
              <Input
                name="estimated_time_minutes"
                type="number"
                value={formData.estimated_time_minutes}
                onChange={handleChange}
                placeholder="20"
              />
            </Box>
          </SimpleGrid>
        </Box>

        {/* Дополнительные поля */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <Heading size="md" mb={4}>Детали</Heading>
          
          <Box mb={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Ключевые аспекты (каждый с новой строки)
            </Text>
            <Textarea
              name="key_aspects"
              value={formData.key_aspects}
              onChange={handleChange}
              placeholder="Нормативная база&#10;Структура&#10;Функции"
              rows={4}
            />
          </Box>

          <Box mb={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Теги (через запятую)
            </Text>
            <Input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="МВД, полиция, административное право"
            />
          </Box>

          <Box mb={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Источники (каждый с новой строки)
            </Text>
            <Textarea
              name="sources"
              value={formData.sources}
              onChange={handleChange}
              placeholder="ФЗ 'О полиции'&#10;Указ Президента РФ №696"
              rows={3}
            />
          </Box>

          <Box mb={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Цели обучения (каждая с новой строки)
            </Text>
            <Textarea
              name="learning_goals"
              value={formData.learning_goals}
              onChange={handleChange}
              placeholder="понимать место МВД в системе&#10;уметь выделять основные элементы"
              rows={3}
            />
          </Box>

          <Box>
            <Text mb={1} fontSize="sm" fontWeight="medium">
              Инструкции для AI
            </Text>
            <Textarea
              name="ai_instructions"
              value={formData.ai_instructions}
              onChange={handleChange}
              placeholder="Структурируй ответ: краткое определение, затем элементы..."
              rows={3}
            />
          </Box>
        </Box>

        {/* Actions */}
        <HStack spacing={4} justify="flex-end">
          <Button
            variant="outline"
            onClick={() => navigate(ADMIN_ROUTES.QUESTIONS)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            loading={isLoading}
            loadingText="Сохранение..."
          >
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default QuestionForm

