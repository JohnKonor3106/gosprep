import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Badge,
  HStack,
  VStack,
  Button,
  IconButton,
} from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import { ADMIN_ROUTES } from '@/admin/constants/routes'

const DisciplinesList = () => {
  const navigate = useNavigate()
  const [disciplines, setDisciplines] = useState([])
  const [questionsCount, setQuestionsCount] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Загружаем дисциплины
      const records = await pb.collection('disciplines').getFullList({
        sort: 'order',
      })
      setDisciplines(records)

      // Загружаем количество вопросов
      const questions = await pb.collection('questions').getFullList({
        fields: 'id,discipline',
      })
      
      const counts = {}
      questions.forEach((q) => {
        counts[q.discipline] = (counts[q.discipline] || 0) + 1
      })
      setQuestionsCount(counts)
    } catch (error) {
      console.error('Ошибка загрузки дисциплин:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Удалить эту дисциплину? Все связанные вопросы и ответы останутся без привязки.')) return

    try {
      await pb.collection('disciplines').delete(id)
      setDisciplines((prev) => prev.filter((d) => d.id !== id))
    } catch (error) {
      console.error('Ошибка удаления:', error)
      alert('Ошибка удаления дисциплины: ' + error.message)
    }
  }

  const handleEdit = (e, id) => {
    e.stopPropagation()
    navigate(ADMIN_ROUTES.DISCIPLINE_EDIT(id))
  }

  if (isLoading) {
    return (
      <Box py={12} textAlign="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Дисциплины</Heading>
          <Text color="gray.500">Управление дисциплинами</Text>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => navigate(ADMIN_ROUTES.DISCIPLINE_CREATE)}
        >
          + Добавить дисциплину
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {disciplines.map((discipline) => (
          <Box
            key={discipline.id}
            bg="white"
            p={5}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              boxShadow: 'md',
              borderColor: 'blue.200',
            }}
            onClick={() => navigate(`${ADMIN_ROUTES.QUESTIONS}?discipline=${discipline.id}`)}
          >
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <Badge colorScheme="purple" fontSize="xs">
                  {discipline.category || 'humanitarian'}
                </Badge>
                <HStack spacing={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => handleEdit(e, discipline.id)}
                    title="Редактировать"
                  >
                    ✏️
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => handleDelete(e, discipline.id)}
                    title="Удалить"
                  >
                    🗑️
                  </Button>
                </HStack>
              </HStack>
              <Text fontWeight="bold" fontSize="lg">
                {discipline.title}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={2}>
                {discipline.description || 'Нет описания'}
              </Text>
              <HStack spacing={4} pt={2}>
                <Badge colorScheme="blue">
                  {questionsCount[discipline.id] || 0} вопросов
                </Badge>
                <Text fontSize="xs" color="gray.400">
                  slug: {discipline.slug}
                </Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {disciplines.length === 0 && (
        <Box py={12} textAlign="center">
          <Text color="gray.500">Нет дисциплин</Text>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => navigate(ADMIN_ROUTES.DISCIPLINE_CREATE)}
          >
            Создать первую дисциплину
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default DisciplinesList
