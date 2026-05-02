import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import CommodityCard from '../components/CommodityCard'
import SkeletonCard from '../components/SkeletonCard'
import { findCategory } from '../data/categories'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export default function CategoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const category = findCategory(id)
  const [commodities, setCommodities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          className="text-muted text-sm mb-6 hover:text-white transition-colors flex items-center gap-1"
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
          {loading
            ? category.commodities.map((_, i) => <SkeletonCard key={i} />)
            : commodities.map((c) => <CommodityCard key={c.slug} commodity={c} />)}
        </div>
      </main>
    </div>
  )
}
