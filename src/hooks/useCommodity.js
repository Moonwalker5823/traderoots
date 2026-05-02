import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

// AI responses are stable educational content — cache for the session to avoid repeat Claude calls
const aiCache = {}

export function useCommodity(slug) {
  const [priceData, setPriceData] = useState(null)
  const [aiData, setAiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(true)
  const [error, setError] = useState(null)
  const [aiError, setAiError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!slug) return

    setLoading(true)
    setError(null)
    setPriceData(null)

    fetch(`${API_BASE}/api/commodity/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        setPriceData(json)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load commodity data. Please try again.')
        setLoading(false)
      })

    if (aiCache[slug] && retryCount === 0) {
      setAiData(aiCache[slug])
      setAiLoading(false)
      return
    }

    setAiLoading(true)
    setAiError(null)
    setAiData(null)

    fetch(`${API_BASE}/api/commodity/${slug}/ai`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        aiCache[slug] = json
        setAiData(json)
        setAiLoading(false)
      })
      .catch(() => {
        setAiError('AI descriptions unavailable.')
        setAiLoading(false)
      })
  }, [slug, retryCount])

  const retry = useCallback(() => {
    delete aiCache[slug]
    setRetryCount((c) => c + 1)
  }, [slug])

  const data = priceData ? { ...priceData, ai: aiData?.ai ?? null } : null

  return { data, loading, aiLoading, error, aiError, retry }
}
