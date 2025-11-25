import { Box, Tabs, Heading } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/state/stateApp'
import { getLiteratureByDiscipline } from '@/data/literature'
import QuestionCard from '@/components/card/Card'
import { AboutTab, LiteratureTab, LegalBaseTab, TrainerTab } from '@/components/tabs'

const DisciplinePage = () => {
  const { disciplineId } = useParams()
  const { disciplines } = useAppStore()
  
  const discipline = disciplines[disciplineId]
  const literature = getLiteratureByDiscipline(disciplineId)

  if (!discipline) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="lg" color="red.500">Дисциплина не найдена</Heading>
      </Box>
    )
  }

  return (
    <Box p={4}>
      <Heading size="xl" mb={6} color="blue.700">
        {discipline.title}
      </Heading>

      <Tabs.Root defaultValue="questions" variant="enclosed" colorPalette="blue">
        <Tabs.List mb={4} flexWrap="wrap">
          <Tabs.Trigger value="questions" px={4} py={2}>
            📝 Вопросы-ответы
          </Tabs.Trigger>
          <Tabs.Trigger value="trainer" px={4} py={2}>
            🎯 Тренажер
          </Tabs.Trigger>
          <Tabs.Trigger value="about" px={4} py={2}>
            ℹ️ О дисциплине
          </Tabs.Trigger>
          <Tabs.Trigger value="literature" px={4} py={2}>
            📚 Литература
          </Tabs.Trigger>
          <Tabs.Trigger value="legal" px={4} py={2}>
            ⚖️ Правовая база
          </Tabs.Trigger>
        </Tabs.List>

        {/* Вкладка: Вопросы-ответы */}
        <Tabs.Content value="questions">
          <QuestionCard questions={discipline.questions} />
        </Tabs.Content>

        {/* Вкладка: Тренажер */}
        <Tabs.Content value="trainer">
          <TrainerTab questions={discipline.questions} disciplineId={disciplineId} />
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
