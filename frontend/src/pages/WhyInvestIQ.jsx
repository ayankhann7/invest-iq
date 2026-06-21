import { motion } from 'framer-motion'

const reasons = [
  'Comprehensive Market Analysis: InvestIQ provides comprehensive market analysis tools, including real-time data, advanced charting, and customizable indicators, to help you analyze market trends and make informed decisions.',
  'Portfolio Management: With InvestIQ, you can easily manage your investment portfolio, track performance, and diversify your holdings across various asset classes.',
  'Educational Resources: InvestIQ offers a wealth of educational resources, including tutorials, articles, and webinars, to help you enhance your investment knowledge and skills.',
  'Risk Management: InvestIQ helps you manage investment risk effectively with risk assessment tools, portfolio optimization strategies, and dynamic asset allocation.',
  'Community Engagement: Join a vibrant community of investors on InvestIQ to share insights, discuss investment strategies, and collaborate with like-minded individuals.',
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function WhyInvestIQ() {
  return (
    <div
      className="why-investiq-container page-enter"
      style={{ minHeight: '100vh' }}
    >
      <h1 style={{
        textAlign: 'center',
        fontSize: '38px',
        marginBottom: '25px',
        color: 'var(--accent)'
      }}>
        Why InvestIQ?
      </h1>
      <h6 style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 30px', fontSize: '16px' }}>
        InvestIQ is a cutting-edge investment platform designed to empower investors with powerful tools
        and insights to make informed investment decisions. Here are some reasons why you should choose InvestIQ:
      </h6>
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        style={{ listStyle: 'none', padding: '0', maxWidth: '900px', margin: '0 auto' }}
      >
        {reasons.map((r, i) => (
          <motion.li
            key={i}
            variants={item}
            className="why-investiq-list-item"
            style={{
              marginBottom: '18px',
              padding: '18px 20px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.01, y: -3 }}
          >
            {r}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
