import { create } from 'zustand'
import { administrationPoliceQuestions } from '@/data/questions/administration-police'
import { discipinesConfig } from '@/config/disciplines'
import { chaptersConfig } from '@/config/chapters'

export const useAppStore = create((set, get) => ({
  isOpen: false,
  chapters: chaptersConfig,
  disciplines: {
    ...discipinesConfig
  },
  getQuestionsByChapter: (chapter) => {
    const state = get()
    return state.disciplines[chapter]?.questions || []
  },
  // Действия
  setIsOpen: (isOpen) => set({ isOpen }),

}))
