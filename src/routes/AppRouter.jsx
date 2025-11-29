import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Spinner } from '@chakra-ui/react'
import { ROUTES } from '@/constants/routes'
import { ADMIN_ROUTES } from '@/admin/constants/routes'
import { Layout } from '@/components/layout/Layout'

// Lazy loading — основные страницы
const Home = lazy(() => import('@/pages/Home'))
const Chapter = lazy(() => import('@/components/chapter/Chapter'))
const DisciplinePage = lazy(() => import('@/pages/DisciplinePage'))
const QuestionDetail = lazy(() => import('@/pages/QuestionDetail'))
const FederalLawPage = lazy(() => import('@/pages/FederalLawPage'))
const HelpPage = lazy(() => import('@/pages/HelpPage'))

// Lazy loading — админка
const AdminLogin = lazy(() => import('@/admin/pages/AdminLogin'))
const AdminLayout = lazy(() => import('@/admin/components/AdminLayout'))
const AdminDashboard = lazy(() => import('@/admin/pages/AdminDashboard'))
const DisciplinesList = lazy(() => import('@/admin/pages/DisciplinesList'))
const DisciplineCreate = lazy(() => import('@/admin/pages/DisciplineCreate'))
const DisciplineEdit = lazy(() => import('@/admin/pages/DisciplineEdit'))
const QuestionsList = lazy(() => import('@/admin/pages/QuestionsList'))
const QuestionCreate = lazy(() => import('@/admin/pages/QuestionCreate'))
const QuestionEdit = lazy(() => import('@/admin/pages/QuestionEdit'))
const QuestionPreview = lazy(() => import('@/admin/pages/QuestionPreview'))
const AdminDocs = lazy(() => import('@/admin/pages/AdminDocs'))
const AnswersList = lazy(() => import('@/admin/pages/AnswersList'))
const AnswerCreate = lazy(() => import('@/admin/pages/AnswerCreate'))
const AnswerEdit = lazy(() => import('@/admin/pages/AnswerEdit'))
const ActivityLogs = lazy(() => import('@/admin/pages/ActivityLogs'))
const ProtectedRoute = lazy(() => import('@/admin/components/ProtectedRoute'))

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
        {/* ==================== ОСНОВНОЕ ПРИЛОЖЕНИЕ ==================== */}
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

        <Route path={federalLawPath} element={<FederalLawPage />} />
        <Route path={helpPath} element={<HelpPage />} />
        </Route>

        {/* ==================== АДМИН-ПАНЕЛЬ ==================== */}
        
        {/* Страница логина (без защиты) */}
        <Route path={ADMIN_ROUTES.LOGIN} element={<AdminLogin />} />
        
        {/* Редирект /admin на /admin/dashboard */}
        <Route path={ADMIN_ROUTES.BASE} element={<Navigate to={ADMIN_ROUTES.DASHBOARD} replace />} />
        
        {/* Защищённые роуты админки */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
          
          {/* Дисциплины */}
          <Route path={ADMIN_ROUTES.DISCIPLINES} element={<DisciplinesList />} />
          <Route path={ADMIN_ROUTES.DISCIPLINE_CREATE} element={<DisciplineCreate />} />
          <Route path="/admin/disciplines/:id/edit" element={<DisciplineEdit />} />
          
          {/* Вопросы */}
          <Route path={ADMIN_ROUTES.QUESTIONS} element={<QuestionsList />} />
          <Route path={ADMIN_ROUTES.QUESTION_CREATE} element={<QuestionCreate />} />
          <Route path="/admin/questions/:id/edit" element={<QuestionEdit />} />
          <Route path="/admin/questions/:id/preview" element={<QuestionPreview />} />
          
          {/* Ответы */}
          <Route path={ADMIN_ROUTES.ANSWERS} element={<AnswersList />} />
          <Route path={ADMIN_ROUTES.ANSWER_CREATE} element={<AnswerCreate />} />
          <Route path="/admin/answers/:id/edit" element={<AnswerEdit />} />
          
          {/* Логи активности */}
          <Route path={ADMIN_ROUTES.LOGS} element={<ActivityLogs />} />
          
          {/* Документация */}
          <Route path={ADMIN_ROUTES.DOCS} element={<AdminDocs />} />
      </Route>
    </Routes>
    </Suspense>
  )
}
