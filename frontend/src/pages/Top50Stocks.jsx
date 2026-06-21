import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState } from 'react'

const stocks = [
  ['AAPL', ' - Apple Inc'],
  ['MSFT', ' - Microsoft Corporation'],
  ['GOOGL', ' - Alphabet Inc (Google)'],
  ['AMZN', ' - Amazon.com Inc'],
  ['NVDA', ' - NVIDIA Corporation'],
  ['META', ' - Meta Platforms Inc'],
  ['TSLA', ' - Tesla Inc'],
  ['BRK-B', ' - Berkshire Hathaway Inc'],
  ['JPM', ' - JPMorgan Chase & Co'],
  ['V', ' - Visa Inc'],
  ['MA', ' - Mastercard Inc'],
  ['UNH', ' - UnitedHealth Group Inc'],
  ['XOM', ' - Exxon Mobil Corporation'],
  ['PG', ' - Procter & Gamble Co'],
  ['JNJ', ' - Johnson & Johnson'],
  ['HD', ' - Home Depot Inc'],
  ['LLY', ' - Eli Lilly and Company'],
  ['AVGO', ' - Broadcom Inc'],
  ['COST', ' - Costco Wholesale Corporation'],
  ['PEP', ' - PepsiCo Inc'],
  ['KO', ' - Coca-Cola Company'],
  ['MRK', ' - Merck & Co Inc'],
  ['ABBV', ' - AbbVie Inc'],
  ['NFLX', ' - Netflix Inc'],
  ['ORCL', ' - Oracle Corporation'],
  ['CRM', ' - Salesforce Inc'],
  ['INTC', ' - Intel Corporation'],
  ['AMD', ' - Advanced Micro Devices Inc'],
  ['IBM', ' - International Business Machines Corp'],
  ['QCOM', ' - Qualcomm Inc'],
  ['CSCO', ' - Cisco Systems Inc'],
  ['ADBE', ' - Adobe Inc'],
  ['TXN', ' - Texas Instruments Inc'],
  ['AMAT', ' - Applied Materials Inc'],
  ['GS', ' - Goldman Sachs Group Inc'],
  ['MS', ' - Morgan Stanley'],
  ['AXP', ' - American Express Company'],
  ['WMT', ' - Walmart Inc'],
  ['MCD', " - McDonald's Corporation"],
  ['NKE', ' - Nike Inc'],
  ['DIS', ' - Walt Disney Company'],
  ['BA', ' - Boeing Company'],
  ['GE', ' - General Electric Company'],
  ['T', ' - AT&T Inc'],
  ['VZ', ' - Verizon Communications Inc'],
  ['UBER', ' - Uber Technologies Inc'],
  ['PYPL', ' - PayPal Holdings Inc'],
  ['SNOW', ' - Snowflake Inc'],
  ['BAC', ' - Bank of America Corporation'],
  ['SHOP', ' - Shopify Inc'],
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } }
const item = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } }

export default function Top50Stocks() {
  const [query, setQuery] = useState('')
  const filtered = stocks.filter(([code, name]) =>
    (code + name).toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page-enter" style={{
      backgroundColor: 'var(--bg)',
      minHeight: '100vh',
      padding: '30px 40px 60px'
    }}>
  <h1 style={{ fontSize: '38px', textAlign: 'left', color: 'var(--accent)' }}>
        Top 50 Stocks
      </h1>
   <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '30px',
        background: 'var(--bg-soft)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '8px 14px',
        maxWidth: '400px'
      }}>
        <Search size={16} color="var(--accent)" />
        <input
          type="text"
          placeholder="Search by ticker or name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: '14px',
            width: '100%'
          }}
        />
      </div>
   <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        style={{ padding: 0, maxWidth: '100%', margin: '0' }}
      >
      {filtered.map(([code, name]) => (
         <motion.li
            key={code}
            variants={item}
            className="stock-list-item"
            whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
            whileTap={{ y: -10, scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
          >
            <b>{code}</b>
            <span>{name}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
