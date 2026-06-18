import { useState } from 'react'
import { Briefcase, Plus, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

const STATUS = {
  active:  { label: 'Active',  pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400', bar: 'from-emerald-400 to-teal-500',   border: 'border-l-emerald-400' },
  paused:  { label: 'Paused',  pill: 'bg-amber-100  text-amber-700  dark:bg-amber-500/15  dark:text-amber-400',  bar: 'from-amber-400  to-orange-400',  border: 'border-l-amber-400'  },
  done:    { label: 'Done',    pill: 'bg-gray-100   text-gray-500   dark:bg-white/5      dark:text-gray-500',   bar: 'from-gray-300  to-gray-400',    border: 'border-l-gray-300'   },
}

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

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-violet-400 transition placeholder:text-gray-300 dark:placeholder:text-gray-600"

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Title *</label>
        <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Project name" className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Progress: {progress}%</label>
          <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full accent-violet-500 mt-2.5" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-violet-500/25">{initial ? 'Save Changes' : 'Add Project'}</button>
      </div>
    </form>
  )
}

function ProjectItem({ project, onEdit, onDelete }) {
  const s = STATUS[project.status] ?? STATUS.active
  return (
    <div className={`border-l-[3px] ${s.border} bg-white dark:bg-white/3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-r-xl pl-3 pr-3 py-3 transition-all group`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate text-gray-800 dark:text-gray-100">{project.title}</p>
          {project.description && <p className="text-xs text-gray-400 truncate mt-0.5">{project.description}</p>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <Pencil size={11} className="text-gray-400" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2.5 mt-2.5">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${s.pill}`}>{s.label}</span>
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${s.bar} rounded-full transition-all duration-500`} style={{ width: `${project.progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-400 w-7 text-right flex-shrink-0">{project.progress}%</span>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsCard() {
  const { projects, addProject, updateProject, deleteProject } = useApp()
  const [modal, setModal] = useState(null)

  const active = projects.filter(p => p.status === 'active').length

  return (
    <div className="bg-white dark:bg-[#13111f] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-fade-up">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase size={16} className="text-violet-500" />
              Projects
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{active} active · {projects.filter(p => p.status === 'done').length} done</p>
          </div>
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13} /> New
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl mb-1">🚀</p>
              <p className="text-sm text-gray-400">No projects yet</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Add one to start tracking</p>
            </div>
          ) : (
            projects.map(p => (
              <ProjectItem key={p.id} project={p} onEdit={() => setModal(p)} onDelete={() => deleteProject(p.id)} />
            ))
          )}
        </div>
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
