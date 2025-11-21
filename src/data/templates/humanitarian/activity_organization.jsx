// src/templates/humanitarian/ActivityOrganizationRender.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const ActivityOrganizationRender = ({
  title,
  definition,
  structure,
  legal_basis,
  functions,
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

        {/* Структура */}
        {structure && structure.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Структура подразделений
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {structure.map((item, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Функции */}
        {functions && functions.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Основные функции
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {functions.map((func, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {func}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Правовая основа */}
        {legal_basis && legal_basis.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Правовая основа
            </Heading>
            <VStack spacing={3} align="start">
              {legal_basis.map((basis, i) => (
                <Box
                  key={i}
                  p={3}
                  borderLeft="4px"
                  borderColor="blue.300"
                  bg="blue.50"
                  width="100%"
                >
                  <Text fontWeight="bold" color="blue.800">
                    {basis.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {basis.regulation}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
