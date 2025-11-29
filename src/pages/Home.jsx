import { Box, Heading, Text, VStack, SimpleGrid, Card, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/state/stateApp'
import { useEffect } from 'react'
import { ROUTES } from '@/constants/routes'

const Home = () => {
  const navigate = useNavigate()
  const { loadDisciplines, disciplines, isLoadingDisciplines } = useAppStore()

  useEffect(() => {
    loadDisciplines()
  }, [loadDisciplines])

  const disciplinesList = Object.values(disciplines)

  return (
    <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }}>
      {/* Приветственный блок */}
      <VStack spacing={6} align="stretch" mb={10}>
        <VStack spacing={4} align={{ base: 'center', md: 'flex-start' }} textAlign={{ base: 'center', md: 'left' }}>
          <Heading 
            size={{ base: 'xl', md: '2xl' }} 
            color="blue.700"
            fontWeight="bold"
          >
            🎓 Добро пожаловать в Study Space!
          </Heading>
          <Text 
            fontSize={{ base: 'md', md: 'lg' }} 
            color="gray.600"
            maxW="800px"
          >
            Уважаемые коллеги! Вот и приблизился день к сдаче государственных экзаменов. 
            Это приложение поможет вам подготовиться к экзаменам по различным дисциплинам.
          </Text>
        </VStack>

        {/* Карточки с информацией */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={4}>
          <Card.Root p={6} bg="blue.50" borderColor="blue.200">
            <Card.Body>
              <VStack spacing={3} align="flex-start">
                <Text fontSize="3xl">📚</Text>
                <Heading size="md" color="blue.700">
                  Вопросы и ответы
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Изучайте вопросы и ответы по всем дисциплинам
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root p={6} bg="green.50" borderColor="green.200">
            <Card.Body>
              <VStack spacing={3} align="flex-start">
                <Text fontSize="3xl">🎯</Text>
                <Heading size="md" color="green.700">
                  Тренажер
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Тренируйтесь на случайных вопросах для лучшей подготовки
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root p={6} bg="purple.50" borderColor="purple.200">
            <Card.Body>
              <VStack spacing={3} align="flex-start">
                <Text fontSize="3xl">📖</Text>
                <Heading size="md" color="purple.700">
                  Литература
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Список рекомендованной литературы и правовых актов
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
      </VStack>

      {/* Список дисциплин */}
      <VStack spacing={4} align="stretch">
        <Heading size="lg" color="blue.700">
          📋 Доступные дисциплины
        </Heading>

        {isLoadingDisciplines ? (
          <Text color="gray.500">Загрузка дисциплин...</Text>
        ) : disciplinesList.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {disciplinesList.map((discipline) => (
              <Card.Root 
                key={discipline.id}
                p={5}
                bg="white"
                borderColor="blue.200"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: 'blue.400',
                }}
                onClick={() => navigate(`${ROUTES.DISCIPLINES}/${discipline.slug}`)}
              >
                <Card.Body>
                  <VStack spacing={3} align="flex-start">
                    <Heading size="md" color="blue.700">
                      {discipline.title}
                    </Heading>
                    {discipline.questionsCount > 0 && (
                      <Text fontSize="sm" color="gray.500">
                        {discipline.questionsCount} вопросов
                      </Text>
                    )}
                    <Button
                      size="sm"
                      colorPalette="blue"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`${ROUTES.DISCIPLINES}/${discipline.slug}`)
                      }}
                    >
                      Открыть →
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        ) : (
          <Card.Root p={6} bg="gray.50">
            <Card.Body>
              <Text color="gray.500" textAlign="center">
                Дисциплины загружаются...
              </Text>
            </Card.Body>
          </Card.Root>
        )}

        {/* Кнопка перехода к дисциплинам */}
        <Box pt={4}>
          <Button
            size="lg"
            colorPalette="blue"
            onClick={() => navigate(ROUTES.DISCIPLINES)}
            w={{ base: 'full', md: 'auto' }}
          >
            Посмотреть все дисциплины →
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default Home
