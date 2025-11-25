// components/QuestionDetail.jsx
import { useParams } from 'react-router-dom'
import { Box, Text, Heading, Flex, Stack, Separator, Badge, HStack } from '@chakra-ui/react'
import { AnswerRenderer } from '@/components/render/AnswerRenderer'
import { useAppStore } from '@/state/stateApp'
import { STRUCTURE_TYPE_TITLES, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/constants'

const QuestionDetail = () => {
  const { disciplineId, id } = useParams()
  const { disciplines } = useAppStore()
  
  // Получаем данные дисциплины из store
  const discipline = disciplines[disciplineId]
  const questions = discipline?.questions || []
  const answers = discipline?.answers || {}

  // id из useParams -- строка, но question.id может быть числом или строкой.
  const question = questions.find((q) => String(q.id) === String(id))

  if (!question) {
    return (
      <Box p={4}>
        <Text color="red.500">Вопрос не найден</Text>
      </Box>
    )
  }

  // Поиск ответа в переданном объекте ответов
  let answer = null;
  if (answers && Array.isArray(answers.answers)) {
    answer = answers.answers.find((a) => String(a.id) === String(question.id))
  }

  const structureLabel = STRUCTURE_TYPE_TITLES[question.structure_type] || 'Учебный модуль'
  const difficulty = question.difficulty
  const hasMeta =
    difficulty ||
    question.estimated_time_minutes ||
    (Array.isArray(question.tags) && question.tags.length > 0) ||
    (Array.isArray(question.sources) && question.sources.length > 0)

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      align="stretch"
      gap={{ base: 4, lg: 6 }}
      h={{ base: 'auto', lg: '72vh' }}
    >
      <Box
        w={{ base: '100%', lg: '380px' }}
        flexShrink={0}
        h={{ base: 'auto', lg: '800px' }}
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
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>{question.id}</Heading>
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
              {/* Сложность и время */}
              {(difficulty || question.estimated_time_minutes) && (
                <HStack spacing={3} flexWrap="wrap">
                  {difficulty && (
                    <Badge
                      colorScheme={DIFFICULTY_COLORS[difficulty] || 'blue'}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      Сложность: {DIFFICULTY_LABELS[difficulty] || difficulty}
                    </Badge>
                  )}
                  {question.estimated_time_minutes && (
                    <Text fontSize="sm" color="whiteAlpha.800">
                      Время на подготовку: ~{question.estimated_time_minutes} мин
                    </Text>
                  )}
                </HStack>
              )}

              {/* Теги */}
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

              {/* Нормативные источники */}
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
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box
        flex="1"
        bg="white"
        h={{ base: '100%', lg: '800px' }}
        p={{ base: 5, md: 8 }}
        borderRadius="2xl"
        boxShadow="2xl"
        border="1px solid"
        borderColor="gray.100"
        overflowY="auto"
       
      >
        {answer ? AnswerRenderer(answer) : <Text color="gray.500">Ответ не найден</Text>}
      </Box>
    </Flex>
  )
}

export default QuestionDetail
