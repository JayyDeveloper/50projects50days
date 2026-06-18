import { useState } from 'react'
import { TrendingUp, Plus, Trash2, Pencil } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

const COLORS = {
  purple: { grad: 'from-violet-400 to-purple-500', dot: 'bg-violet-500', text: 'text-violet-500 dark:text-violet-400', ring: 'bg-violet-100 dark:bg-violet-500/20' },
  pink:   { grad: 'from-pink-400 to-rose-500',     dot: 'bg-pink-500',   text: 'text-pink-500 dark:text-pink-400',     ring: 'bg-pink-100 dark:bg-pink-500/20'   },
  teal:   { grad: 'from-teal-400 to-emerald-400',  dot: 'bg-teal-500',   text: 'text-teal-500 dark:text-teal-400',     ring: 'bg-teal-100 dark:bg-teal-500/20'   },
  orange: { grad: 'from-orange-400 to-amber-400',  dot: 'bg-orange-500', text: 'text-orange-500 dark:text-orange-400', ring: 'bg-orange-100 dark:bg-orange-500/20'},
  blue:   { grad: 'from-blue-400 to-indigo-400',   dot: 'bg-blue-500',   text: 'text-blue-500 dark:text-blue-400',     ring: 'bg-blue-100 dark:bg-blue-500/20'   },
  green:  { grad: 'from-green-400 to-teal-400',    dot: 'bg-green-500',  text: 'text-green-500 dark:text-green-400',   ring: 'bg-green-100 dark:bg-green-500/20' },
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-teal-300 transition"

function AreaForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [progress, setProgress] = useState(initial?.progress ?? 50)
  const [color, setColor] = useState(initial?.color ?? 'purple')

  const col = COLORS[color] ?? COLORS.purple

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), progress, color })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Area name *</label>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Coding, Fitness, Reading..." className={inputCls} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Progress</label>
          <span className={`text-sm font-bold ${col.text}`}>{progress}%</span>
        </div>
        <div className="mb-2 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${col.grad} rounded-full transition-all`} style={{ width: `${progress}%` }} />
        </div>
        <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full accent-teal-500" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Color</label>
        <div className="flex gap-2">
          {Object.entries(COLORS).map(([key, c]) => (
            <button key={key} type="button" onClick={() => setColor(key)}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.grad} transition-all hover:scale-110 ${
                color === key ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-[#0f0f0f] scale-110' : ''
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${col.grad} text-white text-sm font-semibold hover:opacity-90 transition shadow-lg`}>{initial ? 'Save' : 'Add Area'}</button>
      </div>
    </form>
  )
}

function AreaItem({ area, onEdit, onDelete }) {
  const col = COLORS[area.color] ?? COLORS.purple
  return (
    <div className="flex items-center gap-3 group py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-24 flex-shrink-0 truncate">{area.name}</p>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${col.grad} rounded-full transition-all duration-700`} style={{ width: `${area.progress}%` }} />
      </div>
      <div className={`w-5 h-5 rounded-full ${col.ring} flex items-center justify-center flex-shrink-0`}>
        <div className={`w-2 h-2 rounded-full ${col.dot}`} />
      </div>
      <span className={`text-xs font-bold w-8 text-right flex-shrink-0 ${col.text}`}>{area.progress}%</span>
      <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity flex-shrink-0">
        <button onClick={onEdit} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><Pencil size={10} className="text-gray-400" /></button>
        <button onClick={onDelete} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={10} className="text-red-400" /></button>
      </div>
    </div>
  )
}

export default function GrowthCard() {
  const { growthAreas, addGrowthArea, updateGrowthArea, deleteGrowthArea } = useApp()
  const [modal, setModal] = useState(null)
  const avg = growthAreas.length ? Math.round(growthAreas.reduce((s, a) => s + a.progress, 0) / growthAreas.length) : 0

  return (
    <div className="bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-sm shadow-teal-100 dark:shadow-none border border-white dark:border-white/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-500/20 dark:to-emerald-500/20 flex items-center justify-center">
            <TrendingUp size={15} className="text-teal-500" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-800 dark:text-white">Growth Areas</h2>
            <p className="text-xs text-gray-400">{growthAreas.length} areas · {avg}% avg</p>
          </div>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-1 text-xs bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition shadow-sm shadow-teal-200 dark:shadow-teal-900/30">
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {growthAreas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">📈</p>
            <p className="text-sm font-medium text-gray-400">No areas yet</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Define what you're levelling up</p>
          </div>
        ) : growthAreas.map(a => (
          <AreaItem key={a.id} area={a} onEdit={() => setModal(a)} onDelete={() => deleteGrowthArea(a.id)} />
        ))}
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
