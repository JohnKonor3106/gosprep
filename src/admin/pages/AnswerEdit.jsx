import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Heading, Text, Spinner } from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import AnswerForm from '@/admin/components/AnswerForm'

const AnswerEdit = () => {
  const { id } = useParams()
  const [answer, setAnswer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAnswer = async () => {
      try {
        const record = await pb.collection('answers').getOne(id)
        setAnswer(record)
      } catch (err) {
        console.error('Ошибка загрузки ответа:', err)
        setError('Ответ не найден')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadAnswer()
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
        <Heading size="lg">Редактирование ответа</Heading>
        <Text color="gray.500">Ответ #{answer?.number}</Text>
      </Box>

      <AnswerForm answer={answer} isEdit />
    </Box>
  )
}

export default AnswerEdit

