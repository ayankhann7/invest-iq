const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchTickerInfo(ticker) {
  const res = await fetch(`${BASE_URL}/stock-info?ticker=${ticker}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return { name: data.name, description: data.description }
}

export async function fetchStockPrice(ticker, start, end, theme) {
  const endParam = end && end !== 'null' ? `&end=${end}` : ''
  const res = await fetch(`${BASE_URL}/stock-chart?ticker=${ticker}&start=${start}${endParam}&theme=${theme}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return { figure: data.figure }
}

export async function fetchStockIndicators(ticker, start, end, theme) {
  const endParam = end && end !== 'null' ? `&end=${end}` : ''
  const res = await fetch(`${BASE_URL}/indicators?ticker=${ticker}&start=${start}${endParam}&theme=${theme}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return { figure: data.figure }
}

export async function fetchForecast(ticker, days, theme) {
  const res = await fetch(`${BASE_URL}/forecast?ticker=${ticker}&days=${days}&theme=${theme}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return { figure: data.figure }
}