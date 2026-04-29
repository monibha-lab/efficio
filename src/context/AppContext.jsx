import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [scores, setScores] = useState([])
  const [tags, setTags] = useState([
    { id: 'school', name: 'School', color: '#85B07A' },
    { id: 'health', name: 'Health', color: '#4A7A42' },
    { id: 'personal', name: 'Personal', color: '#9B8FD9' },
    { id: 'work', name: 'Work', color: '#D97070' },
  ])

  // ── Auth ──────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Load tasks when user logs in ──────────────────────
  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchScores()
      runMidnightCheck()
    }
  }, [user])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) setTasks(data)
  }

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .limit(12)

    if (!error && data) setScores(data)
  }

  // ── Midnight check: deduct pts for overdue tasks ──────
  const runMidnightCheck = async () => {
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    // Get tasks overdue and not yet penalised
    const { data: overdueTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false)
      .eq('penalised', false)
      .lt('due_date', todayStr)

    if (!overdueTasks || overdueTasks.length === 0) return

    const deduction = overdueTasks.length * 2
    await applyScoreChange(-deduction, 'overdue_penalty')

    // Mark tasks as penalised
    const ids = overdueTasks.map(t => t.id)
    await supabase.from('tasks').update({ penalised: true }).in('id', ids)

    fetchTasks()
    fetchScores()
  }

  // ── Get or create current week's score row ────────────
  const getCurrentWeekScore = async () => {
    const now = new Date()
    const day = now.getDay()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - day)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const weekStartStr = weekStart.toISOString().split('T')[0]

    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStartStr)
      .single()

    if (data) return data

    // Create new week row
    const { data: newRow } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        week_start: weekStartStr,
        week_end: weekEnd.toISOString().split('T')[0],
        score: 100,
      })
      .select()
      .single()

    return newRow
  }

  const applyScoreChange = async (delta, reason) => {
    const currentWeek = await getCurrentWeekScore()
    if (!currentWeek) return

    const newScore = Math.max(0, Math.min(200, currentWeek.score + delta))

    await supabase
      .from('scores')
      .update({ score: newScore, updated_at: new Date().toISOString() })
      .eq('id', currentWeek.id)

    fetchScores()
    return newScore
  }

  // ── Task CRUD ─────────────────────────────────────────
  const addTask = async (taskData) => {
    const dueDate = new Date()
    dueDate.setHours(23, 59, 0, 0)

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: taskData.title,
        tab: taskData.tab,
        tag_id: taskData.tag_id || null,
        due_date: taskData.due_date || dueDate.toISOString().split('T')[0],
        locked: taskData.locked || false,
        completed: false,
        penalised: false,
      })
      .select()
      .single()

    if (!error && data) {
      setTasks(prev => [data, ...prev])
    }
    return { data, error }
  }

  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const wasCompleted = task.completed
    const newCompleted = !wasCompleted

    const { error } = await supabase
      .from('tasks')
      .update({
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq('id', taskId)

    if (!error) {
      setTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, completed: newCompleted } : t)
      )

      // Check 3-consecutive-day bonus
      if (newCompleted) checkConsecutiveDayBonus()
    }
  }

  const lockTask = async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .update({ locked: true })
      .eq('id', taskId)

    if (!error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, locked: true } : t))
    }
  }

  const deleteTask = async (taskId) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (!error) setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  // ── Check 3-day bonus ─────────────────────────────────
  const checkConsecutiveDayBonus = async () => {
    const today = new Date().toISOString().split('T')[0]
    const dates = []
    for (let i = 0; i < 3; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split('T')[0])
    }

    // Check if all daily tasks were completed each of the last 3 days
    // Simplified: check if there are completed tasks on all 3 days
    const { data } = await supabase
      .from('tasks')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('tab', 'daily')
      .eq('completed', true)
      .gte('completed_at', dates[2] + 'T00:00:00')

    if (!data) return

    const completedDates = new Set(data.map(t => t.completed_at?.split('T')[0]))
    const allThreeDays = dates.every(d => completedDates.has(d))

    if (allThreeDays) {
      await applyScoreChange(4, '3_day_bonus')
    }
  }

  // ── Auth actions ──────────────────────────────────────
  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUpWithEmail = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  // ── Computed ──────────────────────────────────────────
  const currentWeekScore = scores[0]?.score ?? 100

  const getTasksByTab = (tab) => tasks.filter(t => t.tab === tab)

  return (
    <AppContext.Provider value={{
      user, session, loading,
      tasks, scores, tags, setTags,
      currentWeekScore,
      getTasksByTab,
      addTask, toggleTask, lockTask, deleteTask,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOut,
      fetchTasks, fetchScores, applyScoreChange,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
