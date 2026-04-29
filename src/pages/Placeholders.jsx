import { BookOpen, Calendar, Settings, Wrench } from 'lucide-react'

function ComingSoon({ icon: Icon, title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-800 text-2xl text-gray-800">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-lavender-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-lavender-400" />
        </div>
        <h3 className="font-heading font-700 text-gray-700 mb-2">Coming soon</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          This section is part of the full EFFICIO build. Add your tasks and check the Dashboard while it's being built!
        </p>
        <div className="flex gap-1 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-lavender-300 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function NotesPage() {
  return <ComingSoon icon={BookOpen} title="Notes" description="Your personal journal and rich notes editor" />
}

export function CalendarPage() {
  return <ComingSoon icon={Calendar} title="Calendar" description="Events, reminders, and upcoming dates" />
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-800 text-2xl text-gray-800">Settings</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your account and preferences</p>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-sage-500" />
          <h3 className="font-heading font-700 text-gray-800">More settings coming soon</h3>
        </div>
        <p className="text-sm text-gray-400">
          Profile customisation, notification preferences, tag management, and data export/import will be available here.
        </p>
      </div>
    </div>
  )
}
