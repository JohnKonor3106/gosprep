import { Box, Heading, Text } from '@chakra-ui/react'
import QuestionForm from '@/admin/components/QuestionForm'

const QuestionCreate = () => {
  return (
    <Box>
      <Box mb={6}>
        <Heading size="lg">Новый вопрос</Heading>
        <Text color="gray.500">Создание нового вопроса</Text>
      </Box>

      <QuestionForm />
    </Box>
  )
}

export default QuestionCreate

