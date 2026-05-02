'use strict'

// ─── priceService ────────────────────────────────────────────────────────────

describe('priceService.fetchPrice', () => {
  let fetchPrice

  beforeEach(() => {
    jest.resetModules()
    process.env.API_NINJAS_KEY = 'test-key'
    global.fetch = jest.fn()
    ;({ fetchPrice } = require('../src/services/priceService'))
  })

  test('returns price on successful API response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ price: 1923.4 }),
    })
    expect(await fetchPrice('gold')).toBe(1923.4)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.api-ninjas.com/v1/commodityprice?name=gold',
      { headers: { 'X-Api-Key': 'test-key' } }
    )
  })

  test('returns null on non-ok HTTP response', async () => {
    global.fetch.mockResolvedValue({ ok: false })
    expect(await fetchPrice('gold')).toBeNull()
  })

  test('returns null on network error', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'))
    expect(await fetchPrice('gold')).toBeNull()
  })

  test('returns null when API_NINJAS_KEY is not set', async () => {
    delete process.env.API_NINJAS_KEY
    global.fetch.mockResolvedValue({ ok: false, status: 401 })
    expect(await fetchPrice('gold')).toBeNull()
  })
})

// ─── historyService ──────────────────────────────────────────────────────────

describe('historyService.generateHistory', () => {
  const { generateHistory } = require('../src/services/historyService')

  test('returns exactly 30 data points', () => {
    expect(generateHistory('gold', 1900)).toHaveLength(30)
  })

  test('last price equals the current price input', () => {
    const history = generateHistory('gold', 1900)
    expect(history[history.length - 1].price).toBe(1900)
  })

  test('last price equals the current price input for a float price', () => {
    const history = generateHistory('gold', 1923.45)
    expect(history[history.length - 1].price).toBe(1923.45)
  })

  test('dates are sorted ascending with no duplicates', () => {
    const history = generateHistory('gold', 1900)
    for (let i = 1; i < history.length; i++) {
      expect(history[i].date > history[i - 1].date).toBe(true)
    }
  })

  test('each entry has date (YYYY-MM-DD) and price (number)', () => {
    const history = generateHistory('gold', 1900)
    history.forEach(({ date, price }) => {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof price).toBe('number')
    })
  })

  test('same slug + same call produces identical results', () => {
    const a = generateHistory('gold', 1900)
    const b = generateHistory('gold', 1900)
    expect(a).toEqual(b)
  })

  test('different slugs produce different histories', () => {
    const gold = generateHistory('gold', 1900)
    const silver = generateHistory('silver', 1900)
    expect(gold.map((p) => p.price)).not.toEqual(silver.map((p) => p.price))
  })
})
