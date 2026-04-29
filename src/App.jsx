import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Splash from './components/Splash'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import TodoPage from './pages/TodoPage'
import { NotesPage, CalendarPage, SettingsPage } from './pages/Placeholders'

export default function App() {
  const { user, loading } = useApp()
  const [showSplash, setShowSplash] = useState(true)
  const [splashDone, setSplashDone] = useState(false)

  // Show splash on every app open
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 4200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {showSplash && !splashDone && (
        <Splash onDone={() => setShowSplash(false)} />
      )}

      {!user ? (
        <AuthPage />
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </>
  )
}
