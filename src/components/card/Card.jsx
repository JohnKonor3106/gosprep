import { Box, Text, SimpleGrid } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const QuestionCard = ({ questions }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleShowQuestion = (id) => {
    console.log(location.pathname)
    navigate(`${location.pathname}/${id}`)
  }

  return (
    <SimpleGrid columns={{ base: 4, sm: 6, md: 8, lg: 10 }} gap={3} justifyItems="center" mt={4}>
      {questions.map((q) => (
        <Box
          key={q.id}
          width="40px"
          height="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
          color="blue.700"
          fontWeight="bold"
          fontSize="sm"
          onClick={() => handleShowQuestion(q.id)}
          _hover={{
            bg: 'blue.100',
            cursor: 'pointer',
            transform: 'scale(1.05)',
            transition: 'all 0.2s',
          }}
          transition="all 0.2s"
        >
          <Text>{String(q.id).padStart(2, '0')}</Text>
        </Box>
      ))}
    </SimpleGrid>
  )
}

export default QuestionCard
