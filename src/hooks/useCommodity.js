import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

// Module-level cache — survives re-renders, cleared on page reload
const cache = {}

export function useCommodity(slug) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!slug) return

    if (cache[slug] && retryCount === 0) {
      setData(cache[slug])
      setLoading(false)
      return
    }

    setData(null)
    setLoading(true)
    setError(null)

    fetch(`${API_BASE}/api/commodity/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        cache[slug] = json
        setData(json)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load commodity data. Please try again.')
        setLoading(false)
      })
  }, [slug, retryCount])

  const retry = useCallback(() => {
    delete cache[slug]
    setRetryCount((c) => c + 1)
  }, [slug])

  return { data, loading, error, retry }
}
