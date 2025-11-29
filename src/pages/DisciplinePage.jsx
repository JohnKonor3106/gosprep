import { useEffect } from 'react'
import { Box, Tabs, Heading, Spinner, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/state/stateApp'
import { getLiteratureByDiscipline } from '@/data/literature'
import QuestionCard from '@/components/card/Card'
import { AboutTab, LiteratureTab, LegalBaseTab, TrainerTab } from '@/components/tabs'

const DisciplinePage = () => {
  const { disciplineId } = useParams()
  const { 
    disciplineData, 
    loadDisciplineData, 
    isLoadingDisciplineData,
    errors 
  } = useAppStore()

  // Загружаем данные дисциплины (с кэшем)
  useEffect(() => {
    if (disciplineId) {
      loadDisciplineData(disciplineId)
    }
  }, [disciplineId, loadDisciplineData])

  const data = disciplineData[disciplineId]
  const isLoading = isLoadingDisciplineData[disciplineId]
  const error = errors[disciplineId]
  const literature = getLiteratureByDiscipline(disciplineId)

  if (isLoading && !data) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (error && !data) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="lg" color="red.500">Дисциплина не найдена</Heading>
        <Text mt={2} color="gray.500">{error}</Text>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="lg" color="red.500">Дисциплина не найдена</Heading>
      </Box>
    )
  }

  const { discipline, questions } = data

  return (
    <Box p={{ base: 3, md: 4 }}>
      <Heading 
        size={{ base: 'lg', md: 'xl' }} 
        mb={{ base: 4, md: 6 }} 
        color="blue.700"
      >
        {discipline.title}
      </Heading>

      <Tabs.Root defaultValue="questions" variant="enclosed" colorPalette="blue">
        <Tabs.List mb={4} flexWrap="wrap" gap={2}>
          <Tabs.Trigger value="questions" px={{ base: 3, md: 4 }} py={2} fontSize={{ base: 'sm', md: 'md' }}>
            📝 Вопросы-ответы
          </Tabs.Trigger>
          <Tabs.Trigger value="trainer" px={{ base: 3, md: 4 }} py={2} fontSize={{ base: 'sm', md: 'md' }}>
            🎯 Тренажер
          </Tabs.Trigger>
          <Tabs.Trigger value="about" px={{ base: 3, md: 4 }} py={2} fontSize={{ base: 'sm', md: 'md' }}>
            ℹ️ О дисциплине
          </Tabs.Trigger>
          <Tabs.Trigger value="literature" px={{ base: 3, md: 4 }} py={2} fontSize={{ base: 'sm', md: 'md' }}>
            📚 Литература
          </Tabs.Trigger>
          <Tabs.Trigger value="legal" px={{ base: 3, md: 4 }} py={2} fontSize={{ base: 'sm', md: 'md' }}>
            ⚖️ Правовая база
          </Tabs.Trigger>
        </Tabs.List>

        {/* Вкладка: Вопросы-ответы */}
        <Tabs.Content value="questions">
          <QuestionCard questions={questions} />
        </Tabs.Content>

        {/* Вкладка: Тренажер */}
        <Tabs.Content value="trainer">
          <TrainerTab questions={questions} disciplineId={disciplineId} />
        </Tabs.Content>

        {/* Вкладка: О дисциплине */}
        <Tabs.Content value="about">
          <AboutTab about={literature?.about} discipline={discipline} />
        </Tabs.Content>

        {/* Вкладка: Литература */}
        <Tabs.Content value="literature">
          <LiteratureTab literature={literature} />
        </Tabs.Content>

        {/* Вкладка: Правовая база */}
        <Tabs.Content value="legal">
          <LegalBaseTab legalBase={literature?.legalBase} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  )
}

export default DisciplinePage
