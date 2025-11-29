import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, Spinner } from '@chakra-ui/react'
import { useAuthStore } from '@/admin/state/authStore'
import { ADMIN_ROUTES } from '@/admin/constants/routes'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore()

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Показываем загрузку пока проверяем
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        bg="gray.50"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  // Если не авторизован — редирект на логин
  if (!isAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

