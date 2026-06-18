import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import ProjectsCard from './components/ProjectsCard'
import ScheduleCard from './components/ScheduleCard'
import HabitsCard from './components/HabitsCard'
import GrowthCard from './components/GrowthCard'

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f4f3ff] dark:bg-[#09090f] transition-colors duration-300">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <StatsBar />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
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
