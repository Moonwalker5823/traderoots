import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import CommodityCard from '../components/CommodityCard'
import SkeletonCard from '../components/SkeletonCard'
import { findCategory } from '../data/categories'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

const categoryHistoryCache = {}

function useCategoryHistory(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    if (categoryHistoryCache[id]) {
      setData(categoryHistoryCache[id])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    fetch(`${API_BASE}/api/category/${id}/history`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        categoryHistoryCache[id] = json.history
        setData(json.history)
        setLoading(false)
      })
      .catch(() => {
        setError('unavailable')
        setLoading(false)
      })
  }, [id])

  return { data, loading, error }
}

const CATEGORY_HISTORY_SECTIONS = [
  { icon: '📜', title: 'Origins', sub: 'How this market first emerged' },
  { icon: '🏗️', title: 'Key milestones', sub: "Defining moments in this category's history" },
  { icon: '🌍', title: "Today's landscape", sub: "How it's traded in modern markets" },
]

function CategoryHistoryTeaser() {
  return (
    <div className="bg-surface border border-divider rounded-xl p-6">
      <h3 className="text-gold text-sm font-bold uppercase tracking-widest mb-5">
        History of the Trade
      </h3>
      <div className="flex flex-col gap-4">
        {CATEGORY_HISTORY_SECTIONS.map(({ icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
              {icon}
            </div>
            <div>
              <div className="text-white text-base font-semibold">{title}</div>
              <div className="text-muted text-sm">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryHistoryContent({ data }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Overview</h3>
        <p className="text-white text-sm leading-relaxed">{data.overview}</p>
      </div>
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Origins</h3>
        <p className="text-muted text-sm leading-relaxed">{data.origins}</p>
      </div>
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Key Milestones</h3>
        <div className="flex flex-col gap-3">
          {data.key_milestones?.map((milestone, i) => (
            <div key={i} className="border-l-2 border-gold pl-4 py-1">
              <p className="text-white text-sm leading-relaxed">{milestone}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">
          {"Today's Landscape"}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-4">{data.modern_landscape}</p>
        <div className="border-l-2 border-gold pl-4">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Did You Know?</p>
          <p className="text-white text-sm leading-relaxed">{data.fun_fact}</p>
        </div>
      </div>
    </div>
  )
}

export default function CategoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const category = findCategory(id)
  const [commodities, setCommodities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: historyData, loading: historyLoading, error: historyError } = useCategoryHistory(id)
  const [historyRevealed, setHistoryRevealed] = useState(false)
  const historyContentRef = useRef(null)
  const historyHasScrolled = useRef(false)

  useEffect(() => {
    setHistoryRevealed(false)
    historyHasScrolled.current = false
  }, [id])

  useEffect(() => {
    if (historyRevealed && !historyLoading && historyContentRef.current && !historyHasScrolled.current) {
      historyHasScrolled.current = true
      historyContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [historyRevealed, historyLoading])

  useEffect(() => {
    if (!category) return
    setLoading(true)
    setError(null)
    fetch(`${API_BASE}/api/category/${id}/prices`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setCommodities(data.commodities))
      .catch(() => setError('Unable to load prices. Please try again.'))
      .finally(() => setLoading(false))
  }, [id, category])

  if (!category) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="text-muted">Category not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-divider px-6 py-4">
        <Logo />
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-lg mb-6 hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back to Categories
        </button>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-white text-2xl font-bold">{category.name}</h1>
            <p className="text-muted text-sm">{category.description}</p>
          </div>
        </div>
        {error && (
          <div className="bg-surface border border-divider rounded-xl p-4 mb-6 text-amber-400 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading || error
            ? category.commodities.map((_, i) => <SkeletonCard key={i} />)
            : commodities.map((c) => <CommodityCard key={c.slug} commodity={c} />)}
        </div>
        {!historyError && (
          <div className="mt-4 flex flex-col gap-4">
            {!historyRevealed ? (
              <>
                <CategoryHistoryTeaser />
                <div>
                  <button
                    onClick={() => setHistoryRevealed(true)}
                    aria-label="View history of the trade"
                    className="w-full bg-gold text-navy font-bold text-sm tracking-wide py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors"
                  >
                    View History of the Trade ↓
                  </button>
                  {historyLoading && (
                    <p className="text-muted text-xs text-center mt-2">
                      Preparing content in the background…
                    </p>
                  )}
                </div>
              </>
            ) : historyLoading ? (
              <div className="bg-surface border border-divider rounded-xl p-6 flex items-center justify-center gap-3">
                <span className="animate-spin inline-block w-5 h-5 border-2 border-divider border-t-gold rounded-full" />
                <span className="text-muted text-sm">Loading content…</span>
              </div>
            ) : (
              <div ref={historyContentRef} className="flex flex-col gap-4">
                {historyData && <CategoryHistoryContent data={historyData} />}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
