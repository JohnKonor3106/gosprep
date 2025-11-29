export const ADMIN_ROUTES = {
  // Базовый путь
  BASE: '/admin',
  
  // Авторизация
  LOGIN: '/admin/login',
  
  // Dashboard
  DASHBOARD: '/admin/dashboard',
  
  // Логи активности
  LOGS: '/admin/logs',
  
  // Документация
  DOCS: '/admin/docs',
  
  // Дисциплины
  DISCIPLINES: '/admin/disciplines',
  DISCIPLINE_CREATE: '/admin/disciplines/create',
  DISCIPLINE_EDIT: (id) => `/admin/disciplines/${id}/edit`,
  
  // Вопросы
  QUESTIONS: '/admin/questions',
  QUESTION_CREATE: '/admin/questions/create',
  QUESTION_EDIT: (id) => `/admin/questions/${id}/edit`,
  QUESTION_PREVIEW: (id) => `/admin/questions/${id}/preview`,
  
  // Ответы
  ANSWERS: '/admin/answers',
  ANSWER_CREATE: '/admin/answers/create',
  ANSWER_EDIT: (id) => `/admin/answers/${id}/edit`,
}

