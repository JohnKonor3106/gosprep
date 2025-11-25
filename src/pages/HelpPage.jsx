import { useState } from 'react'
import { Box, Flex, VStack, HStack, Text, Button, Card } from '@chakra-ui/react'
import { DocumentationSection, FeedbackSection, AboutSection } from '@/components/help'

/**
 * Страница "Помощь" с боковым меню навигации
 * 
 * Современный паттерн: sidebar + content area
 * - Легко масштабируется (добавление новых разделов)
 * - Удобная навигация
 * - Адаптивный дизайн (на мобильных меню сверху)
 */

// Конфигурация разделов меню
const HELP_SECTIONS = [
  {
    id: 'docs',
    icon: '📖',
    label: 'Документация',
    description: 'Как пользоваться приложением',
    component: DocumentationSection,
  },
  {
    id: 'feedback',
    icon: '💬',
    label: 'Обратная связь',
    description: 'Сообщить об ошибке или предложить идею',
    component: FeedbackSection,
  },
  {
    id: 'about',
    icon: 'ℹ️',
    label: 'О приложении',
    description: 'Информация о проекте',
    component: AboutSection,
  },
]

const HelpPage = () => {
  const [activeSection, setActiveSection] = useState('docs')
  
  // Находим активный раздел
  const currentSection = HELP_SECTIONS.find(s => s.id === activeSection)
  const SectionComponent = currentSection?.component

  return (
    <Flex 
      direction={{ base: 'column', lg: 'row' }} 
      gap={6} 
      p={4}
      minH="calc(100vh - 80px)"
    >
      {/* Боковое меню (на мобильных — горизонтальное сверху) */}
      <Box 
        w={{ base: '100%', lg: '400px' }}
        flexShrink={0}
      >
        {/* Мобильное меню (горизонтальный скролл) */}
        <Box 
          display={{ base: 'block', lg: 'none' }}
          overflowX="auto"
          pb={2}
        >
          <HStack gap={2} minW="max-content">
            {HELP_SECTIONS.map(section => (
              <Button
                key={section.id}
                size="sm"
                variant={activeSection === section.id ? 'solid' : 'outline'}
                colorPalette={activeSection === section.id ? 'blue' : 'gray'}
                onClick={() => setActiveSection(section.id)}
                flexShrink={0}
              >
                <Text mr={1}>{section.icon}</Text>
                {section.label}
              </Button>
            ))}
          </HStack>
        </Box>

        {/* Десктопное меню (вертикальное) */}
        <Card.Root 
          variant="outline" 
          display={{ base: 'none', lg: 'block' }}
          position="sticky"
          top="80px"
        >
          <Card.Body p={2}>
            <VStack gap={1} align="stretch">
              {HELP_SECTIONS.map(section => (
                <MenuButton
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>

      {/* Контент */}
      <Box flex={1} maxW={{ lg: '900px' }}>
        {SectionComponent && <SectionComponent />}
      </Box>
    </Flex>
  )
}

// Кнопка меню (десктоп)
const MenuButton = ({ section, isActive, onClick }) => (
  <Button
    variant="ghost"
    justifyContent="flex-start"
    h="auto"
    py={3}
    px={3}
    bg={isActive ? 'blue.50' : 'transparent'}
    borderLeft="3px solid"
    borderColor={isActive ? 'blue.500' : 'transparent'}
    borderRadius="none"
    borderRightRadius="md"
    onClick={onClick}
    _hover={{
      bg: isActive ? 'blue.100' : 'gray.50',
    }}
  >
    <HStack gap={3} align="center" w="full">
      <Box 
        p={2} 
        bg={isActive ? 'blue.100' : 'gray.100'} 
        borderRadius="lg"
        fontSize="xl"
      >
        {section.icon}
      </Box>
      <VStack align="start" gap={0}>
        <Text 
          fontWeight={isActive ? 'semibold' : 'medium'} 
          color={isActive ? 'blue.700' : 'gray.700'}
        >
          {section.label}
        </Text>
        <Text 
          fontSize="xs" 
          color="gray.500"
          fontWeight="normal"
        >
          {section.description}
        </Text>
      </VStack>
    </HStack>
  </Button>
)

export default HelpPage

