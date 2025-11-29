import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Spinner,
  Input,
  Table,
  IconButton,
} from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import { ADMIN_ROUTES } from '@/admin/constants/routes'

const QuestionsList = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const disciplineFilter = searchParams.get('discipline')

  const [questions, setQuestions] = useState([])
  const [disciplines, setDisciplines] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState(disciplineFilter || '')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Загружаем дисциплины для фильтра
        const disciplineRecords = await pb.collection('disciplines').getFullList({
          sort: 'order',
        })
        const disciplineMap = {}
        disciplineRecords.forEach((d) => {
          disciplineMap[d.id] = d
        })
        setDisciplines(disciplineMap)

        // Загружаем вопросы
        let filter = ''
        if (selectedDiscipline) {
          filter = `discipline = "${selectedDiscipline}"`
        }

        const records = await pb.collection('questions').getFullList({
          sort: '-created',
          filter: filter || undefined,
          expand: 'discipline',
        })
        setQuestions(records)
      } catch (error) {
        console.error('Ошибка загрузки вопросов:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedDiscipline])

  // Фильтрация по поиску
  const filteredQuestions = questions.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase()) ||
    q.topic?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!confirm('Удалить этот вопрос?')) return

    try {
      await pb.collection('questions').delete(id)
      setQuestions((prev) => prev.filter((q) => q.id !== id))
    } catch (error) {
      console.error('Ошибка удаления:', error)
      alert('Ошибка удаления вопроса')
    }
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Вопросы</Heading>
          <Text color="gray.500">Управление вопросами</Text>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => navigate(ADMIN_ROUTES.QUESTION_CREATE)}
        >
          + Добавить вопрос
        </Button>
      </HStack>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="300px"
          bg="white"
        />
        <Box as="select"
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
          px={3}
          py={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
        >
          <option value="">Все дисциплины</option>
          {Object.values(disciplines).map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </Box>
      </HStack>

      {/* Table */}
      {isLoading ? (
        <Box py={12} textAlign="center">
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader w="60px">#</Table.ColumnHeader>
                <Table.ColumnHeader>Название</Table.ColumnHeader>
                <Table.ColumnHeader>Дисциплина</Table.ColumnHeader>
                <Table.ColumnHeader>Тип</Table.ColumnHeader>
                <Table.ColumnHeader w="120px">Действия</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredQuestions.map((question) => (
                <Table.Row key={question.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell>
                    <Badge colorScheme="blue">{question.number}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" noOfLines={1}>
                        {question.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {question.topic}
                      </Text>
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" noOfLines={1}>
                      {disciplines[question.discipline]?.title || '—'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme="purple" fontSize="xs">
                      {question.structure_type || 'default'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack spacing={1}>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => navigate(ADMIN_ROUTES.QUESTION_PREVIEW(question.id))}
                        title="Превью"
                      >
                        👁️
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => navigate(ADMIN_ROUTES.QUESTION_EDIT(question.id))}
                        title="Редактировать"
                      >
                        ✏️
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(question.id)}
                        title="Удалить"
                      >
                        🗑️
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {filteredQuestions.length === 0 && (
            <Box py={12} textAlign="center">
              <Text color="gray.500">Вопросы не найдены</Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default QuestionsList

