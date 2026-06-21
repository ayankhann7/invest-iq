import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js/dist/plotly.min.js'

export default function StockChart({ figure, title }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !figure) return
    Plotly.react(ref.current, figure.data, figure.layout, {
      displayModeBar: true,
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: [
        'lasso2d', 'select2d', 'autoScale2d',
        'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'
      ],
      toImageButtonOptions: {
        format: 'png',
        filename: `InvestIQ_${title}_Chart`,
        height: 600,
        width: 1200,
        scale: 2
      }
    })
  }, [figure, title])

  if (!figure) return null

  return (
    <div
      ref={ref}
      style={{ width: '100%', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px' }}
    />
  )
}