// src/templates/humanitarian/ComparativeAnalysisRender.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const ComparativeAnalysisRender = ({ title, comparison, conclusion }) => {
  // Поддерживаем только первый блок сравнения (как в твоих данных)
  const cmp = comparison?.[0]

  return (
    <Box
      w="100%"
      maxW="1300px"
      maxH="80vh"
      overflowY="auto"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <VStack align="start" spacing={6} w="100%">
        {/* Заголовок */}
        <Heading as="h2" size="lg" color="blue.700">
          {title}
        </Heading>

        {/* Сравнение */}
        {cmp && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={4} color="gray.700">
              Сравнение: <strong>{cmp.concept1}</strong> vs <strong>{cmp.concept2}</strong>
            </Heading>

            {/* Сходства */}
            {cmp.similarities && cmp.similarities.length > 0 && (
              <Box mb={5}>
                <Text fontWeight="bold" color="green.700" mb={2}>
                  Сходства
                </Text>
                <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
                  {cmp.similarities.map((item, i) => (
                    <Box as="li" key={i} color="gray.600" mb={1}>
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Различия */}
            {cmp.differences && cmp.differences.length > 0 && (
              <Box>
                <Text fontWeight="bold" color="red.700" mb={2}>
                  Различия
                </Text>
                <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
                  {cmp.differences.map((item, i) => (
                    <Box as="li" key={i} color="gray.600" mb={1}>
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Вывод */}
        {conclusion && (
          <Box p={4} bg="blue.50" borderRadius="md" width="100%">
            <Text fontWeight="bold" color="blue.800" mb={2}>
              Вывод
            </Text>
            <Text color="gray.700">{conclusion}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
