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
    p={{ base: 4, md: 6 }}
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
    w="full"
    minW={0}
  >
    <HStack spacing={{ base: 3, md: 4 }} align="center">
      <Box
        w={{ base: 10, md: 12 }}
        h={{ base: 10, md: 12 }}
        bg={`${color}.100`}
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={{ base: 'xl', md: '2xl' }}
        flexShrink={0}
      >
        {icon}
      </Box>
      <VStack align="start" spacing={0} minW={0} flex="1">
        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" noOfLines={1}>
          {label}
        </Text>
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color={`${color}.600`}>
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
      
      // Проверяем авторизацию
      if (!pb.authStore.isValid) {
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
      <Box mb={{ base: 6, md: 8 }}>
        <Heading size={{ base: 'md', md: 'lg' }} color="gray.800">
          Добро пожаловать, {user?.name || user?.email?.split('@')[0] || 'Редактор'}!
        </Heading>
        <Text color="gray.500" mt={1} fontSize={{ base: 'sm', md: 'md' }}>
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
      <Box bg="white" borderRadius="xl" boxShadow="sm" p={{ base: 4, md: 6 }} w="full" minW={0}>
        <Heading size={{ base: 'sm', md: 'md' }} mb={4}>
          Последние вопросы
        </Heading>
        
        {isLoading ? (
          <Box py={8} textAlign="center">
            <Spinner size="lg" color="blue.500" />
          </Box>
        ) : recentQuestions.length === 0 ? (
          <Text color="gray.500" py={4} fontSize={{ base: 'sm', md: 'md' }}>
            Пока нет вопросов
          </Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {recentQuestions.map((question) => (
              <Box
                key={question.id}
                p={{ base: 3, md: 4 }}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
                w="full"
                minW={0}
              >
                <HStack justify="space-between" mb={2} flexWrap="wrap" gap={2}>
                  <Badge colorScheme="blue" fontSize={{ base: 'xs', md: 'sm' }}>
                    #{question.number}
                  </Badge>
                  <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                    {new Date(question.created).toLocaleDateString('ru-RU')}
                  </Text>
                </HStack>
                <Text fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }} noOfLines={2} wordBreak="break-word">
                  {question.title}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" mt={1} noOfLines={1}>
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

