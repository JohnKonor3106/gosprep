import { useEffect } from 'react'
import { useAppStore } from '@/state/stateApp'
import { Box, Text, SimpleGrid, Spinner } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export const ChapterList = () => {
  const { disciplines, loadDisciplines, isLoadingDisciplines } = useAppStore()
  const navigate = useNavigate()

  // Загружаем дисциплины при монтировании (с кэшем)
  useEffect(() => {
    loadDisciplines()
  }, [loadDisciplines])

  const disciplinesList = Object.values(disciplines)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const handleClick = (id) => {
    navigate(ROUTES.DISCIPLINE_DETAILS(id))
  }

  if (isLoadingDisciplines && disciplinesList.length === 0) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mt={6} gap={5}>
      {disciplinesList.map((discipline) => (
        <Box
          key={discipline.id}
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          bg="white"
          boxShadow="sm"
          _hover={{ 
            bg: 'gray.50', 
            cursor: 'pointer', 
            transform: 'translateY(-2px)',
            boxShadow: 'md'
          }}
          transition="all 0.2s"
          onClick={() => handleClick(discipline.id)}
        >
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {discipline.title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {discipline.questionsCount || 0} вопросов
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  )
}
