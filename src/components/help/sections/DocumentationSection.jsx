import { Box, Text, Heading, VStack, Card, Stack, Badge, HStack, Accordion } from '@chakra-ui/react'

/**
 * Раздел "Документация" — инструкции по использованию приложения
 */
export const DocumentationSection = () => {
  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading size="xl" color="blue.700" mb={2}>
          📖 Документация
        </Heading>
        <Text color="gray.600">
          Руководство по использованию приложения для подготовки к экзаменам
        </Text>
      </Box>

      {/* Быстрый старт */}
      <Card.Root variant="outline" borderColor="green.200" bg="green.50">
        <Card.Body>
          <Heading size="md" color="green.700" mb={3}>🚀 Быстрый старт</Heading>
          <Stack gap={3}>
            <StepItem number={1} title="Выберите дисциплину">
              Перейдите в раздел "Дисциплины" и выберите нужный предмет
            </StepItem>
            <StepItem number={2} title="Изучите вопросы">
              Просмотрите список вопросов и откройте интересующий для детального изучения
            </StepItem>
            <StepItem number={3} title="Используйте тренажер">
              Закрепите знания с помощью режимов: карточки, викторина или случайный вопрос
            </StepItem>
            <StepItem number={4} title="Изучите литературу">
              Скачайте рекомендованные учебники и нормативные акты
            </StepItem>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* FAQ в виде аккордеона */}
      <Box>
        <Heading size="md" color="gray.700" mb={4}>❓ Часто задаваемые вопросы</Heading>
        <Accordion.Root collapsible variant="enclosed">
          <FaqItem 
            value="1"
            question="Как работает тренажер?"
            answer="Тренажер предлагает три режима: Карточки (изучение), Викторина (проверка с самооценкой) и Случайный вопрос (быстрая проверка). Вопросы перемешиваются для каждой сессии."
          />
          <FaqItem 
            value="2"
            question="Можно ли скачать учебники?"
            answer="Да, в разделе 'Литература' каждой дисциплины доступны ссылки для скачивания учебников и методических материалов."
          />
          <FaqItem 
            value="3"
            question="Как фильтровать вопросы по сложности?"
            answer="В тренажере перед началом сессии выберите уровень сложности: Базовый, Средний или Повышенный. Можно также выбрать 'Все уровни'."
          />
          <FaqItem 
            value="4"
            question="Сохраняется ли прогресс?"
            answer="В текущей версии прогресс сессии отображается только во время работы с тренажером. Функция сохранения прогресса между сессиями появится в будущих обновлениях."
          />
          <FaqItem 
            value="5"
            question="Приложение работает офлайн?"
            answer="После первой загрузки большинство функций доступно офлайн. Для скачивания файлов требуется интернет-соединение."
          />
        </Accordion.Root>
      </Box>

      {/* Горячие клавиши */}
      <Card.Root variant="subtle" bg="gray.50">
        <Card.Body>
          <Heading size="md" color="gray.700" mb={3}>⌨️ Навигация</Heading>
          <Stack gap={2}>
            <HotkeyItem keys="Меню" description="Открыть боковое меню навигации" />
            <HotkeyItem keys="Вкладки" description="Переключение между разделами дисциплины" />
            <HotkeyItem keys="Карточки" description="Клик по карточке показывает ответ" />
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Версия */}
      <HStack justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.200">
        <Text fontSize="sm" color="gray.500">Версия приложения</Text>
        <Badge colorPalette="blue">v0.1.0</Badge>
      </HStack>
    </VStack>
  )
}

// Шаг инструкции
const StepItem = ({ number, title, children }) => (
  <HStack align="start" gap={3}>
    <Box 
      w={6} h={6} 
      bg="green.500" 
      color="white" 
      borderRadius="full" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      fontSize="sm"
      fontWeight="bold"
      flexShrink={0}
    >
      {number}
    </Box>
    <Box>
      <Text fontWeight="semibold" color="gray.800">{title}</Text>
      <Text fontSize="sm" color="gray.600">{children}</Text>
    </Box>
  </HStack>
)

// FAQ элемент
const FaqItem = ({ value, question, answer }) => (
  <Accordion.Item value={value}>
    <Accordion.ItemTrigger>
      <Text fontWeight="medium">{question}</Text>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <Text color="gray.600">{answer}</Text>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)

// Горячая клавиша
const HotkeyItem = ({ keys, description }) => (
  <HStack justify="space-between">
    <Text fontSize="sm" color="gray.600">{description}</Text>
    <Badge variant="outline" colorPalette="gray" fontFamily="mono">{keys}</Badge>
  </HStack>
)

