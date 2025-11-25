import { Box, Text, Heading, VStack, SimpleGrid, Card } from '@chakra-ui/react'

// Маленькая карточка с информацией
const InfoCard = ({ title, value }) => {
  if (!value) return null
  
  return (
    <Card.Root variant="subtle" bg="blue.50">
      <Card.Body py={3} px={4}>
        <Text fontSize="xs" color="gray.500" mb={1}>{title}</Text>
        <Text fontWeight="semibold" color="blue.700">{value}</Text>
      </Card.Body>
    </Card.Root>
  )
}

export const AboutTab = ({ about, discipline }) => {
  if (!about) {
    return (
      <Box p={6} bg="gray.50" borderRadius="lg">
        <Text color="gray.500">Информация о дисциплине пока не добавлена</Text>
      </Box>
    )
  }

  return (
    <VStack gap={6} align="stretch">
      <Card.Root variant="outline">
        <Card.Body>
          <Heading size="md" mb={4} color="blue.600">Описание</Heading>
          <Text lineHeight="tall" color="gray.700">
            {about.description}
          </Text>
        </Card.Body>
      </Card.Root>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <InfoCard title="Формат экзамена" value={about.examFormat} />
        <InfoCard title="Количество вопросов" value={about.questionsCount || discipline.questions?.length} />
        <InfoCard title="Всего часов" value={about.hoursTotal} />
        <InfoCard title="Зачетных единиц (кредитов)" value={about.credits} />
        <InfoCard title="Семестр" value={about.semester} />
        <InfoCard title="Кафедра" value={about.department} />
      </SimpleGrid>
    </VStack>
  )
}

