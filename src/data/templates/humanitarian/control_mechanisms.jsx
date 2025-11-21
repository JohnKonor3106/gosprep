// src/data/templates/humanitarian/control_mechanisms.jsx
import { Text, Box, Heading, VStack } from '@chakra-ui/react'

export const ControlMechanismsRender = ({
  title,
  mechanism,
  procedures,
  subjects,
  consequences,
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

        {/* Механизм */}
        {mechanism && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Механизм:
            </Text>
            <Text color="gray.700">{mechanism}</Text>
          </Box>
        )}

        {/* Процедуры (способы контроля) */}
        {procedures && procedures.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Способы контроля
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {procedures.map((item, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Субъекты контроля */}
        {subjects && subjects.length > 0 && (
          <Box width="100%">
            <Heading as="h3" size="md" mb={3} color="gray.700">
              Субъекты контроля
            </Heading>
            <Box as="ul" pl={6} style={{ listStyleType: 'disc' }}>
              {subjects.map((item, i) => (
                <Box as="li" key={i} color="gray.600" mb={1}>
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Последствия */}
        {consequences && (
          <Box>
            <Text fontWeight="bold" color="gray.600">
              Последствия нарушений:
            </Text>
            <Text color="gray.700">{consequences}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
