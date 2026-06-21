import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import StockChart from '../components/StockChart'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { fetchTickerInfo, fetchStockPrice, fetchStockIndicators, fetchForecast } from '../services/stockService'
import { AlertCircle } from 'lucide-react'

export default function AIPredictor({ theme }) {
  const [ticker, setTicker] = useState('')
  const [startDate, setStartDate] = useState(null)
const [endDate, setEndDate] = useState(null)
  const [nDays, setNDays] = useState('')

  const [stockName, setStockName] = useState('')
  const [description, setDescription] = useState('')

  const [stockFig, setStockFig] = useState(null)
  const [indicatorFig, setIndicatorFig] = useState(null)
  const [forecastFig, setForecastFig] = useState(null)

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingStock, setLoadingStock] = useState(false)
  const [loadingIndicator, setLoadingIndicator] = useState(false)
 const [loadingForecast, setLoadingForecast] = useState(false)

 const [forecastError, setForecastError] = useState('')
  const [tickerError, setTickerError] = useState('')
  const [lastTicker, setLastTicker] = useState('')
  const prevThemeRef = useRef(theme)

const fmt = (d) => d ? d.toISOString().split('T')[0] : null

 // Re-fetch all active charts when theme changes
  useEffect(() => {
    if (prevThemeRef.current === theme) return
    prevThemeRef.current = theme

    const refetch = async () => {
      const fmt = (d) => d ? d.toISOString().split('T')[0] : null

      if (stockFig && ticker && startDate) {
        try {
          const data = await fetchStockPrice(ticker.toUpperCase(), fmt(startDate), fmt(endDate), theme)
          setStockFig(data.figure)
        } catch {
          //s
        }
      }

      if (indicatorFig && ticker && startDate) {
        try {
          const data = await fetchStockIndicators(ticker.toUpperCase(), fmt(startDate), fmt(endDate), theme)
          setIndicatorFig(data.figure)
        } catch {
          //ss
        }
      }

      if (forecastFig && ticker && nDays) {
        try {
          const data = await fetchForecast(ticker.toUpperCase(), parseInt(nDays), theme)
          setForecastFig(data.figure)
        } catch {
          //ss
        }
      }
    }

    refetch()
  }, [theme])

const handleSubmit = useCallback(async () => {
    if (!ticker.trim()) { setTickerError('Enter Stock Name'); return }
    setTickerError('')
    const t = ticker.trim().toUpperCase()
    if (t !== lastTicker) {
      setStockFig(null)
      setIndicatorFig(null)
      setForecastFig(null)
    }
    setLastTicker(t)
    setLoadingSubmit(true)
    setForecastError('')
    try {
      const info = await fetchTickerInfo(t)
      setStockName(info.name)
      setDescription(info.description)
    } catch {
      setStockName(t)
      setDescription('No description available.')
    } finally {
      setLoadingSubmit(false)
    }
  }, [ticker, lastTicker, theme])

const handleStock = useCallback(async () => {
    if (!ticker.trim()) { setTickerError('Enter Stock Name'); return }
    setTickerError('')
    if (!startDate) return
    setLoadingStock(true)
    try {
      const data = await fetchStockPrice(ticker.toUpperCase(), fmt(startDate), fmt(endDate), theme)
      setStockFig(data.figure)
    } catch {
      setStockFig(null)
    } finally {
      setLoadingStock(false)
    }
  }, [ticker, startDate, endDate, theme])

const handleIndicators = useCallback(async () => {
    if (!ticker.trim()) { setTickerError('Enter Stock Name'); return }
    setTickerError('')
    if (!startDate) return
    setLoadingIndicator(true)
    try {
      const data = await fetchStockIndicators(ticker.toUpperCase(), fmt(startDate), fmt(endDate), theme)
      setIndicatorFig(data.figure)
    } catch {
      setIndicatorFig(null)
    } finally {
      setLoadingIndicator(false)
    }
  }, [ticker, startDate, endDate, theme])

