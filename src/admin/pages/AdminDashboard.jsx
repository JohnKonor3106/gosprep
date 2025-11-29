import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import { useAuthStore } from '@/admin/state/authStore'

const StatCard = ({ icon, label, value, color = 'blue', isLoading }) => (
  <Box
    bg="white"
    p={6}
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
  >
    <HStack spacing={4}>
      <Box
        w={12}
        h={12}
        bg={`${color}.100`}
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2xl"
      >
        {icon}
      </Box>
      <VStack align="start" spacing={0}>
        <Text fontSize="sm" color="gray.500">
          {label}
        </Text>
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>
            {value}
          </Text>
        )}
      </VStack>
    </HStack>
  </Box>
)

const AdminDashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    disciplines: 0,
    questions: 0,
    answers: 0,
  })
  const [recentQuestions, setRecentQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      
      // Диагностика авторизации
      console.log('=== ДИАГНОСТИКА АВТОРИЗАЦИИ ===')
      console.log('Token:', pb.authStore.token ? 'ЕСТЬ' : 'НЕТ')
      console.log('Valid:', pb.authStore.isValid)
      console.log('User:', pb.authStore.model)
      console.log('===============================')
      
      // Проверяем авторизацию
      if (!pb.authStore.isValid) {
        console.error('❌ Пользователь не авторизован!')
        setIsLoading(false)
        return
      }
      
      try {
        // Загружаем статистику
        const [disciplines, questions, answers] = await Promise.all([
          pb.collection('disciplines').getFullList({ fields: 'id' }),
          pb.collection('questions').getFullList({ fields: 'id' }),
          pb.collection('answers').getFullList({ fields: 'id' }),
        ])

        setStats({
          disciplines: disciplines.length,
          questions: questions.length,
          answers: answers.length,
        })

        // Загружаем последние вопросы
        const recent = await pb.collection('questions').getList(1, 5, {
          sort: '-created',
          expand: 'discipline',
        })
        setRecentQuestions(recent.items)
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <Box>
      {/* Header */}
      <Box mb={8}>
        <Heading size="lg" color="gray.800">
          Добро пожаловать, {user?.name || user?.email?.split('@')[0] || 'Редактор'}!
        </Heading>
        <Text color="gray.500" mt={1}>
          Панель управления контентом GosPrep
        </Text>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <StatCard
          icon="📚"
          label="Дисциплины"
          value={stats.disciplines}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard
          icon="❓"
          label="Вопросы"
          value={stats.questions}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          icon="✅"
          label="Ответы"
          value={stats.answers}
          color="green"
          isLoading={isLoading}
        />
      </SimpleGrid>

      {/* Recent questions */}
      <Box bg="white" borderRadius="xl" boxShadow="sm" p={6}>
        <Heading size="md" mb={4}>
          Последние вопросы
        </Heading>
        
        {isLoading ? (
          <Box py={8} textAlign="center">
            <Spinner size="lg" color="blue.500" />
          </Box>
        ) : recentQuestions.length === 0 ? (
          <Text color="gray.500" py={4}>
            Пока нет вопросов
          </Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {recentQuestions.map((question) => (
              <Box
                key={question.id}
                p={4}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
              >
                <HStack justify="space-between" mb={2}>
                  <Badge colorScheme="blue">
                    #{question.number}
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(question.created).toLocaleDateString('ru-RU')}
                  </Text>
                </HStack>
                <Text fontWeight="medium" noOfLines={2}>
                  {question.title}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {question.expand?.discipline?.title || 'Без дисциплины'}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}

export default AdminDashboard

