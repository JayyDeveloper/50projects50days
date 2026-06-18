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
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
        done
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800'
          : 'border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
      }`}
    >
      <button onClick={onToggle} className="flex-shrink-0 transition-transform hover:scale-110">
        {done
          ? <CheckCircle2 size={20} className="text-emerald-500" />
          : <Circle size={20} className="text-gray-300 dark:text-gray-500" />
        }
      </button>
      <p className={`flex-1 text-sm font-medium min-w-0 truncate ${done ? 'line-through text-gray-400' : ''}`}>
        {habit.title}
      </p>
      {streak > 0 && (
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <Flame size={13} className="text-orange-400" />
          <span className="text-xs font-semibold text-orange-500">{streak}</span>
        </div>
      )}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
      >
        <Trash2 size={12} className="text-red-400" />
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
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Habit name *</label>
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Exercise, Read, Meditate..."
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>
      <p className="text-xs text-gray-400">Check off this habit daily to build your streak 🔥</p>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          Cancel
        </button>
        <button type="submit" className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 text-white text-sm font-medium hover:opacity-90 transition">
          Add Habit
        </button>
      </div>
    </form>
  )
}

export default function HabitsCard() {
  const { habits, addHabit, deleteHabit, toggleHabitToday } = useApp()
  const [showModal, setShowModal] = useState(false)
  const t = today()
  const done = habits.filter(h => h.completedDates.includes(t)).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold flex items-center gap-2 text-base">
            <Flame size={17} className="text-orange-400" />
            Habits
          </h2>
          {habits.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">
              {done}/{habits.length} today
            </span>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {habits.length > 0 && (
        <div className="mb-3 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: habits.length ? `${(done / habits.length) * 100}%` : '0%' }}
          />
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
        {habits.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No habits yet — build your streak!</p>
        ) : (
          habits.map(h => (
            <HabitItem
              key={h.id}
              habit={h}
              onToggle={() => toggleHabitToday(h.id)}
              onDelete={() => deleteHabit(h.id)}
            />
          ))
        )}
      </div>

      {showModal && (
        <Modal title="New Habit" onClose={() => setShowModal(false)}>
          <HabitForm
            onSave={(data) => { addHabit(data); setShowModal(false) }}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}
