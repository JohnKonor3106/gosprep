// routes.ts
import Home from '@/pages/Home'
import Chapter from '@/components/card/Сhapter'
import QuestionCard from '@/components/card/Card'
import QuestionDetail from '@/pages/QuestionDetail'
import { useAppStore } from '@/state/stateApp'

export const getRoutesList = () => {
  const { chapters, disciplines, toggleChapter } = useAppStore()

  const administrationPoliceQuestions = disciplines['administration-police']

  return [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/questions/chapters',
      element: <Chapter list={chapters} toggleChapter={toggleChapter} />,
    },
    {
      path: '/questions/chapters/administration-police',
      element: <QuestionCard questions={administrationPoliceQuestions.questions} />,
    },
    {
      path: '/questions/chapters/administration-police/:id',
      element: <QuestionDetail questions={administrationPoliceQuestions.questions} />,
    },
  ]
}


const AppRoutes = () => {
 
  
}
