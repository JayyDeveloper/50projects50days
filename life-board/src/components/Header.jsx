import { useState } from 'react'
import { Moon, Sun, Pencil, Check, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getGreeting } from '../utils/helpers'

export default function Header() {
  const { user, theme, toggleTheme, setName } = useApp()
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(user.name)

  const save = () => {
    if (val.trim()) setName(val.trim())
    setEditing(false)
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <header className="bg-white/20 dark:bg-white/5 backdrop-blur-2xl border-b border-white/30 dark:border-white/10 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-300/40 dark:shadow-violet-900/40">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-white">Life Board</span>
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {getGreeting()},{' '}
              {editing ? (
                <input
                  autoFocus value={val}
                  onChange={e => setVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save() }}
                  className="bg-transparent border-b border-violet-400 outline-none w-24 font-semibold text-gray-700 dark:text-gray-200"
                />
              ) : (
                <span className="text-violet-600 dark:text-violet-400">{user.name}</span>
              )}
            </p>
            <button onClick={() => editing ? save() : setEditing(true)} className="text-gray-300 hover:text-violet-400 transition-colors">
              {editing ? <Check size={12} /> : <Pencil size={11} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">{date}</p>
        </div>

        <button
          onClick={toggleTheme}
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          {theme === 'light' ? <Moon size={15} className="text-gray-500" /> : <Sun size={15} className="text-amber-400" />}
        </button>
      </div>
    </header>
  )
}
