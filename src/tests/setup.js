import '@testing-library/jest-dom'

// Mock PocketBase
vi.mock('@/services/pocketbase', () => ({
  pb: {
    collection: vi.fn(() => ({
      getFullList: vi.fn(),
      getOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      authWithPassword: vi.fn(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    })),
    authStore: {
      isValid: false,
      model: null,
      token: null,
      clear: vi.fn(),
      onChange: vi.fn(),
    },
    autoCancellation: vi.fn(),
  },
}))

// Mock environment variables
vi.stubEnv('VITE_POCKETBASE_URL', 'http://localhost:8090')

