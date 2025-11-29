import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from '@/providers/chakraProvider'
import { AppRouter } from './routes/AppRouter'
import { useAppStore } from '@/state/stateApp'

function App() {
  const { subscribeToChanges, unsubscribeFromChanges } = useAppStore()

  // Подписка на realtime изменения при монтировании
  useEffect(() => {
    subscribeToChanges()
    
    return () => {
      unsubscribeFromChanges()
    }
  }, [subscribeToChanges, unsubscribeFromChanges])

  return (
    <Provider>
      <Router>
        <AppRouter />
      </Router>
    </Provider>
  )
}

export default App
