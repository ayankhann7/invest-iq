import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AIPredictor from './pages/AIPredictor'
import Top50Stocks from './pages/Top50Stocks'
import WhyInvestIQ from './pages/WhyInvestIQ'
import About from './pages/About'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AI-Predictor" element={<AIPredictor theme={theme} />} />
        <Route path="/top-50-stocks" element={<Top50Stocks />} />
        <Route path="/why-investiq" element={<WhyInvestIQ />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}