import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import { TooltipProvider } from '@/components/ui/tooltip'

// Fetch platform name
const platform = window.api.platform

function App(): React.JSX.Element {
  return (
    <>
      {/* For development only dark mode will be used, theme switch will be added later */}
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <div
              className={`dragable ${platform === 'win32' ? 'h-8' : 'h-8'} bg-titlebar flex items-center justify-center border-b border-border shrink-0`}
            >
              <p className="text-xs select-none">Reledger</p>
            </div>
            <AppSidebar>
              <Routes>
                <Route path="/" element={<Dashboard platform={platform} />} />
                <Route path="/transactions" element={<Transactions platform={platform} />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AppSidebar>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}

export default App
