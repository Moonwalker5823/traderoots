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
})
