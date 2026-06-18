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
    <header className="bg-gradient-to-r from-[#13102b] via-[#1e1550] to-[#13102b] dark:from-[#0a0812] dark:via-[#110d3a] dark:to-[#0a0812] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
            Life Board
          </span>
        </div>

        {/* Greeting */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-white font-semibold text-sm sm:text-base">
              {getGreeting()},{' '}
              {editing ? (
                <input
                  autoFocus
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save() }}
                  className="bg-transparent border-b border-violet-400 outline-none w-24 font-semibold text-white"
                />
              ) : (
                <span className="text-violet-300">{user.name}</span>
              )}
            </p>
            <button
              onClick={() => editing ? save() : setEditing(true)}
              className="text-white/30 hover:text-violet-300 transition-colors"
            >
              {editing ? <Check size={13} /> : <Pencil size={12} />}
            </button>
          </div>
          <p className="text-white/30 text-xs hidden sm:block mt-0.5">{date}</p>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex-shrink-0 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light'
            ? <Moon size={16} className="text-white/60" />
            : <Sun size={16} className="text-amber-300" />
          }
        </button>
      </div>
    </header>
  )
}
