import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import HeroStats from './components/HeroStats'
import ProjectsCard from './components/ProjectsCard'
import ScheduleCard from './components/ScheduleCard'
import HabitsCard from './components/HabitsCard'
import GrowthCard from './components/GrowthCard'

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f0eeff] dark:bg-[#0c0b18] transition-colors duration-300">
        <Header />
        <main className="max-w-6xl mx-auto px-5 pb-12 pt-6">
          <HeroStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <ProjectsCard />
            <ScheduleCard />
            <HabitsCard />
            <GrowthCard />
          </div>
        </main>
      </div>
    </AppProvider>
  )
}
