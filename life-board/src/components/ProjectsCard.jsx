import { useState } from 'react'
import { Briefcase, Plus, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

const STATUS = {
  active: { label: 'Active', dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400', grad: 'from-emerald-400 to-teal-400' },
  paused: { label: 'Paused', dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',     grad: 'from-amber-400 to-orange-300' },
  done:   { label: 'Done',   dot: 'bg-gray-300',    pill: 'bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500',            grad: 'from-gray-300 to-gray-200'   },
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-violet-300 transition placeholder:text-gray-300 dark:placeholder:text-gray-600"

function ProjectForm({ initial, onSave, onClose }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'active')
  const [progress, setProgress] = useState(initial?.progress ?? 0)

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim(), status, progress })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Title *</label>
        <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Project name" className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Progress: {progress}%</label>
          <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full accent-violet-500 mt-2.5" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-violet-200 dark:shadow-violet-900/30">{initial ? 'Save' : 'Add Project'}</button>
      </div>
    </form>
  )
}

function ProjectItem({ project, onEdit, onDelete }) {
  const s = STATUS[project.status] ?? STATUS.active
  return (
    <div className="flex items-center gap-3 group py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{project.title}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${s.pill}`}>{s.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${s.grad} rounded-full transition-all duration-500`} style={{ width: `${project.progress}%` }} />
          </div>
          <span className="text-xs text-gray-400 w-7 text-right">{project.progress}%</span>
        </div>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><Pencil size={11} className="text-gray-400" /></button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={11} className="text-red-400" /></button>
      </div>
    </div>
  )
}

export default function ProjectsCard() {
  const { projects, addProject, updateProject, deleteProject } = useApp()
  const [modal, setModal] = useState(null)

  return (
    <div className="bg-white dark:bg-[#16132a] rounded-3xl shadow-sm shadow-violet-100 dark:shadow-none border border-white dark:border-white/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-500/20 dark:to-fuchsia-500/20 flex items-center justify-center">
            <Briefcase size={15} className="text-violet-500" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-800 dark:text-white">Projects</h2>
            <p className="text-xs text-gray-400">{projects.filter(p => p.status === 'active').length} active</p>
          </div>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-1 text-xs bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition shadow-sm shadow-violet-200 dark:shadow-violet-900/30">
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">🚀</p>
            <p className="text-sm font-medium text-gray-400">No projects yet</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Add one to start tracking progress</p>
          </div>
        ) : projects.map(p => (
          <ProjectItem key={p.id} project={p} onEdit={() => setModal(p)} onDelete={() => deleteProject(p.id)} />
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'New Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <ProjectForm
            initial={modal === 'add' ? null : modal}
            onSave={(data) => { modal === 'add' ? addProject(data) : updateProject(modal.id, data); setModal(null) }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
