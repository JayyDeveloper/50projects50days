import { useState } from 'react'
import { CalendarDays, Plus, Trash2, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { today, formatDate } from '../utils/helpers'
import Modal from './Modal'

const TYPE_STYLES = {
  task: { dot: 'bg-blue-500', pill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  event: { dot: 'bg-violet-500', pill: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400' },
  reminder: { dot: 'bg-emerald-500', pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
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

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title *</label>
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What's happening?"
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Time</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
        <div className="flex gap-2">
          {['task', 'event', 'reminder'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition capitalize ${
                type === t
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          Cancel
        </button>
        <button type="submit" className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm font-medium hover:opacity-90 transition">
          Add Event
        </button>
      </div>
    </form>
  )
}

function EventItem({ event, onDelete }) {
  const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.task
  return (
    <div className="flex items-center gap-3 group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-2 py-2 transition-colors">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{event.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={10} className="text-gray-400" />
          <span className="text-xs text-gray-400">{event.time}</span>
        </div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${style.pill}`}>
        {event.type}
      </span>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
      >
        <Trash2 size={12} className="text-red-400" />
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
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const todayEvents = schedule
    .filter(e => e.date === t)
    .sort((a, b) => a.time.localeCompare(b.time))

  const weekGroups = weekDays
    .map(day => ({
      day,
      events: schedule.filter(e => e.date === day).sort((a, b) => a.time.localeCompare(b.time)),
    }))
    .filter(g => g.events.length > 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2 text-base">
          <CalendarDays size={17} className="text-blue-500" />
          Schedule
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            {['today', 'week'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                  view === v
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-gray-100'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto pr-0.5">
        {view === 'today' ? (
          todayEvents.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Nothing scheduled for today. Add something!</p>
          ) : (
            <div className="space-y-0.5">
              {todayEvents.map(e => (
                <EventItem key={e.id} event={e} onDelete={() => deleteEvent(e.id)} />
              ))}
            </div>
          )
        ) : (
          weekGroups.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No events this week. Start scheduling!</p>
          ) : (
            <div className="space-y-3">
              {weekGroups.map(({ day, events }) => (
                <div key={day}>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 px-2">{formatDate(day)}</p>
                  <div className="space-y-0.5">
                    {events.map(e => (
                      <EventItem key={e.id} event={e} onDelete={() => deleteEvent(e.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {showModal && (
        <Modal title="Add Event" onClose={() => setShowModal(false)}>
          <EventForm
            onSave={(data) => { addEvent(data); setShowModal(false) }}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}
