import { useState } from 'react'
import { Moon, Sun, Pencil, Check } from 'lucide-react'
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm select-none">L</span>
          </div>
          <span className="font-semibold text-base tracking-tight">Life Board</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold">
              {getGreeting()},{' '}
              {editing ? (
                <input
                  autoFocus
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save() }}
                  className="bg-transparent border-b border-purple-400 outline-none w-24 text-sm font-semibold"
                />
              ) : (
                <span>{user.name}</span>
              )}
              !
            </p>
            <button
              onClick={() => editing ? save() : setEditing(true)}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              {editing ? <Check size={13} /> : <Pencil size={13} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">{date}</p>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light'
            ? <Moon size={18} className="text-gray-500" />
            : <Sun size={18} className="text-amber-400" />
          }
        </button>
      </div>
    </header>
  )
}
