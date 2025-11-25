import { Box, Text, Heading, VStack, HStack, Card, Stack, Badge, SimpleGrid } from '@chakra-ui/react'
import { APP_NAME, APP_VERSION, APP_DESCRIPTION, COPYRIGHT_YEAR, LICENSE } from '@/constants'

/**
 * Раздел "О приложении" — информация о проекте
 */
export const AboutSection = () => {
  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading size="xl" color="blue.700" mb={2}>
          ℹ️ О приложении
        </Heading>
        <Text color="gray.600">
          Информация о проекте и его возможностях
        </Text>
      </Box>

      {/* Описание */}
      <Card.Root variant="outline" borderColor="blue.200" bg="blue.50">
        <Card.Body>
          <VStack gap={4} align="start">
            <Heading size="lg" color="blue.700">{APP_NAME}</Heading>
            <Text color="gray.700" lineHeight="tall">
              {APP_DESCRIPTION}. Содержит структурированные вопросы с ключевыми 
              аспектами ответов, интерактивный тренажер для проверки знаний, 
              учебную литературу и нормативно-правовую базу.
            </Text>
            <HStack gap={2} flexWrap="wrap">
              <Badge colorPalette="blue" size="lg">React 19</Badge>
              <Badge colorPalette="purple" size="lg">Chakra UI v3</Badge>
              <Badge colorPalette="green" size="lg">Vite</Badge>
              <Badge colorPalette="orange" size="lg">Zustand</Badge>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Возможности */}
      <Box>
        <Heading size="md" color="gray.700" mb={4}>✨ Возможности</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <FeatureCard 
            icon="📝" 
            title="Вопросы-ответы" 
            description="Структурированные вопросы с ключевыми аспектами для подготовки"
          />
          <FeatureCard 
            icon="🎯" 
            title="Тренажер" 
            description="Три режима: карточки, викторина и случайный вопрос"
          />
          <FeatureCard 
            icon="📚" 
            title="Литература" 
            description="Учебники и методические материалы для скачивания"
          />
          <FeatureCard 
            icon="⚖️" 
            title="Правовая база" 
            description="Ссылки на актуальные нормативно-правовые акты"
          />
          <FeatureCard 
            icon="🌙" 
            title="Адаптивный дизайн" 
            description="Удобная работа на любых устройствах"
          />
          <FeatureCard 
            icon="⚡" 
            title="Быстрая работа" 
            description="Оптимизированная загрузка и плавные переходы"
          />
        </SimpleGrid>
      </Box>

      {/* Планы развития */}
      <Card.Root variant="subtle" bg="gray.50">
        <Card.Body>
          <Heading size="md" color="gray.700" mb={3}>🗺️ Планы развития</Heading>
          <Stack gap={2}>
            <RoadmapItem status="done" text="Базовая структура приложения" />
            <RoadmapItem status="done" text="Тренажер с тремя режимами" />
            <RoadmapItem status="done" text="Раздел литературы и правовой базы" />
            <RoadmapItem status="progress" text="Сохранение прогресса" />
            <RoadmapItem status="planned" text="Темная тема" />
            <RoadmapItem status="planned" text="PWA и офлайн-режим" />
            <RoadmapItem status="planned" text="Интервальное повторение" />
            <RoadmapItem status="planned" text="Синхронизация между устройствами" />
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Версия и лицензия */}
      <HStack justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.200" flexWrap="wrap" gap={2}>
        <HStack gap={4}>
          <HStack>
            <Text fontSize="sm" color="gray.500">Версия:</Text>
            <Badge colorPalette="blue">v{APP_VERSION}</Badge>
          </HStack>
          <HStack>
            <Text fontSize="sm" color="gray.500">Лицензия:</Text>
            <Badge colorPalette="green">{LICENSE}</Badge>
          </HStack>
        </HStack>
        <Text fontSize="sm" color="gray.400">© {COPYRIGHT_YEAR} {APP_NAME}</Text>
      </HStack>
    </VStack>
  )
}

// Карточка возможности
const FeatureCard = ({ icon, title, description }) => (
  <Card.Root variant="outline">
    <Card.Body py={3}>
      <HStack gap={3} align="start">
        <Text fontSize="2xl">{icon}</Text>
        <Box>
          <Text fontWeight="semibold" color="gray.800">{title}</Text>
          <Text fontSize="sm" color="gray.600">{description}</Text>
        </Box>
      </HStack>
    </Card.Body>
  </Card.Root>
)

// Элемент дорожной карты
const RoadmapItem = ({ status, text }) => {
  const statusConfig = {
    done: { icon: '✅', color: 'green' },
    progress: { icon: '🔄', color: 'blue' },
    planned: { icon: '📌', color: 'gray' },
  }
  
  const config = statusConfig[status]
  
  return (
    <HStack gap={2}>
      <Text>{config.icon}</Text>
      <Text 
        fontSize="sm" 
        color={status === 'done' ? 'gray.500' : 'gray.700'}
        textDecoration={status === 'done' ? 'line-through' : 'none'}
      >
        {text}
      </Text>
    </HStack>
  )
}

