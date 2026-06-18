import { Briefcase, CheckCircle2, Flame, CalendarDays } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { today, calcStreak } from '../utils/helpers'

function StatCard({ label, value, icon, from, to }) {
  return (
    <div className={`bg-gradient-to-br ${from} ${to} rounded-2xl p-4 text-white shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/75 text-xs font-medium">{label}</span>
        <span className="text-white/75">{icon}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

export default function StatsBar() {
  const { projects, habits, schedule } = useApp()
  const t = today()

  const activeProjects = projects.filter(p => p.status === 'active').length
  const doneHabits = habits.filter(h => h.completedDates.includes(t)).length
  const topStreak = habits.reduce((max, h) => Math.max(max, calcStreak(h.completedDates)), 0)
  const todayEvents = schedule.filter(e => e.date === t).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 pb-1">
      <StatCard label="Active Projects" value={activeProjects} icon={<Briefcase size={16} />} from="from-violet-500" to="to-purple-600" />
      <StatCard label="Habits Today" value={`${doneHabits}/${habits.length}`} icon={<CheckCircle2 size={16} />} from="from-emerald-400" to="to-teal-500" />
      <StatCard label="Top Streak" value={`${topStreak}d`} icon={<Flame size={16} />} from="from-orange-400" to="to-rose-500" />
      <StatCard label="Today's Events" value={todayEvents} icon={<CalendarDays size={16} />} from="from-blue-400" to="to-indigo-500" />
    </div>
  )
}
