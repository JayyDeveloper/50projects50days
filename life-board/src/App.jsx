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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <StatsBar />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
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
