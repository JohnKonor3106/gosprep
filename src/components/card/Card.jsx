import { Box, Text, SimpleGrid, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const QuestionCard = ({ questions }) => {
  const navigate = useNavigate()

  const handleShowQuestion = (number) => {
    navigate(`questions/${number}`)
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4} mt={4}>
      {questions.map((q) => (
        <Box
          key={q.id || q.number}
          p={4}
          borderRadius="lg"
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
          onClick={() => handleShowQuestion(q.number || q.id)}
          _hover={{
            bg: 'blue.100',
            cursor: 'pointer',
            transform: 'translateY(-2px)',
            boxShadow: 'md',
            borderColor: 'blue.300',
            transition: 'all 0.2s',
          }}
          transition="all 0.2s"
          boxShadow="sm"
        >
          <VStack align="stretch" spacing={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="blue.700"
                bg="blue.200"
                px={2}
                py={1}
                borderRadius="md"
              >
                {String(q.number || q.id).padStart(2, '0')}
              </Text>
            </Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.700"
              lineHeight="1.4"
              noOfLines={2}
            >
              {q.topic || q.title}
            </Text>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  )
}

export default QuestionCard
