import { create } from 'zustand'
import { administrationPoliceQuestions } from '@/data/questions/administration-police'
import { chaptersConfig } from '@/config/chapters'

export const useAppStore = create((set, get) => ({
  isOpen: false,
  chapters:  Object.keys(chaptersConfig),
  disciplines: {
    'administration-police': administrationPoliceQuestions,
    // 'criminal-law': criminalLawQuestions,
  },
  getQuestionsByChapter: (chapter) => {
    const state = get()
    return state.disciplines[chapter]?.questions || []
  },
  // Действия
  setIsOpen: (isOpen) => set({ isOpen }),

  toggleChapter: (newChapter) =>
    set((state) => ({
      chapters: {
        ...state.chapters,
        current: newChapter,
      },
    })),

  setChapters: (chapters) => set({ chapters }),
}))
