import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from '@/providers/chakraProvider'
import { Header } from '@/components/header/Header'
import { AppDrawer } from '@/components/drawer/Drawer'
import { useAppStore } from './state/stateApp'
import { getRoutesList } from './routes/AppRouter'
import { Layout } from './components/layout/Layout'

function App() {
  const { isOpen, setIsOpen } = useAppStore()

  const routes = getRoutesList()

  return (
    <Provider>
      <Router>
        <Layout>
          <Header onOpenMenu={() => setIsOpen(true)} />
          <AppDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </Layout>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