const handleForecast = useCallback(async () => {
    setForecastError('')
    if (!ticker.trim()) { setTickerError('Enter Stock Name'); return }
    setTickerError('')
    const n = parseInt(nDays)
    if (!nDays || isNaN(n)) { setForecastError('Please enter number of future days'); return }
    if (n === 0) { setForecastError('Please enter a number above 0'); return }
    if (n < 0) { setForecastError('Please enter positive number'); return }

    setLoadingForecast(true)
    try {
      const data = await fetchForecast(ticker.toUpperCase(), n, theme)
      setForecastFig(data.figure)
    } catch {
      setForecastError('Forecast failed. Please try again.')
    } finally {
      setLoadingForecast(false)
    }
  }, [nDays, ticker, theme])

  return (
    <div className="ai-predictor page-enter">
     <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

       {/* ── Sidebar ── */}
        <div style={{ width: '280px', flexShrink: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
     <input
            placeholder="Ex: AAPL"
            value={ticker}
            onChange={e => { setTicker(e.target.value); setTickerError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ border: tickerError ? '1.5px solid #ef4444' : '' }}
          />
      {tickerError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: '#ef4444', fontSize: '12.5px', fontWeight: 500,
                marginTop: '-8px', marginBottom: '10px',
                padding: '6px 10px',
                background: 'rgba(239,68,68,0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.2)'
              }}
            >
              <AlertCircle size={13} />
              {tickerError}
            </motion.div>
          )}

        <button className="btn-submit" onClick={handleSubmit} disabled={loadingSubmit}>
            {loadingSubmit ? 'Loading...' : 'Submit'}
          </button>
    
         {/* Date pickers */}
        <input
            type="date"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            max={new Date().toISOString().split('T')[0]}
            min="1995-08-05"
            style={{ display: 'block', width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          <input
            type="date"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            max={new Date().toISOString().split('T')[0]}
            style={{ display: 'block', width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}
          />

          {/* Stock + Indicators row */}
          <div style={{ display: 'flex', gap: '4%', marginBottom: '12px' }}>
            <button
              className="btn-stock"
              style={{ width: '48%', display: 'inline-block', fontWeight: 600 }}
              onClick={handleStock}
              disabled={loadingStock}
            >
              {loadingStock ? '...' : 'Stock Price'}
            </button>
            <button
              className="btn-indicators"
              style={{ width: '48%', display: 'inline-block', fontWeight: 600 }}
              onClick={handleIndicators}
              disabled={loadingIndicator}
            >
              {loadingIndicator ? '...' : 'Indicators'}
            </button>
          </div>

          <input
            type="number"
            placeholder="Forecast days"
            value={nDays}
            onChange={e => setNDays(e.target.value)}
          />

          <button className="btn-forecast" onClick={handleForecast} disabled={loadingForecast}>
            {loadingForecast ? 'Forecasting...' : 'Forecast'}
          </button>

          <AnimatePresence>
            {forecastError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  color: '#ff4d4d',
                  marginTop: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <AlertCircle size={14} />
                {forecastError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

       {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {loadingSubmit ? (
            <>
              <LoadingSkeleton height={120} />
            </>
          ) : (
            <>
              {stockName && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginBottom: '8px' }}
                >
                  {stockName}
                </motion.h3>
              )}
              {description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}
                >
                  {description}
                </motion.p>
              )}
            </>
          )}

          {loadingStock && <LoadingSkeleton height={500} />}
          {!loadingStock && stockFig && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <StockChart figure={stockFig} title={ticker.toUpperCase()} />
            </motion.div>
          )}

          {loadingIndicator && <LoadingSkeleton height={500} />}
          {!loadingIndicator && indicatorFig && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <StockChart figure={indicatorFig} title={`${ticker.toUpperCase()}_EMA`} />
            </motion.div>
          )}

          {loadingForecast && <LoadingSkeleton height={500} />}
          {!loadingForecast && forecastFig && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '25px', padding: '10px', borderRadius: '15px', backgroundColor: 'var(--bg)' }}
            >
              <StockChart figure={forecastFig} title={`${ticker.toUpperCase()}_Forecast`} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
