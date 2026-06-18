import { useState } from 'react'
import { Flame, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { today, calcStreak } from '../utils/helpers'
import Modal from './Modal'

function HabitItem({ habit, onToggle, onDelete }) {
  const t = today()
  const done = habit.completedDates.includes(t)
  const streak = calcStreak(habit.completedDates)

  return (
    <div className="flex items-center gap-3 group py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0">
      <button onClick={onToggle} className="flex-shrink-0 transition-all hover:scale-110 active:scale-95">
        {done
          ? <CheckCircle2 size={22} className="text-emerald-400 drop-shadow-sm" />
          : <Circle size={22} className="text-gray-200 dark:text-gray-700 hover:text-gray-300" />
        }
      </button>
      <p className={`flex-1 text-sm font-semibold min-w-0 truncate transition-all ${
        done ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'
      }`}>
        {habit.title}
      </p>
      {streak > 0 && (
        <div className={`flex items-center gap-1 flex-shrink-0 px-2 py-0.5 rounded-full ${
          streak >= 7 ? 'bg-orange-100 dark:bg-orange-500/15' : 'bg-gray-100 dark:bg-white/5'
        }`}>
          <Flame size={11} className={streak >= 7 ? 'text-orange-500' : 'text-gray-400'} />
          <span className={`text-xs font-bold ${streak >= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>{streak}d</span>
        </div>
      )}
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0">
        <Trash2 size={11} className="text-red-400" />
      </button>
    </div>
  )
}

function HabitForm({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim() })
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Habit name *</label>
        <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Exercise, Read, Meditate..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition" />
      </div>
      <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl px-3 py-2.5">
        <p className="text-xs text-orange-500 font-medium">Check daily to build your streak. Miss a day and it resets. 🔥</p>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-orange-200 dark:shadow-orange-900/30">Add Habit</button>
      </div>
    </form>
  )
}

export default function HabitsCard() {
  const { habits, addHabit, deleteHabit, toggleHabitToday } = useApp()
  const [showModal, setShowModal] = useState(false)
  const t = today()
  const done = habits.filter(h => h.completedDates.includes(t)).length
  const pct = habits.length ? Math.round((done / habits.length) * 100) : 0

  return (
    <div className="bg-white dark:bg-[#16132a] rounded-3xl shadow-sm shadow-orange-100 dark:shadow-none border border-white dark:border-white/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-500/20 dark:to-rose-500/20 flex items-center justify-center">
            <Flame size={15} className="text-orange-500" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-800 dark:text-white">Habits</h2>
            <p className="text-xs text-gray-400">{done}/{habits.length} done · {pct}%</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-xs bg-gradient-to-r from-orange-400 to-rose-500 text-white font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition shadow-sm shadow-orange-200 dark:shadow-orange-900/30">
          <Plus size={12} /> Add
        </button>
      </div>

      {habits.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-medium">Today's progress</span>
            {pct === 100 && <span className="text-xs font-bold text-emerald-500">🎉 All done!</span>}
          </div>
          <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-rose-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="max-h-56 overflow-y-auto">
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">🔥</p>
            <p className="text-sm font-medium text-gray-400">No habits yet</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Build discipline one day at a time</p>
          </div>
        ) : habits.map(h => (
          <HabitItem key={h.id} habit={h} onToggle={() => toggleHabitToday(h.id)} onDelete={() => deleteHabit(h.id)} />
        ))}
      </div>

      {showModal && (
        <Modal title="New Habit" onClose={() => setShowModal(false)}>
          <HabitForm onSave={(data) => { addHabit(data); setShowModal(false) }} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
