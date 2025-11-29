// Файл оставлен для обратной совместимости
// Основная логика загрузки данных перенесена в src/state/stateApp.js

import { useAppStore } from '@/state/stateApp'

/**
 * @deprecated Используй useAppStore().loadDisciplines()
 */
export const getDisciplinesFromPocketBase = async () => { 
  return useAppStore.getState().loadDisciplines()
}

/**
 * @deprecated Используй useAppStore().loadDisciplineData(slug)
 */
export const getDisciplineData = async (disciplineSlug) => {
  return useAppStore.getState().loadDisciplineData(disciplineSlug)
}

/**
 * @deprecated Используй useAppStore().getQuestion(disciplineSlug, questionNumber)
 */
export const getQuestionWithAnswer = async (disciplineSlug, questionNumber) => {
  return useAppStore.getState().getQuestion(disciplineSlug, questionNumber)
}
