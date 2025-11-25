/**
 * Константы для вопросов и ответов
 */

// Типы структуры вопросов
export const STRUCTURE_TYPE_TITLES = {
  system_analysis: 'Системный анализ',
  concept_analysis: 'Понятийный анализ',
  comparative_analysis: 'Сравнительный анализ',
  control_mechanisms: 'Механизмы контроля',
  activity_organization: 'Организация деятельности',
  procedural: 'Процедурный формат',
  feature_analysis: 'Анализ особенностей',
}

// Уровни сложности — подписи
export const DIFFICULTY_LABELS = {
  easy: 'Базовый',
  medium: 'Средний',
  hard: 'Повышенный',
}

// Уровни сложности — цвета (для Chakra UI colorScheme/colorPalette)
export const DIFFICULTY_COLORS = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
}

// Типы вопросов
export const QUESTION_TYPES = {
  THEORY: 'theory',
  PRACTICE: 'practice',
  CASE: 'case',
}

// Важность вопроса
export const IMPORTANCE_LEVELS = {
  CORE: 'core',       // Основной
  OFTEN: 'often',     // Часто встречается
  RARE: 'rare',       // Редко встречается
}

