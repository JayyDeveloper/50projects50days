import { useState } from 'react'
import { CalendarDays, Plus, Trash2, Clock, CheckSquare, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { today, formatDate } from '../utils/helpers'
import Modal from './Modal'

const TYPE_CONFIG = {
  task:     { icon: CheckSquare, color: 'text-blue-500',   bg: 'bg-blue-500',   pill: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',   label: 'Task' },
  event:    { icon: CalendarDays, color: 'text-violet-500', bg: 'bg-violet-500', pill: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400', label: 'Event' },
  reminder: { icon: Bell,  color: 'text-emerald-500', bg: 'bg-emerald-500', pill: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Reminder' },
}

function EventForm({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(today())
  const [time, setTime] = useState('09:00')
  const [type, setType] = useState('task')

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), date, time, type })
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-300 dark:placeholder:text-gray-600"

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Title *</label>
        <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="What's happening?" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
        <div className="flex gap-2">
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button key={key} type="button" onClick={() => setType(key)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition capitalize ${
                type === key
                  ? `border-blue-400 ${cfg.pill}`
                  : 'border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-300'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-blue-500/25">Add Event</button>
      </div>
    </form>
  )
}

function EventItem({ event, onDelete }) {
  const cfg = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.task
  const Icon = cfg.icon
  return (
    <div className="flex items-center gap-3 group px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
      <div className={`w-8 h-8 rounded-lg ${cfg.pill} flex items-center justify-center flex-shrink-0`}>
        <Icon size={14} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{event.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={10} className="text-gray-400" />
          <span className="text-xs text-gray-400">{event.time}</span>
        </div>
      </div>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0">
        <Trash2 size={11} className="text-red-400" />
      </button>
    </div>
  )
}

export default function ScheduleCard() {
  const { schedule, addEvent, deleteEvent } = useApp()
  const [view, setView] = useState('today')
  const [showModal, setShowModal] = useState(false)
  const t = today()

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const todayEvents = schedule.filter(e => e.date === t).sort((a, b) => a.time.localeCompare(b.time))
  const weekGroups = weekDays
    .map(day => ({ day, events: schedule.filter(e => e.date === day).sort((a, b) => a.time.localeCompare(b.time)) }))
    .filter(g => g.events.length > 0)

  return (
    <div className="bg-white dark:bg-[#13111f] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-fade-up">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-500" />
              Schedule
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{todayEvents.length} events today</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-0.5">
              {['today', 'week'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                    view === v
                      ? 'bg-white dark:bg-white/10 shadow-sm text-gray-800 dark:text-white'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={13} /> New
            </button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {view === 'today' ? (
            todayEvents.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl mb-1">📅</p>
                <p className="text-sm text-gray-400">Nothing today</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Your schedule is clear</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {todayEvents.map(e => <EventItem key={e.id} event={e} onDelete={() => deleteEvent(e.id)} />)}
              </div>
            )
          ) : (
            weekGroups.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl mb-1">🗓️</p>
                <p className="text-sm text-gray-400">Nothing this week</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Start planning ahead</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weekGroups.map(({ day, events }) => (
                  <div key={day}>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 px-3">{formatDate(day)}</p>
                    <div className="space-y-0.5">
                      {events.map(e => <EventItem key={e.id} event={e} onDelete={() => deleteEvent(e.id)} />)}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="Add Event" onClose={() => setShowModal(false)}>
          <EventForm onSave={(data) => { addEvent(data); setShowModal(false) }} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
