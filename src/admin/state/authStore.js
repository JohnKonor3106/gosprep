import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb } from '@/services/pocketbase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Проверка авторизации при загрузке
      checkAuth: () => {
        const isValid = pb.authStore.isValid
        const user = pb.authStore.record
        
        set({ 
          isAuthenticated: isValid, 
          user: isValid ? user : null 
        })
        
        return isValid
      },

      // Вход
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const authData = await pb.collection('users').authWithPassword(email, password)
          
          set({ 
            user: authData.record, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          })
          
          return { success: true }
        } catch (error) {
          console.error('Ошибка авторизации:', error)
          
          let errorMessage = 'Ошибка авторизации'
          if (error.status === 400) {
            errorMessage = 'Неверный email или пароль'
          } else if (error.status === 0) {
            errorMessage = 'Сервер недоступен'
          }
          
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null
          })
          
          return { success: false, error: errorMessage }
        }
      },

      // Выход
      logout: () => {
        pb.authStore.clear()
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null
        })
      },

      // Очистка ошибки
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        // Не сохраняем sensitive данные в localStorage
        // PocketBase сам управляет токеном
      }),
    }
  )
)

// Слушаем изменения в authStore PocketBase
pb.authStore.onChange((token, model) => {
  useAuthStore.setState({
    isAuthenticated: pb.authStore.isValid,
    user: model,
  })
})

