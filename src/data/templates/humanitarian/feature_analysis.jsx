// src/templates/humanitarian/FeatureAnalysisRender.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const FeatureAnalysisRender = ({
  title,
  definition,
  features,
  characteristics,
  examples,
}) => {
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

        {/* Особенности */}
        {features && features.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Особенности
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {features.map((item, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Характеристики */}
        {characteristics && characteristics.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Характеристики
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {characteristics.map((item, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Примеры */}
        {examples && examples.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Примеры из практики
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {examples.map((item, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
