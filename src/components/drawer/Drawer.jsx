import { Box, Button, HStack, Stack, Text, VStack, CloseButton } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const HEADER_HEIGHT_PX = 56

export function AppDrawer({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/questions/chapters', label: 'Вопросы', icon: '❓' },
    { path: '/federal_low', label: 'ФЗ' },
    { path: '/help', label: 'Помощь', icon: '💬' },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Основная панель */}
      <Box
        position="fixed"
        insetBlockStart={`${HEADER_HEIGHT_PX}px`}
        insetInlineStart="0"
        transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        zIndex="modal"
      >
        <Box
          w="400px"
          h={`calc(100vh - ${HEADER_HEIGHT_PX}px)`}
          bg="blue.500"
          color="black"
          shadow="2xl"
          borderRightWidth="1px"
          borderColor="whiteAlpha.300"
          p={6}
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            zIndex: 0,
          }}
        >
          <Box position="relative" zIndex={1} h="full" display="flex" flexDirection="column">
            <CloseButton placeSelf="end" size="sm" w="28px" h="28px" onClick={onClose} />
            {/* Заголовок */}
            <HStack
              justify="space-between"
              mb={8}
              pb={4}
              borderBottom="1px solid"
              borderColor="whiteAlpha.200"
            >
              <VStack align="flex-start" spacing={0}>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  bgGradient="linear(to-r, white, gray.100)"
                  bgClip="text"
                >
                  Навигация
                </Text>
                <Text fontSize="small" color="whiteAlpha.700">
                  Меню приложения
                </Text>
              </VStack>
            </HStack>

            {/* Навигация */}
            <Stack gap={3} flex={1}>
              {menuItems.map((item, index) => (
                <Button
                  key={item.label}
                  variant={location.pathname === item.path ? 'solid' : 'ghost'}
                  bg={location.pathname === item.path ? 'whiteAlpha.300' : 'transparent'}
                  onClick={() => handleNavigation(item.path)}
                  justifyContent="flex-start"
                  size="lg"
                  px={4}
                  py={3}
                  borderRadius="lg"
                  transition="all 0.2s"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    transform: 'translateX(8px)',
                    shadow: 'md',
                  }}
                  _active={{
                    bg: 'whiteAlpha.300',
                  }}
                  leftIcon={
                    <Text fontSize="lg" opacity={0.9}>
                      {item.icon}
                    </Text>
                  }
                  fontWeight="medium"
                  opacity={0.9}
                  animation={isOpen ? `slideInLeft 0.3s ease-out ${index * 0.05}s both` : 'none'}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            {/* Футер */}
            <Box mt="auto" pt={6} borderTop="1px solid" borderColor="whiteAlpha.200">
              <VStack spacing={1} align="flex-start">
                <HStack spacing={2}>
                  <Box w={2} h={2} borderRadius="full" bg="green.400" shadow="0 0 8px green" />
                  <Text fontSize="sm" color="whiteAlpha.800">
                    Онлайн
                  </Text>
                </HStack>
                <Text fontSize="xs" color="whiteAlpha.600">
                  Версия 0.1 • 2025
                </Text>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Затемненный фон с размытием */}
      {isOpen && (
        <Box
          position="fixed"
          insetInlineStart="0"
          insetBlockStart={`${HEADER_HEIGHT_PX}px`}
          w="100vw"
          h={`calc(100vh - ${HEADER_HEIGHT_PX}px)`}
          bg="blackAlpha.600"
          backdropFilter="blur(4px)"
          opacity={isOpen ? 1 : 0}
          transition="opacity 0.3s ease"
        />
      )}

      {/* CSS анимации */}
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 0.9;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
