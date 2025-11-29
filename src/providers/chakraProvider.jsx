import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'

// Кастомная система с красивыми шрифтами
// Inter - для основного текста (читаемый, современный)
// Poppins - для заголовков (элегантный, дружелюбный)
// Fira Code - для кода (моноширинный с лигатурами)
const customSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        body: {
          value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        mono: {
          value: "'Fira Code', 'Courier New', monospace",
        },
      },
    },
  },
})

export function Provider({ children }) {
  return <ChakraProvider value={customSystem}>{children}</ChakraProvider>
}
