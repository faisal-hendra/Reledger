/**
 * Reledger - Personal Finance Ledger Application
 *
 * Root component that initializes the application with:
 * - React Router for page navigation
 * - Theme and currency context providers
 * - Clock synchronization validation
 * - Platform-aware window styling
 */

// Import React Router components for route definitions
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { CurrencyProvider } from '@/components/ui/currency-provider'
import AppSidebar from './components/AppSidebar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import DateMismatchWarning from './pages/special/DateMismatchWarning'

// Store the platform name from the browser API (e.g., 'win32', 'darwin', 'linux')
// This is used to conditionally adjust the titlebar height on Windows
const platform = window.api.platform

/**
 * Main App component - Application wrapper with routing
 * This component handles:
 * - detect clock synchronization (time.now API)
 * - configure theme and currency context
 * - define URL routes with routing guard
 */
function App(): React.JSX.Element {
  // Application state variables
  // isDateMatched: whether local system time matches reference server time
  // isLoading: shows loading indicator while fetching time
  const [isDateMatched, setIsDateMatched] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * Fetches the current server time from time.now API and compares it with system time
   * Purpose: Detect clock synchronization issues that could cause app bugs
   *
   * Parameters:
   * - zone: Local time zone string (e.g., 'America/New_York', 'UTC-7')
   * - url: Server URL to fetch authoritative timezone data
   *
   * Returns:
   * - Processor task result: void (no direct return value, changes internal state instead)
   *
   * Side Effects:
   * - Sets loading state while fetching
   * - Extracts and compares server date with local system date (YYYY-MM-DD format)
   * - Updates date match status based on comparison
   * - Logs error to console if fetch fails
   * - Sets loading state to false regardless of success/failure
   */
  async function fetchTime(): Promise<void> {
    // Get local time zone from Intl.DateTimeFormat resolver options
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // Construct API URL using time.now developer API
    const url = `https://time.now/developer/api/timezone/${zone}`

    try {
      // Show loading indicator while fetching
      setIsLoading(true)
      // Fetch data from API with explicit type response
      const { data } = await axios.get<TimeResponse>(url)

      // Extract server date (YYYY-MM-DD) from ISO 8601 string
      const realDate = data.datetime.toString().substring(0, 10)
      // Get local system date formatted as string
      const systemDate = dayjs().format('YYYY-MM-DD')

      // Compare server date with system date
      const compareDate = realDate === systemDate
      // Update state based on comparison result
      setIsDateMatched(compareDate)
    } catch (error) {
      // Log error to console for debugging
      console.error('Failed to sync time: ', error)
      // If fetch fails, assume date mismatch
      setIsDateMatched(false)
    } finally {
      // Always set loading state to false, whether successful or not
      setIsLoading(false)
    }
  }

  /**
   * Use Effect hook - fetches server time when component mounts and device is online
   * This avoids fetching time on component reload or visibility changes
   *
   * Dependencies:
   * - Empty dependency array []: runs only on mount
   *
   * Effects:
   * - Checks navigator.onLine for network connectivity
   * - Runs fetchTime asynchronously to avoid blocking main thread
   */
  useEffect(() => {
    // Wait until device has network connectivity
    if (navigator.onLine) {
      // Run fetchTime asynchronously (prevent main thread blocking)
      void (async () => {
        await fetchTime()
      })()
    }
  }, [])

  return (
    <>
      {/* Apply system theme preference and save to local storage */}
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <CurrencyProvider>
          <TooltipProvider>
            {/* Show different UI depending on date match status */}
            {isDateMatched ? (
              <div className="flex flex-col h-screen overflow-hidden">
                {/* Window title bar with app name */}
                {/* Height adjusted for Windows title bar chrome, others use standard height */}
                <div
                  className={`dragable ${platform === 'win32' ? 'h-8' : 'h-8'} bg-titlebar flex items-center justify-center border-b border-border shrink-0`}
                >
                  {/* App label - text selected when dragging on Windows */}
                  <p className="text-xs select-none">Reledger</p>
                </div>

                {/* Main navigation sidebar with all routes */}
                <AppSidebar>
                  {/* Page route definitions within sidebar */}
                  <Routes>
                    <Route path="/" element={<Dashboard platform={platform} />} />
                    <Route path="/transactions" element={<Transactions platform={platform} />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AppSidebar>
              </div>
            ) : (
              <DateMismatchWarning onReload={fetchTime} isLoading={isLoading} />
            )}
            {/* Reuse tooltip provider for consistent tooltip behavior across components */}
          </TooltipProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </>
  )
}

export default App
