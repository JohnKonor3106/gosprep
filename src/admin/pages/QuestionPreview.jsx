import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Text, Heading, Flex, Stack, Separator, Badge, HStack, VStack, Spinner, Button } from '@chakra-ui/react'
import { AnswerRenderer } from '@/components/render/AnswerRenderer'
import { pb } from '@/services/pocketbase'
import { ADMIN_ROUTES } from '@/admin/constants/routes'
import { STRUCTURE_TYPE_TITLES, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/constants'

const QuestionPreview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState(null)
  const [discipline, setDiscipline] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Загружаем вопрос
        const questionRecord = await pb.collection('questions').getOne(id)
        setQuestion(questionRecord)

        // Загружаем дисциплину
        if (questionRecord.discipline) {
          const disciplineRecord = await pb.collection('disciplines').getOne(questionRecord.discipline)
          setDiscipline(disciplineRecord)
        }

        // Загружаем ответ
        const answers = await pb.collection('answers').getFullList({
          filter: `question = "${id}"`,
          limit: 1,
        })

        if (answers.length > 0) {
          setAnswer(answers[0])
        }
      } catch (err) {
        console.error('Ошибка загрузки:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])

  if (isLoading) {
    return (
      <Box py={12} textAlign="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (error || !question) {
    return (
      <Box py={12} textAlign="center">
        <Text color="red.500">{error || 'Вопрос не найден'}</Text>
      </Box>
    )
  }

  const structureLabel = STRUCTURE_TYPE_TITLES?.[question.structure_type] || 'Учебный модуль'
  const difficulty = question.difficulty
  const hasMeta =
    difficulty ||
    question.estimated_time_minutes ||
    (Array.isArray(question.tags) && question.tags.length > 0) ||
    (Array.isArray(question.sources) && question.sources.length > 0)

  return (
    <Box>
      {/* Header */}
      <VStack align={{ base: 'stretch', md: 'flex-start' }} spacing={4} mb={6}>
        <Box w="full">
          <Heading size={{ base: 'md', md: 'lg' }}>Превью вопроса</Heading>
          <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>
            {discipline?.title} — Вопрос #{question.number}
          </Text>
        </Box>
        <HStack spacing={2} w={{ base: 'full', md: 'auto' }} flexWrap="wrap" gap={2}>
          <Button
            variant="outline"
            onClick={() => navigate(ADMIN_ROUTES.QUESTIONS)}
            size={{ base: 'xs', sm: 'sm', md: 'md' }}
            w={{ base: 'full', sm: 'auto' }}
          >
            ← К списку
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => navigate(ADMIN_ROUTES.QUESTION_EDIT(question.id))}
            size={{ base: 'xs', sm: 'sm', md: 'md' }}
            w={{ base: 'full', sm: 'auto' }}
          >
            Редактировать
          </Button>
        </HStack>
      </VStack>

      {/* Preview как на основном сайте */}
      <Box w="full" overflowX="auto" minW={0}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="stretch"
          gap={{ base: 4, lg: 6 }}
          minH="70vh"
          minW={{ base: '100%', lg: '800px' }}
        >
        {/* Левая колонка — вопрос */}
        <Box
          w={{ base: '100%', lg: '380px' }}
          flexShrink={0}
          bg="blue.600"
          color="white"
          borderRadius="2xl"
          p={{ base: 5, md: 6 }}
          boxShadow="2xl"
          border="1px solid"
          borderColor="blue.400"
          position="relative"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          <Box
            position="absolute"
            inset="0"
            opacity={0.35}
            bgGradient="linear(135deg, rgba(255,255,255,0.3), transparent 70%)"
          />
          <Stack spacing={4} position="relative" zIndex={1} h="100%">
            <Box>
              <Text fontSize="sm" textTransform="uppercase" color="whiteAlpha.700">
                Вопрос
              </Text>
              <Heading fontSize={{ base: '3xl', md: '4xl' }}>{question.number}</Heading>
            </Box>

            <Stack spacing={2}>
              <Text fontSize="lg" fontWeight="semibold">
                {question.title}
              </Text>
              <Text color="whiteAlpha.800">{question.topic}</Text>
            </Stack>

            <Box
              alignSelf="flex-start"
              bg="whiteAlpha.200"
              borderRadius="full"
              px={4}
              py={1}
              fontSize="sm"
              fontWeight="medium"
            >
              {structureLabel}
            </Box>

            {hasMeta && (
              <Stack spacing={3}>
                {(difficulty || question.estimated_time_minutes) && (
                  <HStack spacing={3} flexWrap="wrap">
                    {difficulty && (
                      <Badge
                        colorScheme={DIFFICULTY_COLORS?.[difficulty] || 'blue'}
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        Сложность: {DIFFICULTY_LABELS?.[difficulty] || difficulty}
                      </Badge>
                    )}
                    {question.estimated_time_minutes && (
                      <Text fontSize="sm" color="whiteAlpha.800">
                        Время: ~{question.estimated_time_minutes} мин
                      </Text>
                    )}
                  </HStack>
                )}

                {Array.isArray(question.tags) && question.tags.length > 0 && (
                  <HStack spacing={2} flexWrap="wrap">
                    {question.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="subtle"
                        colorScheme="blue"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                )}

                {Array.isArray(question.sources) && question.sources.length > 0 && (
                  <Box>
                    <Text fontSize="xs" textTransform="uppercase" color="whiteAlpha.700" mb={1}>
                      Источники
                    </Text>
                    <Stack spacing={1}>
                      {question.sources.map((src, index) => (
                        <Text key={index} fontSize="sm" color="whiteAlpha.900">
                          • {src}
                        </Text>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}

            <Separator borderColor="whiteAlpha.300" />

            <Box flex="1" minH="0" display="flex" flexDirection="column">
              <Heading as="h2" fontSize="lg" mb={3}>
                Ключевые аспекты
              </Heading>
              <Box flex="1" overflowY="auto" pr={2}>
                <Stack spacing={3}>
                  {!!question.key_aspects &&
                    Array.isArray(question.key_aspects) &&
                    question.key_aspects.map((aspect, index) => (
                      <Box
                        key={index}
                        bg="whiteAlpha.200"
                        borderRadius="md"
                        p={3}
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                      >
                        <Text>{aspect}</Text>
                      </Box>
                    ))}
                  {(!question.key_aspects || question.key_aspects.length === 0) && (
                    <Text color="whiteAlpha.600" fontSize="sm">
                      Ключевые аспекты не указаны
                    </Text>
                  )}
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Правая колонка — ответ */}
        <Box
          flex="1"
          bg="white"
          p={{ base: 5, md: 8 }}
          borderRadius="2xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor="gray.100"
          overflowY="auto"
          minH="500px"
        >
          {answer ? (
            <>
              <HStack justify="space-between" mb={4} flexWrap="wrap" gap={2}>
                <Badge colorScheme="green" fontSize={{ base: 'xs', md: 'sm' }}>Ответ #{answer.number}</Badge>
                <Button
                  size={{ base: 'xs', sm: 'xs', md: 'sm' }}
                  variant="outline"
                  onClick={() => navigate(ADMIN_ROUTES.ANSWER_EDIT(answer.id))}
                  fontSize={{ base: 'xs', md: 'sm' }}
                >
                  Редактировать ответ
                </Button>
              </HStack>
              {AnswerRenderer({
                ...answer,
                title: answer.decription || answer.title,
              })}
            </>
          ) : (
            <Box textAlign="center" py={12}>
              <Text color="gray.500" mb={4} fontSize={{ base: 'sm', md: 'md' }}>Ответ не найден</Text>
              <Button
                colorScheme="blue"
                onClick={() => navigate(ADMIN_ROUTES.ANSWER_CREATE)}
                size={{ base: 'xs', sm: 'sm', md: 'md' }}
              >
                Создать ответ
              </Button>
            </Box>
          )}
        </Box>
      </Flex>
      </Box>
    </Box>
  )
}

export default QuestionPreview

