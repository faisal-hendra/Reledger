import { Link, useLocation } from 'react-router-dom'
import { navItems } from '@/pages/_pages'

interface SidebarProps {
  children: React.ReactNode
}

export default function Sidebar({ children }: SidebarProps): React.JSX.Element {
  const location = useLocation()

  return (
    <div className="flex h-full select-none">
      <aside className="font-montserrat w-50 bg-transparent text-gray-300 text-sm flex flex-col shrink-0">
        <div className={`p-0 border-gray-700}`}></div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            const ActiveIcon = item.activeIcon

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`navlink flex items-center gap-3 px-4 py-3 mx-2 rounded transition-all duration-50 ${
                  isActive ? 'bg-[#414141] text-white' : 'hover:text-white text-[#9c9c9c]'
                }`}
              >
                {!isActive ? <Icon className="w-5 h-5" /> : <ActiveIcon className="w-5 h-5" />}

                <span className="font-[450] ">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t font-mono border-[#303030] text-xs text-[#9c9c9c]">
          In Development
        </div>
      </aside>

      <main
        className={`flex-1 overflow-auto bg-[#191919] pl-4 w-screen border-[#303030] border-l-[1px] pt-4`}
      >
        {children}
      </main>
    </div>
  )
}
