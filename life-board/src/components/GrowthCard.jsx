import { useState } from 'react'
import { TrendingUp, Plus, Trash2, Pencil } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

const COLORS = {
  purple: { bar: 'from-violet-500 to-purple-600', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  pink:   { bar: 'from-pink-400 to-rose-500',     text: 'text-pink-600 dark:text-pink-400',     dot: 'bg-pink-500'   },
  teal:   { bar: 'from-teal-400 to-emerald-500',  text: 'text-teal-600 dark:text-teal-400',     dot: 'bg-teal-500'   },
  orange: { bar: 'from-orange-400 to-amber-500',  text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
  blue:   { bar: 'from-blue-400 to-indigo-500',   text: 'text-blue-600 dark:text-blue-400',     dot: 'bg-blue-500'   },
  green:  { bar: 'from-green-400 to-teal-500',    text: 'text-green-600 dark:text-green-400',   dot: 'bg-green-500'  },
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

  const col = COLORS[color] ?? COLORS.purple

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Area name *</label>
        <input
          autoFocus value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Coding, Fitness, Reading..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-teal-400 transition placeholder:text-gray-300 dark:placeholder:text-gray-600"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Progress: <span className={`${col.text} font-bold`}>{progress}%</span></label>
        <div className="mb-2 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${col.bar} rounded-full transition-all`} style={{ width: `${progress}%` }} />
        </div>
        <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full accent-teal-500" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${COLORS[c].bar} transition-all hover:scale-110 ${
                color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110' : ''
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${col.bar} text-white text-sm font-semibold hover:opacity-90 transition shadow-lg`}>{initial ? 'Save Changes' : 'Add Area'}</button>
      </div>
    </form>
  )
}

function AreaItem({ area, onEdit, onDelete }) {
  const col = COLORS[area.color] ?? COLORS.purple
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${col.dot} flex-shrink-0`} />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{area.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-sm font-bold ${col.text} mr-1`}>{area.progress}%</span>
          <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
            <button onClick={onEdit} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <Pencil size={11} className="text-gray-400" />
            </button>
            <button onClick={onDelete} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <Trash2 size={11} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${col.bar} rounded-full transition-all duration-700`}
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
    <div className="bg-white dark:bg-[#13111f] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-fade-up">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-500" />
              Growth Areas
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{growthAreas.length} areas · {avg}% average</p>
          </div>
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 dark:hover:bg-teal-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13} /> New
          </button>
        </div>

        <div className="space-y-4 max-h-72 overflow-y-auto">
          {growthAreas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl mb-1">📈</p>
              <p className="text-sm text-gray-400">No growth areas yet</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Define what you're levelling up</p>
            </div>
          ) : (
            growthAreas.map(a => (
              <AreaItem key={a.id} area={a} onEdit={() => setModal(a)} onDelete={() => deleteGrowthArea(a.id)} />
            ))
          )}
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'New Growth Area' : 'Edit Area'} onClose={() => setModal(null)}>
          <AreaForm
            initial={modal === 'add' ? null : modal}
            onSave={(data) => { modal === 'add' ? addGrowthArea(data) : updateGrowthArea(modal.id, data); setModal(null) }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
