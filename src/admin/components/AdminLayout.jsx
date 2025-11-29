import { useState } from 'react'
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
  Drawer,
  CloseButton,
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ADMIN_ROUTES.LOGIN)
  }

  const handleNavClick = (path) => {
    navigate(path)
    setIsDrawerOpen(false)
  }

  const navItems = [
    { icon: '📊', label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD },
    { icon: '📚', label: 'Дисциплины', path: ADMIN_ROUTES.DISCIPLINES },
    { icon: '❓', label: 'Вопросы', path: ADMIN_ROUTES.QUESTIONS },
    { icon: '✅', label: 'Ответы', path: ADMIN_ROUTES.ANSWERS },
    { icon: '📋', label: 'Логи', path: ADMIN_ROUTES.LOGS },
    { icon: '📖', label: 'Документация', path: ADMIN_ROUTES.DOCS },
  ]

  const SidebarContent = ({ onNavClick }) => (
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
            onClick={() => onNavClick(item.path)}
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
  )

  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      {/* Mobile Header */}
      <Box
        display={{ base: 'flex', lg: 'none' }}
        position="sticky"
        top={0}
        zIndex={100}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={4}
        py={3}
        alignItems="center"
        justifyContent="space-between"
        flexShrink={0}
      >
        <Text fontSize="lg" fontWeight="bold" color="blue.600" noOfLines={1}>
          🎓 GosPrep Admin
        </Text>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          flexShrink={0}
        >
          ☰
        </Button>
      </Box>

      {/* Mobile Drawer */}
      <Drawer.Root
        open={isDrawerOpen}
        onOpenChange={(e) => setIsDrawerOpen(e.open)}
        placement="start"
        size="sm"
      >
        <Drawer.Backdrop />
        <Drawer.Content>
          <Drawer.Header>
            <HStack justify="space-between" w="full">
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                Меню
              </Text>
              <CloseButton onClick={() => setIsDrawerOpen(false)} />
            </HStack>
          </Drawer.Header>
          <Drawer.Body>
            <SidebarContent onNavClick={handleNavClick} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Flex flex="1" minH={0}>
        {/* Desktop Sidebar */}
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
          display={{ base: 'none', lg: 'block' }}
          flexShrink={0}
        >
          <SidebarContent onNavClick={handleNavClick} />
        </Box>

        {/* Main content */}
        <Box 
          ml={{ base: 0, lg: '260px' }} 
          flex="1" 
          minW={0}
          p={{ base: 3, sm: 4, md: 6 }}
          pt={{ base: 3, lg: 6 }}
          w="full"
          maxW="100%"
          overflowX="hidden"
          boxSizing="border-box"
        >
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}

export default AdminLayout

