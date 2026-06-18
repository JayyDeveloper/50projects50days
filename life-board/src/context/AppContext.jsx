import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { uid, today } from '../utils/helpers'

const AppContext = createContext(null)

const STORAGE_KEY = 'life-board-v1'

const t = today()

const defaultData = {
  user: { name: 'You' },
  theme: 'light',
  projects: [
    { id: 'p1', title: 'Portfolio Website', description: 'Rebuild personal site from scratch', status: 'active', progress: 65 },
    { id: 'p2', title: 'Learn TypeScript', description: 'Master TS fundamentals and advanced types', status: 'active', progress: 40 },
    { id: 'p3', title: 'Side Hustle App', description: 'MVP for the SaaS idea', status: 'paused', progress: 20 },
  ],
  habits: [
    { id: 'h1', title: 'Exercise', completedDates: [t] },
    { id: 'h2', title: 'Read 30 minutes', completedDates: [] },
    { id: 'h3', title: 'Meditate', completedDates: [t] },
    { id: 'h4', title: 'Cold shower', completedDates: [] },
  ],
  schedule: [
    { id: 's1', title: 'Deep Work Session', date: t, time: '09:00', type: 'task' },
    { id: 's2', title: 'Code Review', date: t, time: '14:00', type: 'event' },
    { id: 's3', title: 'Evening Workout', date: t, time: '18:30', type: 'reminder' },
  ],
  growthAreas: [
    { id: 'g1', name: 'Coding', progress: 75, color: 'purple' },
    { id: 'g2', name: 'Fitness', progress: 60, color: 'pink' },
    { id: 'g3', name: 'Reading', progress: 45, color: 'teal' },
    { id: 'g4', name: 'Discipline', progress: 55, color: 'orange' },
    { id: 'g5', name: 'Mindfulness', progress: 35, color: 'blue' },
  ],
  mindMaps: [
    {
      id: 'mm1',
      name: 'Life Vision',
      nodes: [
        { id: 'root', text: 'Life Vision', x: 1880, y: 1460, parentId: null, colorIdx: 0 },
        { id: 'n1',   text: 'Career',      x: 2120, y: 1300, parentId: 'root', colorIdx: 1 },
        { id: 'n2',   text: 'Health',      x: 2120, y: 1460, parentId: 'root', colorIdx: 2 },
        { id: 'n3',   text: 'Learning',    x: 2120, y: 1620, parentId: 'root', colorIdx: 3 },
        { id: 'n4',   text: 'Finances',    x: 1640, y: 1380, parentId: 'root', colorIdx: 4 },
        { id: 'n5',   text: 'Side hustle', x: 2360, y: 1260, parentId: 'n1',  colorIdx: 1 },
        { id: 'n6',   text: 'Gym 4x/week', x: 2360, y: 1420, parentId: 'n2',  colorIdx: 2 },
      ],
      createdAt: new Date().toISOString(),
    }
  ],
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    return { ...defaultData, ...JSON.parse(raw) }
  } catch {
    return defaultData
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    if (data.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [data])

  const set = useCallback((patch) => setData(d => ({ ...d, ...patch })), [])

  const toggleTheme = () => set({ theme: data.theme === 'light' ? 'dark' : 'light' })
  const setName = (name) => set({ user: { ...data.user, name } })

  const addProject = (p) => set({ projects: [...data.projects, { ...p, id: uid() }] })
  const updateProject = (id, patch) => set({ projects: data.projects.map(p => p.id === id ? { ...p, ...patch } : p) })
  const deleteProject = (id) => set({ projects: data.projects.filter(p => p.id !== id) })

  const addHabit = (h) => set({ habits: [...data.habits, { ...h, id: uid(), completedDates: [] }] })
  const deleteHabit = (id) => set({ habits: data.habits.filter(h => h.id !== id) })
  const toggleHabitToday = (id) => {
    const t = today()
    set({
      habits: data.habits.map(h => {
        if (h.id !== id) return h
        const done = h.completedDates.includes(t)
        return { ...h, completedDates: done ? h.completedDates.filter(d => d !== t) : [...h.completedDates, t] }
      })
    })
  }

  const addEvent = (e) => set({ schedule: [...data.schedule, { ...e, id: uid() }] })
  const deleteEvent = (id) => set({ schedule: data.schedule.filter(e => e.id !== id) })

  const addGrowthArea = (a) => set({ growthAreas: [...data.growthAreas, { ...a, id: uid() }] })
  const updateGrowthArea = (id, patch) => set({ growthAreas: data.growthAreas.map(a => a.id === id ? { ...a, ...patch } : a) })
  const deleteGrowthArea = (id) => set({ growthAreas: data.growthAreas.filter(a => a.id !== id) })

  const addMindMap = (name) => set({
    mindMaps: [...data.mindMaps, {
      id: uid(), name, nodes: [{ id: uid(), text: name, x: 1880, y: 1460, parentId: null, colorIdx: 0 }],
      createdAt: new Date().toISOString()
    }]
  })
  const deleteMindMap = (id) => set({ mindMaps: data.mindMaps.filter(m => m.id !== id) })
  const updateMindMap = (id, nodes, name) => set({
    mindMaps: data.mindMaps.map(m => m.id === id ? { ...m, nodes, name } : m)
  })

  return (
    <AppContext.Provider value={{
      ...data,
      toggleTheme, setName,
      addProject, updateProject, deleteProject,
      addHabit, deleteHabit, toggleHabitToday,
      addEvent, deleteEvent,
      addGrowthArea, updateGrowthArea, deleteGrowthArea,
      addMindMap, deleteMindMap, updateMindMap,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
