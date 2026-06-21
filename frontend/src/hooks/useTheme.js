import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('investiq-theme') || 'dark'
  })

  useEffect(() => {
    const root = document.getElementById('root')
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    localStorage.setItem('investiq-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return { theme, toggleTheme }
}
