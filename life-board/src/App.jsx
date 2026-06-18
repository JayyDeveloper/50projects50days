import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import HeroStats from './components/HeroStats'
import ProjectsCard from './components/ProjectsCard'
import ScheduleCard from './components/ScheduleCard'
import HabitsCard from './components/HabitsCard'
import GrowthCard from './components/GrowthCard'
import MindMapCard from './components/MindMapCard'
import MindMapEditor from './components/MindMapEditor'

function Dashboard() {
  const [openMindMapId, setOpenMindMapId] = useState(null)
  return (
    <div className="min-h-screen bg-[#f0eeff] dark:bg-black transition-colors duration-300">
      <Header />
      <main className="max-w-6xl mx-auto px-5 pb-12 pt-6">
        <HeroStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <ProjectsCard />
          <ScheduleCard />
          <HabitsCard />
          <GrowthCard />
          <div className="lg:col-span-2">
            <MindMapCard onOpenMap={setOpenMindMapId} />
          </div>
        </div>
      </main>
      {openMindMapId && (
        <MindMapEditor mapId={openMindMapId} onClose={() => setOpenMindMapId(null)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
