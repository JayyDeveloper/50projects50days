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
    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group cursor-pointer ${
      done
        ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20'
        : 'bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
    }`}>
      <button onClick={onToggle} className="flex-shrink-0 transition-all hover:scale-110 active:scale-95">
        {done
          ? <CheckCircle2 size={22} className="text-emerald-500 drop-shadow-sm" />
          : <Circle size={22} className="text-gray-300 dark:text-gray-600" />
        }
      </button>
      <p className={`flex-1 text-sm font-medium min-w-0 truncate transition-colors ${
        done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'
      }`}>
        {habit.title}
      </p>
      {streak > 0 && (
        <div className={`flex items-center gap-1 flex-shrink-0 px-2 py-0.5 rounded-full ${
          streak >= 7 ? 'bg-orange-100 dark:bg-orange-500/15' : 'bg-gray-100 dark:bg-white/5'
        }`}>
          <Flame size={12} className={streak >= 7 ? 'text-orange-500' : 'text-gray-400'} />
          <span className={`text-xs font-bold ${streak >= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500'}`}>{streak}</span>
        </div>
      )}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0"
      >
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
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Habit name *</label>
        <input
          autoFocus value={title} onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Exercise, Read, Cold shower..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition placeholder:text-gray-300 dark:placeholder:text-gray-600"
        />
      </div>
      <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl px-3 py-2.5">
        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Check this off daily to build your streak 🔥 Streaks reset if you miss a day.</p>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-orange-500/25">Add Habit</button>
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
    <div className="bg-white dark:bg-[#13111f] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-fade-up">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Flame size={16} className="text-orange-400" />
              Habits
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{done}/{habits.length} done today · {pct}%</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-semibold bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13} /> New
          </button>
        </div>

        {habits.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            {pct === 100 && <span className="text-xs font-bold text-emerald-500 flex-shrink-0">All done! 🎉</span>}
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {habits.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl mb-1">🔥</p>
              <p className="text-sm text-gray-400">No habits yet</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Build discipline one day at a time</p>
            </div>
          ) : (
            habits.map(h => (
              <HabitItem key={h.id} habit={h} onToggle={() => toggleHabitToday(h.id)} onDelete={() => deleteHabit(h.id)} />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="New Habit" onClose={() => setShowModal(false)}>
          <HabitForm onSave={(data) => { addHabit(data); setShowModal(false) }} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
