import { Button } from '@/components/ui/button'
import { ArrowUpIcon } from 'lucide-react'
import { ThemeProvider } from '@/components/ui/theme-provider'

function App(): React.JSX.Element {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button variant="outline">Button</Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUpIcon />
        </Button>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <></>
        </ThemeProvider>
      </div>
    </>
  )
}

export default App
