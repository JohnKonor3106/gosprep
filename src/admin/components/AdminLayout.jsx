import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Separator,
} from '@chakra-ui/react'
import { useAuthStore } from '@/admin/state/authStore'
import { ADMIN_ROUTES } from '@/admin/constants/routes'

const NavItem = ({ icon, label, path, isActive, onClick }) => (
  <Button
    variant={isActive ? 'solid' : 'ghost'}
    colorScheme={isActive ? 'blue' : 'gray'}
    justifyContent="flex-start"
    w="full"
    size="md"
    onClick={onClick}
    fontWeight={isActive ? 'semibold' : 'normal'}
  >
    <HStack spacing={3}>
      <Text fontSize="lg">{icon}</Text>
      <Text>{label}</Text>
    </HStack>
  </Button>
)

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate(ADMIN_ROUTES.LOGIN)
  }

  const navItems = [
    { icon: '📊', label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD },
    { icon: '📚', label: 'Дисциплины', path: ADMIN_ROUTES.DISCIPLINES },
    { icon: '❓', label: 'Вопросы', path: ADMIN_ROUTES.QUESTIONS },
    { icon: '✅', label: 'Ответы', path: ADMIN_ROUTES.ANSWERS },
    { icon: '📋', label: 'Логи', path: ADMIN_ROUTES.LOGS },
    { icon: '📖', label: 'Документация', path: ADMIN_ROUTES.DOCS },
  ]

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w="260px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        py={6}
        px={4}
        position="fixed"
        h="100vh"
        overflowY="auto"
      >
        <VStack spacing={6} align="stretch" h="full">
          {/* Logo */}
          <Box px={2}>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              🎓 GosPrep Admin
            </Text>
            <Text fontSize="xs" color="gray.500">
              Панель управления
            </Text>
          </Box>

          <Separator />

          {/* Navigation */}
          <VStack spacing={1} align="stretch" flex="1">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                isActive={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
                onClick={() => navigate(item.path)}
              />
            ))}
          </VStack>

          <Separator />

          {/* User info */}
          <Box>
            <HStack spacing={3} mb={3} px={2}>
              <Avatar.Root size="sm">
                <Avatar.Fallback>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar.Fallback>
              </Avatar.Root>
              <Box flex="1" minW={0}>
                <Text fontSize="sm" fontWeight="medium" truncate>
                  {user?.name || 'Редактор'}
                </Text>
                <Text fontSize="xs" color="gray.500" truncate>
                  {user?.email}
                </Text>
              </Box>
            </HStack>
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              w="full"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        </VStack>
      </Box>

      {/* Main content */}
      <Box ml="260px" flex="1" p={6}>
        <Outlet />
      </Box>
    </Flex>
  )
}

export default AdminLayout

