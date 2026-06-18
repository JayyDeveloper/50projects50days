import { Briefcase, Flame } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { today, calcStreak } from '../utils/helpers'

function HeroCard({ title, big, sub, label, icon, grad, deco1, deco2 }) {
  return (
    <div className={`relative rounded-3xl p-6 text-white overflow-hidden bg-gradient-to-br ${grad} shadow-xl`}>
      {/* decorative blobs */}
      <div className={`absolute -right-5 -top-5 w-32 h-32 rounded-full ${deco1} opacity-40`} />
      <div className={`absolute right-8 bottom-4 w-16 h-16 rounded-full ${deco2} opacity-30`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              {icon}
            </div>
            <p className="font-semibold text-sm text-white/90">{title}</p>
          </div>
        </div>

        <p className="text-6xl font-black tracking-tighter leading-none">{big}</p>
        <p className="text-white/60 text-xs mt-2 font-medium">{sub}</p>

        <div className="mt-5 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/60 rounded-full" style={{ width: label }} />
        </div>
        <p className="text-white/50 text-xs mt-1.5">{label} progress</p>
      </div>
    </div>
  )
}

export default function HeroStats() {
  const { projects, habits } = useApp()
  const t = today()

  const activeProjects = projects.filter(p => p.status === 'active')
  const avgProjectProgress = activeProjects.length
    ? Math.round(activeProjects.reduce((s, p) => s + p.progress, 0) / activeProjects.length)
    : 0

  const totalHabits = habits.length
  const doneHabits = habits.filter(h => h.completedDates.includes(t)).length
  const habitPct = totalHabits ? Math.round((doneHabits / totalHabits) * 100) : 0

  const topStreak = habits.reduce((max, h) => Math.max(max, calcStreak(h.completedDates)), 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <HeroCard
        title="Projects"
        big={`${avgProjectProgress}%`}
        sub={`${activeProjects.length} active · ${projects.filter(p => p.status === 'done').length} completed`}
        label={`${avgProjectProgress}%`}
        icon={<Briefcase size={14} className="text-white" />}
        grad="from-[#f093fb] via-[#f5576c] to-[#f7971e]"
        deco1="bg-white"
        deco2="bg-pink-300"
      />
      <HeroCard
        title="Habits"
        big={`${habitPct}%`}
        sub={`${doneHabits}/${totalHabits} done today · 🔥 ${topStreak} day streak`}
        label={`${habitPct}%`}
        icon={<Flame size={14} className="text-white" />}
        grad="from-[#43cea2] via-[#4facfe] to-[#a18cd1]"
        deco1="bg-teal-200"
        deco2="bg-indigo-300"
      />
    </div>
  )
}
