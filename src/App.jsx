import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from '@/providers/chakraProvider'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <Provider>
      <Router>
        <AppRouter />
      </Router>
    </Provider>
  )
}

export default App
