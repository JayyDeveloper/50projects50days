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
    <div className="min-h-screen relative">
      {/* Fixed gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#e8d5ff] via-[#d8e8ff] to-[#fce4ff] dark:from-[#07050f] dark:via-[#0d0a1f] dark:to-[#050510]" />
      {/* Orbs */}
      <div className="fixed -z-10 -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-violet-500/20 dark:bg-violet-600/25 blur-[140px] pointer-events-none" />
      <div className="fixed -z-10 -bottom-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full bg-fuchsia-500/15 dark:bg-fuchsia-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed -z-10 top-1/2 right-1/4 w-[35vw] h-[35vw] rounded-full bg-cyan-400/10 dark:bg-cyan-500/15 blur-[100px] pointer-events-none" />
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
