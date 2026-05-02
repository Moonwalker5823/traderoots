'use strict'
const express = require('express')
const router = express.Router()
const { fetchPrice } = require('../services/priceService')
const { generateHistory } = require('../services/historyService')
const { getAIContent } = require('../services/claudeService')
const { findCategory, findCommodity } = require('../data/categories')

// GET /api/category/:id/prices
router.get('/category/:id/prices', async (req, res) => {
  const category = findCategory(req.params.id)
  if (!category) return res.status(404).json({ error: 'Category not found' })

  const commodities = await Promise.all(
    category.commodities.map(async (c) => {
      const price = await fetchPrice(c.apiKey)
      const livePrice = price ?? c.fallbackPrice
      const history = generateHistory(c.slug, livePrice)
      const prev = history[history.length - 2].price
      const curr = history[history.length - 1].price
      const change = ((curr - prev) / prev) * 100

      return {
        name: c.name,
        slug: c.slug,
        price,
        unit: c.unit,
        ticker: c.ticker,
        change: Math.round(change * 100) / 100,
        changeDirection: change >= 0 ? 'up' : 'down',
        teaser: c.teaser,
        priceUnavailable: price === null,
      }
    })
  )

  res.json({ categoryId: req.params.id, commodities })
})

// GET /api/commodity/:slug
router.get('/commodity/:slug', async (req, res) => {
  const commodity = findCommodity(req.params.slug)
  if (!commodity) return res.status(404).json({ error: 'Commodity not found' })

  const [price, aiContent] = await Promise.allSettled([
    fetchPrice(commodity.apiKey),
    getAIContent(commodity.name, commodity.categoryName, commodity.unit),
  ])

  const livePrice = price.status === 'fulfilled' ? (price.value ?? commodity.fallbackPrice) : commodity.fallbackPrice
  const history = generateHistory(commodity.slug, livePrice)
  const prev = history[history.length - 2].price
  const curr = history[history.length - 1].price
  const change = ((curr - prev) / prev) * 100

  res.json({
    name: commodity.name,
    slug: commodity.slug,
    category: commodity.categoryId,
    price: price.status === 'fulfilled' ? price.value : null,
    unit: commodity.unit,
    ticker: commodity.ticker,
    change: Math.round(change * 100) / 100,
    changeDirection: change >= 0 ? 'up' : 'down',
    updatedAt: new Date().toISOString(),
    history,
    ai: aiContent.status === 'fulfilled' ? aiContent.value : null,
    priceUnavailable: price.status !== 'fulfilled' || price.value === null,
    aiUnavailable: aiContent.status !== 'fulfilled',
  })
})

module.exports = router
