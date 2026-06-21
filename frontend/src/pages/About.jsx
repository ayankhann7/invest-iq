import { motion } from 'framer-motion'
import ContactForm from '../components/ContactForm'

const cards = [
  {
    title: null,
    body: `InvestIQ is a modern financial analytics platform designed to help users understand, analyze,
    and explore stock market data with clarity and confidence. The platform focuses on transforming complex
    market information into meaningful, easy-to-understand insights through intelligent visualization and
    data-driven analysis.`
  },
  {
    title: 'What We Do',
    body: `InvestIQ provides tools for stock trend analysis, historical price visualization, technical
    indicators, and AI-based forecasting. By integrating real-time market data with machine learning models,
    the platform enables users to explore patterns, evaluate market behavior, and make informed analytical decisions.`
  },
  {
    title: 'Our Approach',
    body: `Our approach is centered around simplicity, accuracy, and performance. Each feature is designed
    with a user-first mindset, ensuring that insights are accessible without unnecessary complexity.`
  },
  {
    title: 'Our Mission',
    body: `Our mission is to make stock market analysis more accessible through intelligent technology and thoughtful design.`
  }
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function About() {
  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '20px' }}>
      <div className="about-bg-container">
        <h1 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 700, marginBottom: '28px', color: 'var(--accent)' }}>
          About Us
        </h1>

        <motion.div variants={container} initial="hidden" animate="show">
          {cards.map((card, i) => (
            <motion.div key={i} variants={item} className="about-card">
              {card.title && <h2>{card.title}</h2>}
              <p>{card.body}</p>
            </motion.div>
          ))}

          {/* Contact card */}
          <motion.div variants={item} className="about-card">
            <h2>Get in Touch</h2>
            <p style={{ marginBottom: '16px' }}>Have questions, feedback, or ideas? We&apos;d love to hear from you.</p>
            <ContactForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
