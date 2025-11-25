// src/templates/humanitarian/ActivityOrganizationRender.jsx
import { Text, Box, Heading, VStack, HStack, Badge } from '@chakra-ui/react'

export const ActivityOrganizationRender = ({
  title,
  definition,
  structure,
  elements,
  legal_basis,
  functions,
  examples,
  answer_outline,
  sources,
}) => {
  return (
    <Box
      w="100%"
      maxW="1300px"
      maxH="72vh"
      overflowY="auto"
      p={4}
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

        {/* Элементы */}
        {elements && elements.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Основные элементы
            </Heading>
            <VStack spacing={4} align="start">
              {elements.map((el, i) => (
                <Box key={i} p={4} borderWidth="1px" borderRadius="md" width="100%" bg="gray.50">
                  <Text fontWeight="bold" color="blue.600" mb={1}>
                    {el.name}
                  </Text>
                  <Text color="gray.600" mb={2} fontSize="sm">
                    {el.description}
                  </Text>
                  {el.function && (
                    <HStack>
                      <Badge colorScheme="green">Функция:</Badge>
                      <Text fontSize="sm" color="gray.700">
                        {el.function}
                      </Text>
                    </HStack>
                  )}
                </Box>
              ))}
            </VStack>
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
                  {basis.regulation && (
                    <Text fontSize="sm" color="gray.600">
                      {basis.regulation}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
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

        {/* Опорный план ответа */}
        {answer_outline && answer_outline.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Опорный план ответа
            </Heading>
            <VStack align="start" spacing={1}>
              {answer_outline.map((item, i) => (
                <Text key={i} color="gray.700">
                  • {item}
                </Text>
              ))}
            </VStack>
          </Box>
        )}

        {/* Источники */}
        {sources && sources.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="sm" mb={2} color="gray.700">
              Нормативные источники и литература
            </Heading>
            <VStack align="start" spacing={1}>
              {sources.map((src, i) => (
                <Text key={i} fontSize="sm" color="gray.600">
                  • {src}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
