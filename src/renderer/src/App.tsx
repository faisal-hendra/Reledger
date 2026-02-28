import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Transctions from './pages/Transctions'
import { TooltipProvider } from '@/components/ui/tooltip'
import detectOS from './modules/detect-os'

const os = detectOS()

function App(): React.JSX.Element {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <div
              className={`dragable ${os === 'Windows' ? 'h-8' : 'h-6.5'} bg-[#1b1b1b] flex items-center justify-center border-b border-[#292929] shrink-0`}
            >
              <p className="text-xs text-white select-none">Reledger</p>
            </div>
            <AppSidebar os={os}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transctions />} />
              </Routes>
            </AppSidebar>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}

export default App
