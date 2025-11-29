import { Box, Heading, Text } from '@chakra-ui/react'
import AnswerForm from '@/admin/components/AnswerForm'

const AnswerCreate = () => {
  return (
    <Box>
      <Box mb={6}>
        <Heading size="lg">Новый ответ</Heading>
        <Text color="gray.500">Создание нового ответа</Text>
      </Box>

      <AnswerForm />
    </Box>
  )
}

export default AnswerCreate

