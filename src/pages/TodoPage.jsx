import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import {
  Plus, Lock, Check, Trash2, Tag, X, AlertCircle,
  ChevronDown, ChevronRight, Zap
} from 'lucide-react'

// ── Confirm modal ─────────────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="card max-w-sm w-full animate-scaleIn">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-heading font-700 text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} className="btn-primary flex-1">Confirm & Lock</button>
        </div>
      </div>
    </div>
  )
}

// ── Level up overlay ──────────────────────────────────────
function LevelUpOverlay({ level, onDone }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream-100/95 animate-scaleIn">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">⭐</div>
        <h1 className="font-heading font-800 text-5xl text-sage-800 tracking-wider mb-2">LEVEL UP!</h1>
        <p className="text-sage-600 font-heading font-semibold text-lg mb-2">{level} Complete</p>
        <div className="flex gap-1 justify-center mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <button onClick={onDone} className="btn-primary px-8">
          <Zap className="w-4 h-4 inline mr-2" />Keep going!
        </button>
      </div>
    </div>
  )
}

// ── Tag selector dropdown ─────────────────────────────────
function TagSelector({ tags, selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const tag = tags.find(t => t.id === selected)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-cream-300 bg-cream-50
                   text-sm text-gray-600 hover:bg-cream-100 transition-all duration-150"
      >
        {tag
          ? <><span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tag.color }} />{tag.name}</>
          : <><Tag className="w-3.5 h-3.5" />Tag</>}
        <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-cardHover border border-cream-200 z-10 overflow-hidden animate-fadeUp">
          <button
            onClick={() => { onSelect(null); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-cream-50"
          >
            No tag
          </button>
          {tags.map(t => (
            <button
              key={t.id}
              onClick={() => { onSelect(t.id); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-cream-50"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Single task row ───────────────────────────────────────
function TaskRow({ task, tags, onToggle, onDelete }) {
  const [animating, setAnimating] = useState(false)
  const tag = tags.find(t => t.id === task.tag_id)
  const isOverdue = !task.completed && task.due_date && new Date(task.due_date) < new Date()

  const handleToggle = () => {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 350)
    onToggle(task.id)
  }

  return (
    <div className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300
      ${task.completed ? 'opacity-60' : ''}
      ${isOverdue ? 'bg-rose-50 border border-rose-100' : 'bg-white border border-cream-200'}
      ${animating ? 'task-complete-anim' : ''}
      hover:shadow-card`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${task.completed
            ? 'bg-sage-500 border-sage-500'
            : 'border-cream-300 hover:border-sage-400'}`}
      >
        {task.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {task.title}
      </span>

      {/* Tag */}
      {tag && (
        <span className="tag-pill text-white text-xs" style={{ background: tag.color + 'dd' }}>
          {tag.name}
        </span>
      )}

      {/* Overdue badge */}
      {isOverdue && !task.completed && (
        <span className="flex items-center gap-1 text-xs text-rose-500 font-semibold">
          <AlertCircle className="w-3 h-3" />−2
        </span>
      )}

      {/* Lock icon */}
      {task.locked && <Lock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}

      {/* Delete */}
      {!task.locked && (
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-rose-400 transition-colors duration-150 flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ── Add task form ─────────────────────────────────────────
function AddTaskForm({ tab, tags, onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [tagId, setTagId] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const inputRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    if (tab === 'daily' || tab === 'weekly') {
      setConfirm(true)
    } else {
      onAdd({ title: title.trim(), tab, tag_id: tagId, due_date: today, locked: false })
    }
  }

  const handleConfirm = () => {
    onAdd({ title: title.trim(), tab, tag_id: tagId, due_date: today, locked: true })
    setConfirm(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-cream-50 rounded-xl border border-cream-200 animate-fadeUp">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          placeholder={`Add ${tab} task...`}
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input flex-1"
        />
        <TagSelector tags={tags} selected={tagId} onSelect={setTagId} />
        <button type="submit" className="btn-primary px-4">
          <Plus className="w-4 h-4" />
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost px-3">
          <X className="w-4 h-4" />
        </button>
      </form>

      {confirm && (
        <ConfirmModal
          title="Lock this task?"
          message="Once confirmed, this task cannot be edited. You can still mark it complete or incomplete."
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(false)}
        />
      )}
    </>
  )
}

// ── Monthly / Yearly level section ────────────────────────
function LevelSection({ label, tasks, tags, onToggle, onDelete, onAdd, tab }) {
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)
  const total = tasks.length
  const done = tasks.filter(t => t.completed).length
  const allDone = total > 0 && done === total
  const [levelUp, setLevelUp] = useState(false)

  const wasAllDone = useRef(false)

  // Detect level completion
  if (allDone && !wasAllDone.current) {
    wasAllDone.current = true
    setTimeout(() => setLevelUp(true), 300)
  }
  if (!allDone) wasAllDone.current = false

  return (
    <>
      {levelUp && <LevelUpOverlay level={label} onDone={() => setLevelUp(false)} />}
      <div className="border border-cream-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 bg-cream-50 hover:bg-cream-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            <span className="font-heading font-semibold text-gray-700">{label}</span>
            {allDone && <span className="text-xs bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full font-semibold">✓ Complete!</span>}
          </div>
          <span className="text-xs text-gray-400">{done}/{total}</span>
        </button>

        {open && (
          <div className="p-3 space-y-2">
            {tasks.map(t => (
              <TaskRow key={t.id} task={t} tags={tags} onToggle={onToggle} onDelete={onDelete} />
            ))}
            {adding
              ? <AddTaskForm tab={tab} tags={tags} onAdd={t => { onAdd(t); setAdding(false) }} onCancel={() => setAdding(false)} />
              : <button onClick={() => setAdding(true)} className="btn-ghost w-full flex items-center gap-2 justify-center py-2 text-sage-500">
                  <Plus className="w-4 h-4" />Add task
                </button>}
          </div>
        )}
      </div>
    </>
  )
}

// ── Main ToDo page ────────────────────────────────────────
const TABS = ['daily', 'weekly', 'monthly', 'yearly']
const TAB_LABELS = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' }

export default function TodoPage() {
  const { getTasksByTab, tags, addTask, toggleTask, deleteTask } = useApp()
  const [activeTab, setActiveTab] = useState('daily')
  const [adding, setAdding] = useState(false)

  const tasks = getTasksByTab(activeTab)
  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  // For monthly: group into 4 weeks
  const monthlyLevels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  const yearlyLevels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const getMonthlyTasks = (weekIdx) =>
    tasks.filter((_, i) => i % 4 === weekIdx)

  const getYearlyTasks = (monthIdx) =>
    tasks.filter((_, i) => i % 12 === monthIdx)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-800 text-2xl text-gray-800">To-Do</h2>
        <p className="text-sm text-gray-400 mt-1">Stay on track, earn points</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-cream-200 rounded-xl p-1 gap-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setAdding(false) }}
            className={`tab-btn flex-1 ${activeTab === tab ? 'active' : ''}`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="card py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-semibold text-gray-500 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-heading font-bold text-sage-600">{pct}%</span>
          </div>
          <div className="h-2.5 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sage-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{completed} of {total} tasks complete</p>
        </div>
      )}

      {/* Task list */}
      {activeTab !== 'monthly' && activeTab !== 'yearly' && (
        <div className="space-y-2">
          {tasks.length === 0 && !adding && (
            <div className="text-center py-12 text-gray-300">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No {activeTab} tasks yet</p>
            </div>
          )}
          {tasks.map(task => (
            <TaskRow key={task.id} task={task} tags={tags} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
          {adding
            ? <AddTaskForm tab={activeTab} tags={tags} onAdd={t => { addTask(t); setAdding(false) }} onCancel={() => setAdding(false)} />
            : <button onClick={() => setAdding(true)} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                <Plus className="w-4 h-4" />Add task
              </button>}
        </div>
      )}

      {/* Monthly: 4 level sections */}
      {activeTab === 'monthly' && (
        <div className="space-y-3">
          {monthlyLevels.map((label, i) => (
            <LevelSection
              key={label} label={label} tab="monthly"
              tasks={getMonthlyTasks(i)} tags={tags}
              onToggle={toggleTask} onDelete={deleteTask}
              onAdd={addTask}
            />
          ))}
        </div>
      )}

      {/* Yearly: 12 level sections */}
      {activeTab === 'yearly' && (
        <div className="space-y-3">
          {yearlyLevels.map((label, i) => (
            <LevelSection
              key={label} label={label} tab="yearly"
              tasks={getYearlyTasks(i)} tags={tags}
              onToggle={toggleTask} onDelete={deleteTask}
              onAdd={addTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Missing import fix
function CheckCircle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
