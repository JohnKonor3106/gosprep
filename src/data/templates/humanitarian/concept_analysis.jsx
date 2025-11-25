// src/templates/humanitarian/ConceptAnalysisRender.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const ConceptAnalysisRender = ({
  title,
  definition,
  essence,
  purpose,
  features,
  characteristics,
  classifications,
  examples,
  terminology,
  importance,
  practice,
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

        {/* Сущность */}
        {essence && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Сущность:
            </Text>
            <Text color="gray.700">{essence}</Text>
          </Box>
        )}

        {/* Цель / Назначение */}
        {purpose && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Назначение:
            </Text>
            <Text color="gray.700">{purpose}</Text>
          </Box>
        )}

        {/* Признаки / Особенности */}
        {features && features.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Признаки
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

        {/* Примеры */}
        {examples && examples.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Примеры
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

        {/* Терминология */}
        {terminology && Object.keys(terminology).length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Терминология
            </Heading>
            <VStack align="start" spacing={2}>
              {Object.entries(terminology).map(([term, desc], i) => (
                <Box key={i} p={2} bg="gray.50" borderRadius="md" width="100%">
                  <Text fontWeight="bold" color="blue.600">
                    {term}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {desc}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Практика применения */}
        {practice && (practice.areas || practice.methods) && (
          <Box width="100%" p={4} borderWidth="1px" borderRadius="md" bg="green.50">
            <Heading as="h3" size="md" mb={3} color="green.700">
              Практика применения
            </Heading>
            {practice.areas && practice.areas.length > 0 && (
              <Box mb={3}>
                <Text fontWeight="bold" color="gray.700" mb={1}>
                  Сферы применения:
                </Text>
                <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
                  {practice.areas.map((area, i) => (
                    <Box as="li" key={i} color="gray.600" mb={1}>
                      {area}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {practice.methods && practice.methods.length > 0 && (
              <Box>
                <Text fontWeight="bold" color="gray.700" mb={1}>
                  Методы:
                </Text>
                <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
                  {practice.methods.map((method, i) => (
                    <Box as="li" key={i} color="gray.600" mb={1}>
                      {method}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Значение */}
        {importance && (
          <Box p={3} bg="blue.50" borderRadius="md" width="100%">
            <Text fontWeight="bold" color="blue.800">
              Значение:
            </Text>
            <Text color="gray.700">{importance}</Text>
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
