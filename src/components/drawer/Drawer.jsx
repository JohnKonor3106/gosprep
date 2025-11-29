import { useEffect } from 'react'
import { Box, Button, HStack, Stack, Text, VStack, CloseButton } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/state/stateApp'
import { HEADER_HEIGHT_PX } from '@/constants'

export function AppDrawer() {
  const { setIsOpen, isOpen, chapters} = useAppStore();

  // Блокируем прокрутку страницы при открытом drawer
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию прокрутки
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      // Восстанавливаем позицию прокрутки
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen]);

  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
    setIsOpen(false)
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
          w={{ base: '100%', sm: '320px', md: '400px', lg: '450px' }}
          maxW="100vw"
          h={`calc(100vh - ${HEADER_HEIGHT_PX}px)`}
          bg="blue.500"
          color="black"
          shadow="2xl"
          borderRightWidth="1px"
          borderColor="whiteAlpha.300"
          p={{ base: 4, md: 6 }}
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
            <CloseButton placeSelf="end" size="sm" w="28px" h="28px" onClick={() => setIsOpen(false)} />
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
              {chapters.map((item, index) => (
                <Button
                  key={item.id}
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
                  fontWeight="medium"
                  opacity={0.9}
                  animation={isOpen ? `slideInLeft 0.3s ease-out ${index * 0.05}s both` : 'none'}
                >
                  {item.title}
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

      {/* Затемненный фон с размытием - клик закрывает drawer */}
      <Box
        position="fixed"
        insetInlineStart="0"
        insetBlockStart={`${HEADER_HEIGHT_PX}px`}
        w="100vw"
        h={`calc(100vh - ${HEADER_HEIGHT_PX}px)`}
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
        opacity={isOpen ? 1 : 0}
        visibility={isOpen ? 'visible' : 'hidden'}
        transition="opacity 0.3s ease, visibility 0.3s ease"
        zIndex="overlay"
        onClick={() => setIsOpen(false)}
        cursor="pointer"
      />

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
