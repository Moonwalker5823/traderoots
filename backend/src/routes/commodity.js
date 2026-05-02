'use strict'
const express = require('express')
const router = express.Router()
const { fetchPrice } = require('../services/priceService')
const { generateHistory } = require('../services/historyService')
const { getAIContent } = require('../services/claudeService')
const { findCategory, findCommodity } = require('../data/categories')

// Server-side cache for Claude responses — educational content is stable within a session
const aiCache = new Map()

// GET /api/category/:id/prices
router.get('/category/:id/prices', async (req, res) => {
  try {
    const category = findCategory(req.params.id)
    if (!category) return res.status(404).json({ error: 'Category not found' })

    const commodities = await Promise.all(
      category.commodities.map(async (c) => {
        const price = await fetchPrice(c.apiKey)
        const livePrice = price ?? c.fallbackPrice
        const history = generateHistory(c.slug, livePrice)
        const prev = history[history.length - 2].price
        const curr = history[history.length - 1].price
        const priceUnavailable = price === null
        const change = priceUnavailable ? null : Math.round(((curr - prev) / prev) * 10000) / 100

        return {
          name: c.name,
          slug: c.slug,
          price,
          unit: c.unit,
          ticker: c.ticker,
          change,
          changeDirection: change === null ? null : change >= 0 ? 'up' : 'down',
          teaser: c.teaser,
          priceUnavailable,
        }
      })
    )

    res.json({ categoryId: category.id, commodities })
  } catch (err) {
    console.error('GET /category/:id/prices error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/commodity/:slug — price + history only (fast path, ~200ms)
router.get('/commodity/:slug', async (req, res) => {
  try {
    const commodity = findCommodity(req.params.slug)
    if (!commodity) return res.status(404).json({ error: 'Commodity not found' })

    const price = await fetchPrice(commodity.apiKey)
    const priceUnavailable = price === null
    const livePrice = price ?? commodity.fallbackPrice
    const history = generateHistory(commodity.slug, livePrice)
    const prev = history[history.length - 2].price
    const curr = history[history.length - 1].price
    const change = priceUnavailable ? null : Math.round(((curr - prev) / prev) * 10000) / 100

    res.json({
      name: commodity.name,
      slug: commodity.slug,
      category: commodity.categoryId,
      price: priceUnavailable ? null : price,
      unit: commodity.unit,
      ticker: commodity.ticker,
      change,
      changeDirection: change === null ? null : change >= 0 ? 'up' : 'down',
      updatedAt: new Date().toISOString(),
      history,
      priceUnavailable,
    })
  } catch (err) {
    console.error('GET /commodity/:slug error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/commodity/:slug/ai — Claude content, served from cache after first hit
router.get('/commodity/:slug/ai', async (req, res) => {
  try {
    const commodity = findCommodity(req.params.slug)
    if (!commodity) return res.status(404).json({ error: 'Commodity not found' })

    if (aiCache.has(req.params.slug)) {
      return res.json({ ai: aiCache.get(req.params.slug) })
    }

    const ai = await getAIContent(commodity.name, commodity.categoryName, commodity.unit)
    aiCache.set(req.params.slug, ai)
    res.json({ ai })
  } catch (err) {
    console.error('GET /commodity/:slug/ai error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
