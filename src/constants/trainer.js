/**
 * Константы тренажера
 */

// Режимы работы тренажера
export const TRAINER_MODES = {
  SELECT: 'select',         // Выбор режима
  FLASHCARDS: 'flashcards', // Карточки
  QUIZ: 'quiz',             // Викторина
  RANDOM: 'random',         // Случайный вопрос
  RESULTS: 'results',       // Результаты
}

// Опции фильтра сложности
export const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'Все уровни' },
  { value: 'easy', label: 'Базовый' },
  { value: 'medium', label: 'Средний' },
  { value: 'hard', label: 'Повышенный' },
]

// Начальное состояние статистики сессии
export const INITIAL_SESSION_STATS = {
  correct: 0,
  incorrect: 0,
  skipped: 0,
  reviewed: [],
}

