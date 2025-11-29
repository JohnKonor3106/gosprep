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
      <VStack align={{ base: 'stretch', md: 'flex-start' }} spacing={4} mb={6}>
        <Box w="full">
          <Heading size={{ base: 'md', md: 'lg' }}>Вопросы</Heading>
          <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>Управление вопросами</Text>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => navigate(ADMIN_ROUTES.QUESTION_CREATE)}
          size={{ base: 'sm', md: 'md' }}
          w={{ base: 'full', md: 'auto' }}
        >
          + Добавить вопрос
        </Button>
      </VStack>

      {/* Filters */}
      <VStack spacing={3} align="stretch" mb={6}>
        <Input
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          w="full"
          bg="white"
          size={{ base: 'sm', md: 'md' }}
        />
        <Box as="select"
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
          px={3}
          py={{ base: 2.5, md: 2 }}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
          w="full"
          fontSize={{ base: 'sm', md: 'md' }}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
          }}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">Все дисциплины</option>
          {Object.values(disciplines).map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </Box>
      </VStack>

      {/* Table / Cards */}
      {isLoading ? (
        <Box py={12} textAlign="center">
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <>
          {/* Desktop Table */}
          <Box 
            bg="white" 
            borderRadius="xl" 
            boxShadow="sm" 
            overflow="hidden"
            display={{ base: 'none', md: 'block' }}
            w="full"
            overflowX="auto"
          >
            <Table.Root size="sm" minW="800px">
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
                          size={{ base: '2xs', sm: 'xs' }}
                          variant="ghost"
                          onClick={() => navigate(ADMIN_ROUTES.QUESTION_PREVIEW(question.id))}
                          title="Превью"
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          👁️
                        </Button>
                        <Button
                          size={{ base: '2xs', sm: 'xs' }}
                          variant="ghost"
                          onClick={() => navigate(ADMIN_ROUTES.QUESTION_EDIT(question.id))}
                          title="Редактировать"
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          ✏️
                        </Button>
                        <Button
                          size={{ base: '2xs', sm: 'xs' }}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(question.id)}
                          title="Удалить"
                          fontSize={{ base: 'xs', md: 'sm' }}
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

          {/* Mobile Cards */}
          <VStack spacing={3} align="stretch" display={{ base: 'flex', md: 'none' }}>
            {filteredQuestions.map((question) => (
              <Box
                key={question.id}
                bg="white"
                p={4}
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Badge colorScheme="blue">{question.number}</Badge>
                    <Badge colorScheme="purple" fontSize="xs">
                      {question.structure_type || 'default'}
                    </Badge>
                  </HStack>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" fontSize="sm">
                      {question.title}
                    </Text>
                    {question.topic && (
                      <Text fontSize="xs" color="gray.500">
                        {question.topic}
                      </Text>
                    )}
                    <Text fontSize="xs" color="gray.400">
                      {disciplines[question.discipline]?.title || '—'}
                    </Text>
                  </VStack>
                  <HStack spacing={2} justify="flex-end" flexWrap="wrap" gap={1}>
                    <Button
                      size={{ base: '2xs', sm: 'xs' }}
                      variant="ghost"
                      onClick={() => navigate(ADMIN_ROUTES.QUESTION_PREVIEW(question.id))}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      👁️ Превью
                    </Button>
                    <Button
                      size={{ base: '2xs', sm: 'xs' }}
                      variant="ghost"
                      onClick={() => navigate(ADMIN_ROUTES.QUESTION_EDIT(question.id))}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      ✏️
                    </Button>
                    <Button
                      size={{ base: '2xs', sm: 'xs' }}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(question.id)}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      🗑️
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
            {filteredQuestions.length === 0 && (
              <Box py={12} textAlign="center">
                <Text color="gray.500">Вопросы не найдены</Text>
              </Box>
            )}
          </VStack>
        </>
      )}
    </Box>
  )
}

export default QuestionsList

