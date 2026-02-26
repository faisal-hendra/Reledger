import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'

function App(): React.JSX.Element {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="flex flex-col h-screen">
          <Sidebar>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Sidebar>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
