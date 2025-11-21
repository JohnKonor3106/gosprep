// components/QuestionDetail.jsx
import { useParams } from 'react-router-dom'
import { Box, Text, Heading, Flex } from '@chakra-ui/react'
import { getSpecificAdministrationPoliceAnswer } from '@/utils/utils'
import { AnswerRenderer } from '@/components/render/AnswerRenderer'

const QuestionDetail = ({ questions = [] }) => {
  const { id } = useParams()

  // id из useParams -- строка, но question.id может быть числом или строкой.
  // Исправляем возможное несоответствие типов (например если question.id — строка)
  const question = questions.find((q) => String(q.id) === String(id))

  if (!question) {
    return (
      <Box p={4}>
        <Text color="red.500">Вопрос не найден</Text>
      </Box>
    )
  }

  // getSpecificAdministrationPoliceAnswer должно принимать строковый или числовой id, уточняем приводя к правильному типу.
  const answer = getSpecificAdministrationPoliceAnswer(question.id)

  return (
    <Flex>
      <Box p={4} shadow="md" w="400px" minH="100vh" bg="blue.500">
        <Text color="black" fontSize="xl" fontWeight="bold">
          Вопрос {question.id}
        </Text>
        <Text color="white" mt={4}>
          {question.title}
        </Text>
        <Text color="white" mt={4}>
          {question.topic}
        </Text>
        <Heading color="black" as="h2" mt={4} fontSize="xl" fontWeight="bold">
          Ключевые аспекты
        </Heading>
        {!!question.key_aspects &&
          Array.isArray(question.key_aspects) &&
          question.key_aspects.map((aspect, index) => (
            <Text color="white" mt={2} key={index}>
              • {aspect}
            </Text>
          ))}
      </Box>
      <Box w="1000px" minH="100vh" p={4}>
        {AnswerRenderer(answer)}
      </Box>
    </Flex>
  )
}

export default QuestionDetail
