import { NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar({ theme, onToggleTheme }) {
const links = [
    { to: '/', label: 'Home' },
    { to: '/AI-Predictor', label: 'AI Predictor' },
    { to: '/top-50-stocks', label: 'Top 50 Stocks' },
    { to: '/why-investiq', label: 'Why InvestIQ?' },
    { to: '/about', label: 'About' },
  ]

  return (
    <nav className="navbar px-4 flex items-center justify-between" style={{ minHeight: '64px' }}>
      {/* Left: Logo text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <img src="/assets/name.png" alt="InvestIQ" style={{ height: '40px' }} />
      </div>

      {/* Center/Right: Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}

   <motion.button
          className="theme-toggle-btn"
          style={{ marginLeft: '12px' }}
          onClick={onToggleTheme}
          whileTap={{ scale: 0.95 }}
        >
          {theme === 'dark'
            ? <><Moon size={14} /> Dark</>
            : <><Sun size={14} /> Light</>
          }
        </motion.button>
        <img src="/assets/line.gif" alt="line" style={{ height: '40px', marginLeft: '12px' }} />
      </div>
    </nav>
  )
}
