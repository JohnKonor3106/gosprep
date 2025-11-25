import { Box, Text, Heading, VStack, HStack, Badge, Link, Button, Card, Stack } from '@chakra-ui/react'
import { ExternalLinkIcon, ScaleIcon } from './icons'

// Карточка правового акта
const LegalCard = ({ law }) => {
  return (
    <Card.Root 
      variant="outline" 
      borderColor="purple.200"
      bg="purple.50"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <Card.Body>
        <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
          <VStack align="start" gap={1} flex={1}>
            <Text fontWeight="bold" color="purple.700">
              {law.title}
            </Text>
            <HStack gap={2}>
              {law.number && (
                <Badge colorPalette="purple" size="sm">№ {law.number}</Badge>
              )}
              {law.date && (
                <Badge colorPalette="gray" size="sm">от {law.date}</Badge>
              )}
            </HStack>
            {law.description && (
              <Text fontSize="sm" color="gray.600" mt={1}>
                {law.description}
              </Text>
            )}
          </VStack>

          {law.url && (
            <Link 
              href={law.url} 
              target="_blank" 
              rel="noopener noreferrer"
              _hover={{ textDecoration: 'none' }}
            >
              <Button size="sm" variant="outline" colorPalette="purple">
                <ExternalLinkIcon />
                Открыть
              </Button>
            </Link>
          )}
        </HStack>
      </Card.Body>
    </Card.Root>
  )
}

export const LegalBaseTab = ({ legalBase }) => {
  if (!legalBase || legalBase.length === 0) {
    return (
      <Box p={6} bg="gray.50" borderRadius="lg" textAlign="center">
        <HStack justify="center" mb={2}>
          <ScaleIcon />
        </HStack>
        <Text color="gray.500">Нормативно-правовые акты пока не добавлены</Text>
      </Box>
    )
  }

  return (
    <VStack gap={4} align="stretch">
      <Heading size="md" mb={2} color="purple.600">
        ⚖️ Нормативно-правовые акты
      </Heading>
      
      <Stack gap={3}>
        {legalBase.map((law) => (
          <LegalCard key={law.id} law={law} />
        ))}
      </Stack>
    </VStack>
  )
}

