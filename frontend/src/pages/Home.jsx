import { motion } from 'framer-motion'

const features = [
  {
    icon: <img src="/assets/cmd.png" alt="Market Analysis" style={{ width: '80%', height: '75%', objectFit: 'cover' }} />,
    title: 'Comprehensive Market Analysis',
    desc: 'InvestIQ provides comprehensive market analysis tools, including real-time data, advanced charting, and customizable indicators, to help you analyze market trends and make informed decisions.'
  },
  {
   icon: <img src="/assets/port.jpg" alt="Portfolio Management" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />,
    title: 'Portfolio Management',
    desc: 'With InvestIQ, you can easily manage your investment portfolio, track performance, and diversify your holdings across various asset classes.'
  },
  {
   icon: <img src="/assets/education.jpg" alt="Educational Resources" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />,
    title: 'Educational Resources',
    desc: 'InvestIQ offers a wealth of educational resources, including tutorials, articles, and webinars, to help you enhance your investment knowledge and skills.'
  },
  {
   icon: <img src="/assets/risk.jpg" alt="Risk Management" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />,
    title: 'Risk Management',
    desc: 'InvestIQ helps you manage investment risk effectively with risk assessment tools, portfolio optimization strategies, and dynamic asset allocation.'
  },
  {
   icon: <img src="/assets/eng.jpg" alt="Community Engagement" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />,
    title: 'Community Engagement',
    desc: 'Join a vibrant community of investors on InvestIQ to share insights, discuss investment strategies, and collaborate with like-minded individuals.'
  }
]

const steps = [
  "Navigate to the 'Top 50 Stocks' page to view a list of the top 50 stocks in the market.",
  "Select any stock name to view detailed information and analysis for that stock.",
  "Visit the 'AI Predictor' page to predict future stock prices using advanced machine learning algorithms.",
  "Explore the 'Why InvestIQ?' page to learn about the features and benefits of using InvestIQ for your investment needs.",
  "Get to know more about us on the 'About Us' page, where you can learn about our team and mission."
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function Home() {
  return (
    <div className="home-container page-enter" style={{ padding: '0 0 60px' }}>
      <h1 style={{ fontSize: '50px', textAlign: 'center', marginTop: '30px', marginBottom: '0' }}>
        Welcome to InvestIQ
      </h1>

      <div className="home-features" style={{ padding: '0 20px' }}>
        <h2 style={{ color: '#0eabd6', fontSize: '35px', textAlign: 'center', marginTop: '50px' }}>
          Features
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '30px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="feature-box"
              style={{ width: '220px', padding: '20px', textAlign: 'center' }}
            >
       <div style={{
               width: '140px',
height: '140px',
borderRadius: '50%',
                border: '2px solid #6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                color: 'var(--accent)',
                overflow: 'hidden'
              }}>
                {f.icon}
              </div>
              <h5 style={{ marginTop: '15px', fontSize: '18px', color: 'var(--accent)' }}>{f.title}</h5>
              <p style={{ fontSize: '16px' }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="how-to-use-container" style={{ padding: '0 40px' }}>
        <h2 style={{ color: '#5eff00', fontSize: '28px', textAlign: 'center', marginTop: '50px' }}>
          How to Use InvestIQ
        </h2>
        <div style={{ fontSize: '18px', marginTop: '20px' }}>
          {steps.map((s, i) => (
            <p key={i} style={{ marginBottom: '15px' }}>{i + 1}. {s}</p>
          ))}
        </div>
      </div>
    </div>
  )
}