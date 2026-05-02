'use strict'
const express = require('express')
const router = express.Router()
const { fetchPrice } = require('../services/priceService')
const { generateHistory } = require('../services/historyService')
const { getAIContent } = require('../services/claudeService')
const { findCategory, findCommodity } = require('../data/categories')

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
        const change = priceUnavailable
          ? null
          : Math.round(((curr - prev) / prev) * 10000) / 100

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

// GET /api/commodity/:slug
router.get('/commodity/:slug', async (req, res) => {
  try {
    const commodity = findCommodity(req.params.slug)
    if (!commodity) return res.status(404).json({ error: 'Commodity not found' })

    const [priceResult, aiResult] = await Promise.allSettled([
      fetchPrice(commodity.apiKey),
      getAIContent(commodity.name, commodity.categoryName, commodity.unit),
    ])

    const livePrice =
      priceResult.status === 'fulfilled' && priceResult.value !== null
        ? priceResult.value
        : commodity.fallbackPrice
    const history = generateHistory(commodity.slug, livePrice)
    const prev = history[history.length - 2].price
    const curr = history[history.length - 1].price
    const priceUnavailable = priceResult.status !== 'fulfilled' || priceResult.value === null
    const change = priceUnavailable
      ? null
      : Math.round(((curr - prev) / prev) * 10000) / 100

    res.json({
      name: commodity.name,
      slug: commodity.slug,
      category: commodity.categoryId,
      price: priceResult.status === 'fulfilled' ? priceResult.value : null,
      unit: commodity.unit,
      ticker: commodity.ticker,
      change,
      changeDirection: change === null ? null : change >= 0 ? 'up' : 'down',
      updatedAt: new Date().toISOString(),
      history,
      ai: aiResult.status === 'fulfilled' ? aiResult.value : null,
      priceUnavailable,
      aiUnavailable: aiResult.status !== 'fulfilled',
    })
  } catch (err) {
    console.error('GET /commodity/:slug error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
