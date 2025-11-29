import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Heading, Text, Spinner } from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import DisciplineForm from '@/admin/components/DisciplineForm'

const DisciplineEdit = () => {
  const { id } = useParams()
  const [discipline, setDiscipline] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDiscipline = async () => {
      try {
        const record = await pb.collection('disciplines').getOne(id)
        setDiscipline(record)
      } catch (err) {
        console.error('Ошибка загрузки дисциплины:', err)
        setError('Дисциплина не найдена')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadDiscipline()
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
        <Heading size="lg">Редактирование дисциплины</Heading>
        <Text color="gray.500">{discipline?.title}</Text>
      </Box>

      <DisciplineForm discipline={discipline} isEdit />
    </Box>
  )
}

export default DisciplineEdit

