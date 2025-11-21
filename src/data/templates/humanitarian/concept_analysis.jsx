// src/templates/humanitarian/ConceptAnalysisRender.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const ConceptAnalysisRender = ({ title, definition, classifications }) => {
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
      <VStack align="start" spacing={5} w="100%">
        {/* Заголовок */}
        <Heading as="h2" size="lg" color="blue.700">
          {title}
        </Heading>

        {/* Определение */}
        {definition && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Определение:
            </Text>
            <Text color="gray.700">{definition}</Text>
          </Box>
        )}

        {/* Классификации */}
        {classifications && classifications.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={4} color="gray.700">
              Классификация
            </Heading>
            <VStack spacing={5} align="start" width="100%">
              {classifications.map((cls, idx) => (
                <Box key={idx} width="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                  <Text fontWeight="bold" color="blue.700" mb={3}>
                    Основание: {cls.basis}
                  </Text>
                  <VStack align="start" spacing={3} pl={4}>
                    {cls.types?.map((type, tIdx) => (
                      <Box key={tIdx} width="100%">
                        <Text fontWeight="bold" color="blue.600">
                          • {type.name}
                        </Text>
                        {type.characteristics && type.characteristics.length > 0 && (
                          <Box as="ul" pl={5} mt={1} style={{ listStyleType: 'circle' }}>
                            {type.characteristics.map((ch, cIdx) => (
                              <Box as="li" key={cIdx} color="gray.600" fontSize="sm" mt={1}>
                                {ch}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
