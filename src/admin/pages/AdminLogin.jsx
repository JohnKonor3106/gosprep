import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  Alert,
  Flex,
} from '@chakra-ui/react'
import { useAuthStore } from '@/admin/state/authStore'
import { ADMIN_ROUTES } from '@/admin/constants/routes'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Если уже авторизован — редирект на dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ADMIN_ROUTES.DASHBOARD)
    }
  }, [isAuthenticated, navigate])

  // Очищаем ошибку при изменении полей
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }
    
    const result = await login(email, password)
    
    if (result.success) {
      navigate(ADMIN_ROUTES.DASHBOARD)
    }
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        w="full"
        maxW="400px"
        mx={4}
      >
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Box textAlign="center">
            <Heading size="lg" color="blue.600" mb={2}>
              🔐 Админ-панель
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Вход для редакторов контента
            </Text>
          </Box>

          {error && (
            <Alert.Root status="error" borderRadius="md">
              <Alert.Indicator />
              <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
          )}

          <VStack spacing={4} w="full">
            <Box w="full">
              <Text mb={1} fontSize="sm" fontWeight="medium" color="gray.700">
                Email
              </Text>
              <Input
                type="email"
                placeholder="editor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                required
              />
            </Box>

            <Box w="full">
              <Text mb={1} fontSize="sm" fontWeight="medium" color="gray.700">
                Пароль
              </Text>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                required
              />
            </Box>
          </VStack>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            loading={isLoading}
            loadingText="Вход..."
          >
            Войти
          </Button>

          <Text fontSize="xs" color="gray.400" textAlign="center">
            Доступ только для авторизованных редакторов
          </Text>
        </VStack>
      </Box>
    </Flex>
  )
}

export default AdminLogin

