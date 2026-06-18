import { useState } from 'react'
import { CalendarDays, Plus, Trash2, Clock, CheckSquare, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { today, formatDate } from '../utils/helpers'
import Modal from './Modal'

const TYPE_CFG = {
  task:     { icon: CheckSquare, bg: 'bg-blue-100 dark:bg-blue-500/15',    color: 'text-blue-500',    dot: 'bg-blue-400'    },
  event:    { icon: CalendarDays, bg: 'bg-violet-100 dark:bg-violet-500/15', color: 'text-violet-500', dot: 'bg-violet-400'  },
  reminder: { icon: Bell,        bg: 'bg-emerald-100 dark:bg-emerald-500/15', color: 'text-emerald-500', dot: 'bg-emerald-400' },
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"

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

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Title *</label>
        <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="What's happening?" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Type</label>
        <div className="flex gap-2">
          {Object.entries(TYPE_CFG).map(([key, cfg]) => {
            const Icon = cfg.icon
            return (
              <button key={key} type="button" onClick={() => setType(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition capitalize ${
                  type === key ? `${cfg.bg} ${cfg.color} border-transparent` : 'border-gray-100 dark:border-white/10 text-gray-400 hover:border-gray-200'
                }`}
              >
                <Icon size={12} /> {key}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/30">Add Event</button>
      </div>
    </form>
  )
}

function EventItem({ event, onDelete }) {
  const cfg = TYPE_CFG[event.type] ?? TYPE_CFG.task
  const Icon = cfg.icon
  return (
    <div className="flex items-center gap-3 group py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0">
      <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={13} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{event.title}</p>
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
    <div className="bg-white dark:bg-[#16132a] rounded-3xl shadow-sm shadow-blue-100 dark:shadow-none border border-white dark:border-white/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center">
            <CalendarDays size={15} className="text-blue-500" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-800 dark:text-white">Schedule</h2>
            <p className="text-xs text-gray-400">{todayEvents.length} events today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-0.5">
            {['today', 'week'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  view === v ? 'bg-white dark:bg-white/15 shadow-sm text-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >{v}</button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-xs bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition shadow-sm shadow-blue-200 dark:shadow-blue-900/30">
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {view === 'today' ? (
          todayEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-sm font-medium text-gray-400">Nothing today</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Your schedule is clear</p>
            </div>
          ) : todayEvents.map(e => <EventItem key={e.id} event={e} onDelete={() => deleteEvent(e.id)} />)
        ) : (
          weekGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">🗓️</p>
              <p className="text-sm font-medium text-gray-400">Nothing this week</p>
            </div>
          ) : weekGroups.map(({ day, events }) => (
            <div key={day} className="mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{formatDate(day)}</p>
              {events.map(e => <EventItem key={e.id} event={e} onDelete={() => deleteEvent(e.id)} />)}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <Modal title="Add Event" onClose={() => setShowModal(false)}>
          <EventForm onSave={(data) => { addEvent(data); setShowModal(false) }} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
