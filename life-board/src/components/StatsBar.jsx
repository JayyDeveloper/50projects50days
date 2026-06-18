import { Briefcase, CheckCircle2, Flame, CalendarDays } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { today, calcStreak } from '../utils/helpers'

function StatCard({ label, value, sub, icon, gradient, iconBg }) {
  return (
    <div className="bg-white dark:bg-[#13111f] rounded-2xl p-5 shadow-sm border border-white dark:border-white/5 animate-fade-up">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{sub}</p>}
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 pb-1">
      <StatCard
        label="Active Projects"
        value={activeProjects}
        sub={`${projects.filter(p => p.status === 'done').length} completed`}
        icon={<Briefcase size={18} className="text-violet-500" />}
        iconBg="bg-violet-100 dark:bg-violet-500/10"
        gradient="from-violet-600 to-purple-500"
      />
      <StatCard
        label="Habits Today"
        value={`${doneHabits}/${habits.length}`}
        sub={doneHabits === habits.length && habits.length > 0 ? 'All done!' : `${habits.length - doneHabits} remaining`}
        icon={<CheckCircle2 size={18} className="text-emerald-500" />}
        iconBg="bg-emerald-100 dark:bg-emerald-500/10"
        gradient="from-emerald-500 to-teal-400"
      />
      <StatCard
        label="Top Streak"
        value={`${topStreak}d`}
        sub={topStreak > 0 ? 'Keep it going!' : 'Start today'}
        icon={<Flame size={18} className="text-orange-500" />}
        iconBg="bg-orange-100 dark:bg-orange-500/10"
        gradient="from-orange-500 to-rose-400"
      />
      <StatCard
        label="Today's Events"
        value={todayEvents}
        sub={todayEvents === 0 ? 'Nothing scheduled' : 'on your calendar'}
        icon={<CalendarDays size={18} className="text-blue-500" />}
        iconBg="bg-blue-100 dark:bg-blue-500/10"
        gradient="from-blue-500 to-indigo-400"
      />
    </div>
  )
}
