import {
  BarChart3,
  Bot,
  Home,
  WalletCards,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: Home },
  { to: '/notifications', icon: Bot },
  { to: '/coupons', icon: WalletCards },
  { to: '/analytics', icon: BarChart3 },
]

function MobileBottomNav() {
  return (
    <nav className="glass-card fixed bottom-3 left-1/2 z-20 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-full px-4 py-2 md:max-w-xl">
      <ul className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center justify-center rounded-full p-3 transition',
                    isActive
                      ? 'bg-violet-300/20 text-violet-200 shadow-[0_0_20px_rgba(196,181,253,0.35)]'
                      : 'text-slate-400 hover:text-slate-200',
                  ].join(' ')
                }
              >
                <Icon className="h-4.5 w-4.5" />
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileBottomNav
