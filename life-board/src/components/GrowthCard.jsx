import { useState } from 'react'
import { TrendingUp, Plus, Trash2, Pencil } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

const COLORS = {
  purple: { bar: 'from-violet-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  pink: { bar: 'from-pink-400 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
  teal: { bar: 'from-teal-400 to-emerald-500', bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
  orange: { bar: 'from-orange-400 to-amber-500', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
  blue: { bar: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  green: { bar: 'from-green-400 to-teal-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
}

const COLOR_OPTIONS = Object.keys(COLORS)

function AreaForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [progress, setProgress] = useState(initial?.progress ?? 50)
  const [color, setColor] = useState(initial?.color ?? 'purple')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), progress, color })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Area name *</label>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Coding, Fitness, Reading..."
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-teal-400 transition"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Progress: {progress}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={e => setProgress(Number(e.target.value))}
          className="w-full accent-teal-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map(c => {
            const col = COLORS[c]
            return (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${col.bar} transition-transform hover:scale-110 ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110' : ''
                }`}
              />
            )
          })}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          Cancel
        </button>
        <button type="submit" className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${COLORS[color].bar} text-white text-sm font-medium hover:opacity-90 transition`}>
          {initial ? 'Save' : 'Add Area'}
        </button>
      </div>
    </form>
  )
}

function AreaItem({ area, onEdit, onDelete }) {
  const col = COLORS[area.color] ?? COLORS.purple

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${col.bar}`} />
          <span className="text-sm font-medium">{area.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-semibold ${col.text}`}>{area.progress}%</span>
          <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity ml-1">
            <button
              onClick={onEdit}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Pencil size={11} className="text-gray-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={11} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${col.bar} rounded-full transition-all duration-500`}
          style={{ width: `${area.progress}%` }}
        />
      </div>
    </div>
  )
}

export default function GrowthCard() {
  const { growthAreas, addGrowthArea, updateGrowthArea, deleteGrowthArea } = useApp()
  const [modal, setModal] = useState(null)

  const avg = growthAreas.length
    ? Math.round(growthAreas.reduce((s, a) => s + a.progress, 0) / growthAreas.length)
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold flex items-center gap-2 text-base">
            <TrendingUp size={17} className="text-teal-500" />
            Growth Areas
          </h2>
          {growthAreas.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">{avg}% avg</span>
          )}
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-1 text-xs text-teal-500 hover:text-teal-600 font-medium bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-0.5">
        {growthAreas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No growth areas — define what you're working on!</p>
        ) : (
          growthAreas.map(a => (
            <AreaItem
              key={a.id}
              area={a}
              onEdit={() => setModal(a)}
              onDelete={() => deleteGrowthArea(a.id)}
            />
          ))
        )}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'New Growth Area' : 'Edit Area'}
          onClose={() => setModal(null)}
        >
          <AreaForm
            initial={modal === 'add' ? null : modal}
            onSave={(data) => {
              if (modal === 'add') addGrowthArea(data)
              else updateGrowthArea(modal.id, data)
              setModal(null)
            }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
