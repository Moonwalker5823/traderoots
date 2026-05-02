'use strict'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateHistory(slug, currentPrice, days = 30) {
  const today = new Date().toISOString().slice(0, 10)
  const seedStr = slug + today
  const seedNum = [...seedStr].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rng = seededRandom(seedNum)

  // Walk backward from currentPrice, then reverse for ascending order
  const rawPrices = [currentPrice]
  for (let i = 1; i < days; i++) {
    const pct = (rng() - 0.5) * 0.03 // ±1.5% max per day
    rawPrices.push(rawPrices[i - 1] / (1 + pct))
  }
  rawPrices.reverse()

  return rawPrices.map((price, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return {
      date: d.toISOString().slice(0, 10),
      price: Math.round(price * 100) / 100,
    }
  })
}

module.exports = { generateHistory }
