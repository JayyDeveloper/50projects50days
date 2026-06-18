import { useState } from 'react'
import { Briefcase, Plus, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'

const STATUS_STYLES = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  done: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
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

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title *</label>
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Short description"
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Progress: {progress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            className="w-full accent-purple-500 mt-2"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          {initial ? 'Save' : 'Add Project'}
        </button>
      </div>
    </form>
  )
}

function ProjectItem({ project, onEdit, onDelete }) {
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-3 hover:border-gray-200 dark:hover:border-gray-600 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{project.title}</p>
          {project.description && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Pencil size={12} className="text-gray-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2.5">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLES[project.status]}`}>
          {project.status}
        </span>
        <div className="flex-1 flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-7 text-right flex-shrink-0">{project.progress}%</span>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsCard() {
  const { projects, addProject, updateProject, deleteProject } = useApp()
  const [modal, setModal] = useState(null) // null | 'add' | project object

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2 text-base">
          <Briefcase size={17} className="text-purple-500" />
          Projects
        </h2>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-600 font-medium bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No projects yet — add one to get started!</p>
        ) : (
          projects.map(p => (
            <ProjectItem
              key={p.id}
              project={p}
              onEdit={() => setModal(p)}
              onDelete={() => deleteProject(p.id)}
            />
          ))
        )}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'New Project' : 'Edit Project'}
          onClose={() => setModal(null)}
        >
          <ProjectForm
            initial={modal === 'add' ? null : modal}
            onSave={(data) => {
              if (modal === 'add') addProject(data)
              else updateProject(modal.id, data)
              setModal(null)
            }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
