import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, Spinner } from '@chakra-ui/react'
import { ROUTES } from '@/constants/routes'
import { Layout } from '@/components/layout/Layout'

// Lazy loading компонентов
const Home = lazy(() => import('@/pages/Home'))
const Chapter = lazy(() => import('@/components/chapter/Chapter'))
const DisciplinePage = lazy(() => import('@/pages/DisciplinePage'))
const QuestionDetail = lazy(() => import('@/pages/QuestionDetail'))
const HelpPage = lazy(() => import('@/pages/HelpPage'))

// Компонент загрузки
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minH="50vh"
  >
    <Spinner size="xl" color="blue.500" />
  </Box>
)

export const AppRouter = () => {
  const disciplinesPath = ROUTES.DISCIPLINES.replace(/^\//, '')
  const federalLawPath = ROUTES.FEDERAL_LAW.replace(/^\//, '')
  const helpPath = ROUTES.HELP.replace(/^\//, '')

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path={disciplinesPath}>
            {/* Список всех дисциплин */}
            <Route index element={<Chapter />} />
            
            {/* Страница конкретной дисциплины с вкладками */}
            <Route path=":disciplineId">
              <Route index element={<DisciplinePage />} />
              {/* Детальный просмотр вопроса */}
              <Route path="questions/:id" element={<QuestionDetail />} />
            </Route>
          </Route>

          <Route path={federalLawPath} element={<div>Федеральные законы</div>} />
          <Route path={helpPath} element={<HelpPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
