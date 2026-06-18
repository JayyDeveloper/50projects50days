import { useState } from 'react'
import { Brain, Plus, Trash2, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

const GRADIENT_PREVIEWS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-teal-400 to-emerald-500',
  'from-pink-500 to-rose-500',
  'from-orange-400 to-amber-500',
]

function NewMapForm({ onSave, onClose }) {
  const [name, setName] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave(name.trim())
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Map name *</label>
        <input
          autoFocus value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Business Ideas, Life Goals..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-violet-300 transition"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-violet-200 dark:shadow-violet-900/30">Create Map</button>
      </div>
    </form>
  )
}

export default function MindMapCard({ onOpenMap }) {
  const { mindMaps, addMindMap, deleteMindMap } = useApp()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-sm shadow-violet-100 dark:shadow-none border border-white dark:border-white/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-500/20 dark:to-fuchsia-500/20 flex items-center justify-center">
            <Brain size={15} className="text-violet-500" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-800 dark:text-white">Mind Nodes</h2>
            <p className="text-xs text-gray-400">{mindMaps.length} maps · brainstorm anything</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-xs bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition shadow-sm shadow-violet-200 dark:shadow-violet-900/30"
        >
          <Plus size={12} /> New Map
        </button>
      </div>

      {mindMaps.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-2">🧠</p>
          <p className="text-sm font-medium text-gray-400">No mind maps yet</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Create one to start brainstorming</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {mindMaps.map((map, i) => (
            <div key={map.id} className="relative group rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden hover:border-violet-200 dark:hover:border-violet-500/30 transition-all">
              {/* gradient preview strip */}
              <div className={`h-2 bg-gradient-to-r ${GRADIENT_PREVIEWS[i % GRADIENT_PREVIEWS.length]}`} />
              <div className="p-4">
                <p className="font-bold text-sm text-gray-800 dark:text-white truncate mb-0.5">{map.name}</p>
                <p className="text-xs text-gray-400">{map.nodes.length} nodes</p>
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => onOpenMap(map.id)}
                    className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
                  >
                    Open <ChevronRight size={12} />
                  </button>
                  <button
                    onClick={() => deleteMindMap(map.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={11} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="New Mind Map" onClose={() => setShowModal(false)}>
          <NewMapForm
            onSave={(name) => { addMindMap(name); setShowModal(false) }}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}
