import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, BookOpen, Calendar, Settings, LogOut, Flame } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/todo', icon: CheckSquare, label: 'To-Do' },
  { to: '/notes', icon: BookOpen, label: 'Notes' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function NavItem({ to, icon: Icon, label, sidebar }) {
  const location = useLocation()
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  if (sidebar) {
    return (
      <NavLink to={to}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
          ${isActive ? 'bg-sage-100 text-sage-800' : 'text-gray-400 hover:text-gray-600 hover:bg-cream-200'}`}>
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-heading font-semibold ${isActive ? 'text-sage-800' : ''}`}>{label}</span>
        </div>
      </NavLink>
    )
  }

  // Bottom nav (mobile)
  return (
    <NavLink to={to} className="flex-1">
      <div className={`flex flex-col items-center gap-1 py-2 transition-all duration-200
        ${isActive ? 'text-sage-600' : 'text-gray-400'}`}>
        <Icon className="w-5 h-5" />
        <span className="text-xs font-heading font-semibold">{label}</span>
      </div>
    </NavLink>
  )
}

export default function Layout({ children }) {
  const { user, signOut, currentWeekScore, scores } = useApp()

  // Simple streak: consecutive days with completed tasks (simplified)
  const streak = scores.length

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase()

  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-cream-200 fixed h-full z-20 p-4">
        {/* Logo */}
        <div className="mb-8 px-2">
          <h1 className="font-heading font-800 text-2xl text-sage-800 tracking-widest">EFFICIO</h1>
          <div className="w-8 h-0.5 bg-sage-400 mt-1 rounded-full" />
        </div>

        {/* User */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-sm font-heading font-bold text-sage-800">{initials}</span>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-heading font-semibold text-gray-800 truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400 animate-flame" />
              <span className="text-xs text-gray-400">{streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Score pill */}
        <div className="mx-2 mb-6 bg-sage-100 rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs font-heading font-semibold text-sage-600 uppercase tracking-wider">
            Week score
          </span>
          <span className="text-lg font-heading font-800 text-sage-800">{currentWeekScore}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <NavItem key={item.to} {...item} sidebar />
          ))}
        </nav>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400
                     hover:text-rose-500 hover:bg-rose-100 transition-all duration-200 mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-heading font-semibold">Sign out</span>
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fadeUp">
          {children}
        </div>
      </main>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200
                      flex items-center px-2 z-20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {navItems.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  )
}
