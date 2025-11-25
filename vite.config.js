import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Выделяем React и React DOM в отдельный чанк
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Выделяем Chakra UI в отдельный чанк
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react'],
          // Zustand отдельно (небольшой, но для порядка)
          'zustand-vendor': ['zustand'],
        },
      },
    },
    // Увеличиваем лимит предупреждения (опционально)
    chunkSizeWarningLimit: 600,
  },
})
