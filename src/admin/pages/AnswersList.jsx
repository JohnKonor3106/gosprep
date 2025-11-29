import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import { ADMIN_ROUTES } from '@/admin/constants/routes'

const AnswersList = () => {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState([])
  const [questions, setQuestions] = useState({})
  const [disciplines, setDisciplines] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Загружаем дисциплины
        const disciplineRecords = await pb.collection('disciplines').getFullList()
        const disciplineMap = {}
        disciplineRecords.forEach((d) => {
          disciplineMap[d.id] = d
        })
        setDisciplines(disciplineMap)

        // Загружаем вопросы
        const questionRecords = await pb.collection('questions').getFullList()
        const questionMap = {}
        questionRecords.forEach((q) => {
          questionMap[q.id] = q
        })
        setQuestions(questionMap)

        // Загружаем ответы
        const records = await pb.collection('answers').getFullList({
          sort: '-created',
          expand: 'question',
        })
        setAnswers(records)
      } catch (error) {
        console.error('Ошибка загрузки ответов:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Фильтрация по поиску
  const filteredAnswers = answers.filter((a) => {
    const question = questions[a.question]
    return (
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      question?.title?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleDelete = async (id) => {
    if (!confirm('Удалить этот ответ?')) return

    try {
      await pb.collection('answers').delete(id)
      setAnswers((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      console.error('Ошибка удаления:', error)
      alert('Ошибка удаления ответа')
    }
  }

  return (
    <Box>
      <VStack align={{ base: 'stretch', md: 'flex-start' }} spacing={4} mb={6}>
        <Box w="full">
          <Heading size={{ base: 'md', md: 'lg' }}>Ответы</Heading>
          <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>Управление ответами на вопросы</Text>
        </Box>
        <Button
          colorScheme="blue"
          onClick={() => navigate(ADMIN_ROUTES.ANSWER_CREATE)}
          size={{ base: 'sm', md: 'md' }}
          w={{ base: 'full', md: 'auto' }}
        >
          + Добавить ответ
        </Button>
      </VStack>

      {/* Search */}
      <Box mb={6}>
        <Input
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          w="full"
          maxW={{ base: '100%', md: '300px' }}
          bg="white"
          size={{ base: 'sm', md: 'md' }}
        />
      </Box>

      {/* Table */}
      {isLoading ? (
        <Box py={12} textAlign="center">
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Box 
          bg="white" 
          borderRadius="xl" 
          boxShadow="sm" 
          overflow="hidden"
          w="full"
          overflowX="auto"
        >
          <Table.Root size="sm" minW="800px">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader w="60px">#</Table.ColumnHeader>
                <Table.ColumnHeader>Заголовок</Table.ColumnHeader>
                <Table.ColumnHeader>Вопрос</Table.ColumnHeader>
                <Table.ColumnHeader>Дисциплина</Table.ColumnHeader>
                <Table.ColumnHeader>Тип</Table.ColumnHeader>
                <Table.ColumnHeader w="120px">Действия</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredAnswers.map((answer) => {
                const question = questions[answer.question]
                const discipline = question ? disciplines[question.discipline] : null

                return (
                  <Table.Row key={answer.id} _hover={{ bg: 'gray.50' }}>
                    <Table.Cell>
                      <Badge colorScheme="green">{answer.number}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontWeight="medium" noOfLines={1}>
                        {answer.title || answer.decription || '—'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" noOfLines={1}>
                        {question?.title || '—'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" noOfLines={1}>
                        {discipline?.title || '—'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorScheme="purple" fontSize="xs">
                        {answer.structure_type || 'default'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack spacing={1}>
                        <Button
                          size={{ base: '2xs', sm: 'xs' }}
                          variant="ghost"
                          onClick={() => navigate(ADMIN_ROUTES.ANSWER_EDIT(answer.id))}
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          ✏️
                        </Button>
                        <Button
                          size={{ base: '2xs', sm: 'xs' }}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(answer.id)}
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          🗑️
                        </Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>

          {filteredAnswers.length === 0 && (
            <Box py={12} textAlign="center">
              <Text color="gray.500">Ответы не найдены</Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default AnswersList

