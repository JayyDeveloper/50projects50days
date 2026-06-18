export function today() {
  return new Date().toISOString().split('T')[0]
}

export function calcStreak(completedDates) {
  if (!completedDates || !completedDates.length) return 0
  const set = new Set(completedDates)
  let streak = 0
  const d = new Date()
  while (true) {
    const key = d.toISOString().split('T')[0]
    if (set.has(key)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatDate(dateStr) {
  const t = today()
  const tmrw = new Date()
  tmrw.setDate(tmrw.getDate() + 1)
  const tmrwStr = tmrw.toISOString().split('T')[0]
  if (dateStr === t) return 'Today'
  if (dateStr === tmrwStr) return 'Tomorrow'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}
