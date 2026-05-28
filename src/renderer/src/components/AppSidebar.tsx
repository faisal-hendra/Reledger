import { Link, useLocation } from 'react-router-dom'
import { navItems } from '@/pages'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

interface SidebarProps {
  children: React.ReactNode
}

export default function AppSidebar({ children }: SidebarProps): React.JSX.Element {
  const location = useLocation()

  return (
    <div className="flex flex-1 overflow-hidden bg-sidebar">
      <aside className="font-montserrat bg-transparent text-sm flex flex-col shrink-0 pt-2 w-15">
        <nav className="flex flex-1 flex-col gap-1 py-0.5 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-sidebar-active text-white'
                        : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium truncate hidden">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 bg-main-content border-l border-border overflow-hidden flex flex-col">
        <Toaster />
        {children}
      </main>
    </div>
  )
}
