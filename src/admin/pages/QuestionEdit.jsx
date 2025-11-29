import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Heading, Text, Spinner } from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import QuestionForm from '@/admin/components/QuestionForm'

const QuestionEdit = () => {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const record = await pb.collection('questions').getOne(id)
        setQuestion(record)
      } catch (err) {
        console.error('Ошибка загрузки вопроса:', err)
        setError('Вопрос не найден')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadQuestion()
    }
  }, [id])

  if (isLoading) {
    return (
      <Box py={12} textAlign="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box py={12} textAlign="center">
        <Text color="red.500">{error}</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Box mb={6}>
        <Heading size="lg">Редактирование вопроса</Heading>
        <Text color="gray.500">Вопрос #{question?.number}</Text>
      </Box>

      <QuestionForm question={question} isEdit />
    </Box>
  )
}

export default QuestionEdit

