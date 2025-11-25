// src/templates/humanitarian/ProceduralRender.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const ProceduralRender = ({
  title,
  process,
  steps,
  requirements,
  documentation,
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

        {/* Процесс (этапы) */}
        {process?.stages && process.stages.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Этапы процесса
            </Heading>
            <VStack spacing={4} align="start" width="100%">
              {process.stages.map((stage, idx) => (
                <Box key={idx} p={4} borderWidth="1px" borderRadius="md" width="100%" bg="gray.50">
                  <Text fontWeight="bold" color="blue.600" mb={1}>
                    {idx + 1}. {stage.name}
                  </Text>
                  <Text color="gray.700" mb={2}>
                    {stage.content}
                  </Text>
                  {stage.result && (
                    <Text fontStyle="italic" color="gray.600">
                      Результат: {stage.result}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Шаги */}
        {steps && steps.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Последовательность действий
            </Heading>
            <VStack align="start" spacing={1}>
              {steps.map((step, i) => (
                <Text key={i} color="gray.600">
                  {i + 1}. {step}
                </Text>
              ))}
            </VStack>
          </Box>
        )}

        {/* Требования */}
        {requirements && requirements.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Требования к исполнению
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {requirements.map((req, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {req}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Документация */}
        {documentation && documentation.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Документация
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {documentation.map((doc, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {doc}
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
