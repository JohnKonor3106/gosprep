

const DISCIPLINES_BASE = '/disciplines';
const FEDERAL_BASE = '/federal-law'; // law, не low (low - это низкий)

export const ROUTES = {
  // 1. Главная
  HOME: '/',

  // 2. Список всех дисциплин (каталог)
  DISCIPLINES: DISCIPLINES_BASE,

  // 3. Конкретная дисциплина (список вопросов внутри неё)
  // Пример: /disciplines/administration-police
  DISCIPLINE_DETAILS: (disciplineId) => `${DISCIPLINES_BASE}/${disciplineId}`,

  // 4. Детальная страница вопроса
  // Пример: /disciplines/administration-police/questions/1
  QUESTION_DETAIL: (disciplineId, questionId) => 
    `${DISCIPLINES_BASE}/${disciplineId}/questions/${questionId}`,

  // 5. Детальная страница ответа (если она отдельная)
  ANSWER_DETAIL: (disciplineId, answerId) => 
    `${DISCIPLINES_BASE}/${disciplineId}/answers/${answerId}`,

  // 6. Правовая база (федеральные законы)
  FEDERAL_LAW: FEDERAL_BASE,
  
  // 7. Помощь
  HELP: '/help',
};
