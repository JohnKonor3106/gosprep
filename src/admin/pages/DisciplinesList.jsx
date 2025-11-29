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
      <VStack align={{ base: 'stretch', md: 'flex-start' }} spacing={4} mb={6}>
        <Box w="full">
          <Heading size={{ base: 'md', md: 'lg' }}>Дисциплины</Heading>
          <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>Управление дисциплинами</Text>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => navigate(ADMIN_ROUTES.DISCIPLINE_CREATE)}
          size={{ base: 'sm', md: 'md' }}
          w={{ base: 'full', md: 'auto' }}
        >
          + Добавить дисциплину
        </Button>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 3, md: 4 }} w="full">
        {disciplines.map((discipline) => (
          <Box
            key={discipline.id}
            bg="white"
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            cursor="pointer"
            transition="all 0.2s"
            w="full"
            minW={0}
            _hover={{
              boxShadow: 'md',
              borderColor: 'blue.200',
            }}
            onClick={() => navigate(`${ADMIN_ROUTES.QUESTIONS}?discipline=${discipline.id}`)}
          >
            <VStack align="start" spacing={3} w="full">
              <HStack justify="space-between" w="full" flexWrap="wrap" gap={2}>
                <Badge colorScheme="purple" fontSize="xs" flexShrink={0}>
                  {discipline.category || 'humanitarian'}
                </Badge>
                <HStack spacing={1} flexShrink={0}>
                  <Button
                    size={{ base: '2xs', sm: 'xs' }}
                    variant="ghost"
                    onClick={(e) => handleEdit(e, discipline.id)}
                    title="Редактировать"
                    fontSize={{ base: 'xs', md: 'sm' }}
                  >
                    ✏️
                  </Button>
                  <Button
                    size={{ base: '2xs', sm: 'xs' }}
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => handleDelete(e, discipline.id)}
                    title="Удалить"
                    fontSize={{ base: 'xs', md: 'sm' }}
                  >
                    🗑️
                  </Button>
                </HStack>
              </HStack>
              <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }} wordBreak="break-word" w="full">
                {discipline.title}
              </Text>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" noOfLines={2} w="full">
                {discipline.description || 'Нет описания'}
              </Text>
              <HStack spacing={4} pt={2} w="full" flexWrap="wrap" gap={2}>
                <Badge colorScheme="blue" fontSize={{ base: 'xs', md: 'sm' }}>
                  {questionsCount[discipline.id] || 0} вопросов
                </Badge>
                <Text fontSize="xs" color="gray.400" noOfLines={1} minW={0} flex="1">
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
