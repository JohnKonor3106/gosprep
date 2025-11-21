import administrationPoliceAnswer from '@/data/answers/administration-police'
import { SystemAnalysisRender } from '@/data/templates/humanitarian/system_analysis'

/**
 * Находит ответ по ID
 * @param {number|string} id - ID ответа
 * @returns {Object|null} Найденный ответ или null
 */

export const getSpecificAdministrationPoliceAnswer = (id) => {
  try {
    const answerId = Number(id)

    if (isNaN(answerId)) {
      console.warn(`Invalid ID provided: ${id}`)
      return null
    }

    // Ищем в questions (исправляем структуру данных)
    const answer = administrationPoliceAnswer.answers.find((a) => a.id === answerId)

    if (!answer) {
      console.error(`Answer with ID ${id} not found`)
      return null
    }

    return answer
  } catch (e) {
    console.error(`Error in getSpecificAnswer: ${e.message}`)
    throw new Error(`Failed to get answer: ${e.message}`)
  }
}

export const routerGenerated = (routes) => {
  return routes.map((rout) => {
    if (rout.elements && rout.elements.length > 0) {
      const children = rout.elements
      return routerGenerated(children)
    }
    return rout
  })
}
