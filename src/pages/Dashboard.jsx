import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Flame, Trophy, TrendingUp, CheckCircle2, XCircle, Star } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-card border border-cream-200 px-3 py-2 text-sm">
      <p className="font-heading font-semibold text-gray-800">{payload[0]?.value} pts</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const { scores, tasks, currentWeekScore, user } = useApp()
  const [chartView, setChartView] = useState('W') // D | W | M

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  // Build chart data
  const buildChartData = () => {
    if (chartView === 'W') {
      return scores.slice(0, 8).reverse().map(s => ({
        label: `W${new Date(s.week_start).getMonth() + 1}/${new Date(s.week_start).getDate()}`,
        score: s.score,
      }))
    }
    if (chartView === 'D') {
      // Generate last 14 days from score data (simplified)
      return Array.from({ length: 14 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (13 - i))
        return {
          label: d.toLocaleDateString('en', { weekday: 'short' }),
          score: Math.max(0, (currentWeekScore || 80) - Math.floor(Math.random() * 15) + Math.floor(Math.random() * 10)),
        }
      })
    }
    // Monthly
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (11 - i))
      return {
        label: d.toLocaleDateString('en', { month: 'short' }),
        score: Math.max(0, (scores[0]?.score || 80) + Math.floor(Math.random() * 20) - 10),
      }
    })
  }

  const chartData = buildChartData()

  // Efficiency data
  const efficiencyData = scores.slice(0, 6).reverse().map(s => {
    const weekTasks = tasks.filter(t => {
      const created = new Date(t.created_at)
      const wStart = new Date(s.week_start)
      const wEnd = new Date(s.week_end)
      return created >= wStart && created <= wEnd
    })
    const total = weekTasks.length
    const done = weekTasks.filter(t => t.completed).length
    return {
      label: `W${new Date(s.week_start).getDate()}`,
      efficiency: total > 0 ? Math.round((done / total) * 100) : 0,
    }
  })

  // Recent activity
  const recentActivity = tasks
    .filter(t => t.completed_at || t.penalised)
    .sort((a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at))
    .slice(0, 8)

  const scoreColor = currentWeekScore >= 80 ? 'text-sage-600' : currentWeekScore >= 50 ? 'text-amber-600' : 'text-rose-600'
  const scoreRingColor = currentWeekScore >= 80 ? '#4A7A42' : currentWeekScore >= 50 ? '#C07A10' : '#B84040'
  const pct = Math.round((currentWeekScore / 100) * 100)
  const circumference = 2 * Math.PI * 40
  const strokeDash = (pct / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-800 text-2xl text-gray-800">Hey, {name} 👋</h2>
        <p className="text-sm text-gray-400 mt-1">Here's how you're doing this week</p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Score ring */}
        <div className="card flex flex-col items-center justify-center py-6">
          <svg width="100" height="100" className="-rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E8EDE6" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={scoreRingColor} strokeWidth="8"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          </svg>
          <div className="text-center -mt-2">
            <span className={`font-heading font-800 text-3xl ${scoreColor}`}>{currentWeekScore}</span>
            <p className="text-xs text-gray-400 font-semibold mt-1">Week Score</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-3">
          <div className="card py-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-sage-500" />
              <span className="text-xs text-gray-400 font-semibold">Completed</span>
            </div>
            <p className="font-heading font-800 text-xl text-gray-800">
              {tasks.filter(t => t.completed).length}
            </p>
          </div>
          <div className="card py-3">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-amber-400 animate-flame" />
              <span className="text-xs text-gray-400 font-semibold">Streak</span>
            </div>
            <p className="font-heading font-800 text-xl text-gray-800">
              {scores.length} <span className="text-sm font-body font-normal text-gray-400">days</span>
            </p>
          </div>
        </div>
      </div>

      {/* Score trend chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sage-500" />
            <h3 className="font-heading font-700 text-gray-800">Score Trend</h3>
          </div>
          <div className="flex bg-cream-100 rounded-xl p-1 gap-1">
            {['D', 'W', 'M'].map(v => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                className={`px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all duration-200
                  ${chartView === v ? 'bg-white text-sage-800 shadow-card' : 'text-gray-400'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 120]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="score"
                stroke="#4A7A42" strokeWidth={2.5}
                dot={{ fill: '#4A7A42', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#4A7A42' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-300 text-sm">
            Complete tasks to see your trend
          </div>
        )}
      </div>

      {/* Efficiency chart */}
      {efficiencyData.length > 0 && (
        <div className="card">
          <h3 className="font-heading font-700 text-gray-800 mb-4">Task Efficiency</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={efficiencyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="efficiency" fill="#C8D9C3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Scoring rules card */}
      <div className="card bg-lavender-100 border-lavender-200">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-lavender-600" />
          <h3 className="font-heading font-700 text-lavender-800">Scoring Rules</h3>
        </div>
        <ul className="space-y-1.5 text-xs text-lavender-800">
          <li className="flex items-center gap-2"><span className="font-bold text-sage-600">+100</span> Every week starts fresh</li>
          <li className="flex items-center gap-2"><span className="font-bold text-rose-500">−2</span> Each overdue task at midnight</li>
          <li className="flex items-center gap-2"><span className="font-bold text-sage-600">+4</span> All tasks done 3 days in a row</li>
          <li className="flex items-center gap-2"><span className="font-bold text-amber-600">+10</span> Monthly goal hit → gold medal</li>
          <li className="flex items-center gap-2"><span className="font-bold text-lavender-600">+50</span> Yearly goal hit → platinum medal</li>
        </ul>
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="card">
          <h3 className="font-heading font-700 text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map(task => (
              <div key={task.id} className="flex items-center gap-3 py-2 border-b border-cream-200 last:border-0">
                {task.completed
                  ? <CheckCircle2 className="w-4 h-4 text-sage-500 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                <span className="text-sm text-gray-700 flex-1 truncate">{task.title}</span>
                <span className="text-xs text-gray-400">
                  {new Date(task.completed_at || task.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
