import { useState, useEffect, useRef } from 'react'
import Logo from '../components/Logo'
import Footer from '../components/Footer'
import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/categories'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const historyCache = {}

function useTradeHistory() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (historyCache.data) {
      setData(historyCache.data)
      setLoading(false)
      return
    }
    let cancelled = false
    fetch(`${API_BASE}/api/history`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        historyCache.data = json.history
        setData(json.history)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('unavailable')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}

const TRADE_HISTORY_SECTIONS = [
  { icon: '🏛️', title: 'Ancient origins', sub: 'Mesopotamia to medieval trade routes' },
  { icon: '📈', title: 'Rise of exchanges', sub: 'How futures markets were born' },
  { icon: '🌐', title: 'Modern global markets', sub: "Electronic trading and today's landscape" },
]

function TradeHistoryTeaser() {
  return (
    <div className="bg-surface border border-divider rounded-xl p-6">
      <h3 className="text-gold text-sm font-bold uppercase tracking-widest mb-5">
        History of the Trade
      </h3>
      <div className="flex flex-col gap-4">
        {TRADE_HISTORY_SECTIONS.map(({ icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
              {icon}
            </div>
            <div>
              <div className="text-white text-base font-semibold">{title}</div>
              <div className="text-white text-sm">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TradeHistoryContent({ data }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Overview</h3>
        <p className="text-white text-sm leading-relaxed">{data.overview}</p>
      </div>
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Ancient Origins</h3>
        <p className="text-white text-sm leading-relaxed">{data.ancient_origins}</p>
      </div>
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Rise of Exchanges</h3>
        <p className="text-white text-sm leading-relaxed">{data.rise_of_exchanges}</p>
      </div>
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Modern Markets</h3>
        <p className="text-white text-sm leading-relaxed mb-4">{data.modern_markets}</p>
        <div className="border-l-2 border-gold pl-4">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Did You Know?</p>
          <p className="text-white text-sm leading-relaxed">{data.fun_fact}</p>
        </div>
      </div>
    </div>
  )
}

export default function CategoryListPage() {
  const { data: historyData, loading: historyLoading, error: historyError } = useTradeHistory()
  const [revealed, setRevealed] = useState(false)
  const contentRef = useRef(null)
  const hasScrolled = useRef(false)

  useEffect(() => {
    if (revealed && !historyLoading && contentRef.current && !hasScrolled.current) {
      hasScrolled.current = true
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [revealed, historyLoading])

  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-divider px-6 py-4 flex items-center justify-between">
        <Logo />
        <span className="text-muted text-sm hidden sm:block">Commodity Education Explorer</span>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col justify-center items-center mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">Explore Commodity Markets</h1>
          <p className="text-muted text-sm">
            Select a category to browse commodities and learn how global markets work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
        {!historyError && (
          <div className="mt-4 flex flex-col gap-4">
            {!revealed ? (
              <>
                <TradeHistoryTeaser />
                <div>
                  <button
                    onClick={() => setRevealed(true)}
                    aria-label="View history of the trade"
                    className="w-full bg-gold text-navy font-bold text-sm tracking-wide py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors"
                  >
                    View History of the Trade ↓
                  </button>
                  {historyLoading && (
                    <p className="text-white text-xs text-center mt-2">
                      Preparing content in the background…
                    </p>
                  )}
                </div>
              </>
            ) : historyLoading ? (
              <div className="bg-surface border border-divider rounded-xl p-6 flex items-center justify-center gap-3">
                <span className="animate-spin inline-block w-5 h-5 border-2 border-divider border-t-gold rounded-full" />
                <span className="text-white text-sm">Loading content…</span>
              </div>
            ) : (
              <div ref={contentRef} className="flex flex-col gap-4">
                {historyData && <TradeHistoryContent data={historyData} />}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
