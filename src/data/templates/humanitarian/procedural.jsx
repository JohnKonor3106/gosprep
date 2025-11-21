// src/templates/humanitarian/ProceduralRender.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const ProceduralRender = ({ title, process, steps, requirements }) => {
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

        {/* Процесс (этапы) */}
        {process?.stages && process.stages.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Процесс
            </Heading>
            <VStack spacing={4} align="start" width="100%">
              {process.stages.map((stage, idx) => (
                <Box key={idx} p={4} borderWidth="1px" borderRadius="md" width="100%" bg="gray.50">
                  <Text fontWeight="bold" color="blue.600" mb={1}>
                    {stage.name}
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
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {steps.map((step, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {step}
                </Box>
              ))}
            </Box>
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
      </VStack>
    </Box>
  )
}
