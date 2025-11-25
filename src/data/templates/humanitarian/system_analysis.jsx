import { Text, Box, Heading, VStack, HStack, Badge } from '@chakra-ui/react'

export const SystemAnalysisRender = ({
  title,
  definition,
  essence,
  purpose,
  structure,
  elements,
  legal_basis,
  functions,
  role,
  importance,
  features,
  classifications,
  process, // ← добавлено
  mechanism, // ← добавлено
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
      <VStack align="start" spacing={4} w="100%">
        {/* Заголовок */}
        <Heading as="h2" size="lg" color="blue.700">
          {title}
        </Heading>

        {/* Основные текстовые поля */}
        {definition && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Определение:
            </Text>
            <Text color="gray.700">{definition}</Text>
          </Box>
        )}
        {essence && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Сущность:
            </Text>
            <Text color="gray.700">{essence}</Text>
          </Box>
        )}
        {purpose && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Цель:
            </Text>
            <Text color="gray.700">{purpose}</Text>
          </Box>
        )}

        {/* Механизм (новое поле) */}
        {mechanism && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Механизм:
            </Text>
            <Text color="gray.700">{mechanism}</Text>
          </Box>
        )}

        {/* Роль и значение */}
        {(role || importance) && (
          <VStack align="start" spacing={2} width="100%">
            {role && (
              <Box>
                <Text fontWeight="bold" color="gray.600">
                  Роль:
                </Text>
                <Text color="gray.700">{role}</Text>
              </Box>
            )}
            {importance && (
              <Box>
                <Text fontWeight="bold" color="gray.600">
                  Значение:
                </Text>
                <Text color="gray.700">{importance}</Text>
              </Box>
            )}
          </VStack>
        )}

        {/* Особенности */}
        {features && features.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Особенности
            </Heading>
            <VStack align="start" spacing={1}>
              {features.map((item, i) => (
                <Text key={i} color="gray.600">
                  • {item}
                </Text>
              ))}
            </VStack>
          </Box>
        )}

        {/* Структура */}
        {structure && structure.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Структура системы
            </Heading>
            <VStack align="start" spacing={1}>
              {structure.map((item, i) => (
                <Text key={i} color="gray.600">
                  • {item}
                </Text>
              ))}
            </VStack>
          </Box>
        )}

        {/* Функции */}
        {functions && functions.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Функции
            </Heading>
            <VStack align="start" spacing={2}>
              {functions.map((func, i) => (
                <HStack key={i} bg="blue.50" p={2} borderRadius="md" width="100%">
                  <Text color="gray.700">{func}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        {/* Элементы системы */}
        {elements && elements.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Элементы системы
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
                  <HStack>
                    <Badge colorScheme="green">Функция:</Badge>
                    <Text fontSize="sm" color="gray.700">
                      {el.function}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
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

        {/* Процесс (новый блок) */}
        {process && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Процесс
            </Heading>
            {/* Условия */}
            {process.conditions && (
              <Box mb={4}>
                <Text fontWeight="bold" color="gray.700">
                  Условия:
                </Text>
                <Text color="gray.700">{process.conditions}</Text>
              </Box>
            )}
            {/* Этапы */}
            {process.stages && process.stages.length > 0 && (
              <VStack align="start" spacing={3}>
                <Text fontWeight="bold" color="gray.700">
                  Этапы:
                </Text>
                {process.stages.map((stage, idx) => (
                  <Box
                    key={idx}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    bg="gray.50"
                  >
                    <Text fontWeight="bold" color="blue.600">
                      {stage.name}
                    </Text>
                    <Text mt={1} color="gray.700">
                      {stage.content}
                    </Text>
                    {stage.result && (
                      <Text mt={1} fontStyle="italic" color="gray.600">
                        Результат: {stage.result}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        )}

        {/* Классификации */}
        {classifications && classifications.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Классификации
            </Heading>
            {classifications.map((cls, idx) => (
              <Box key={idx} mt={3}>
                <Text fontWeight="bold" color="gray.700">
                  По: {cls.basis}
                </Text>
                {cls.types?.map((type, tIdx) => (
                  <Box key={tIdx} mt={2} pl={4}>
                    <Text fontWeight="bold" color="blue.600">
                      {type.name}
                    </Text>
                    <VStack align="start" spacing={1}>
                      {type.characteristics?.map((ch, cIdx) => (
                        <Text key={cIdx} fontSize="sm" color="gray.600">
                          • {ch}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                ))}
              </Box>
            ))}
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
