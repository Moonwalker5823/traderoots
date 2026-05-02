'use strict'

// Mock must be declared before any require of claudeService
jest.mock('@anthropic-ai/sdk')

const MOCK_AI = {
  what_it_is: 'Gold is a dense, lustrous yellow metal mined from ore deposits on every continent.',
  why_it_matters: 'Gold underpins confidence in financial systems worldwide.',
  brief_history: 'Gold has been exchanged as currency for over 6,000 years.',
  who_trades_it: [
    { type: 'Producers', description: 'Mining companies like Barrick and Newmont.' },
    { type: 'Commercial Buyers', description: 'Jewelers and electronics manufacturers.' },
    { type: 'Investors & Institutions', description: 'Central banks and ETFs like GLD.' },
    { type: 'Individual Investors', description: 'Retail buyers seeking inflation protection.' },
  ],
  key_facts: [
    'All the gold ever mined fits in a 21-meter cube.',
    'Gold is chemically inert — it never corrodes.',
    'Central banks hold over 35,000 tonnes in reserve.',
  ],
  fun_facts: [
    'Gold is the only metal that is yellow in its pure form — all other metals are grey or white.',
    'Ancient Egyptians believed gold was the flesh of the sun god Ra.',
    'The largest gold nugget ever found, the Welcome Stranger (1869), weighed 97 kg.',
  ],
  related_commodities: ['silver', 'platinum', 'copper'],
}

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

// ─── claudeService ───────────────────────────────────────────────────────────

describe('claudeService.getAIContent', () => {
  const mockCreate = jest.fn()

  beforeEach(() => {
    jest.resetModules()
    mockCreate.mockReset()
    const Anthropic = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({ messages: { create: mockCreate } }))
  })

  test('returns parsed AI content on success', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(MOCK_AI) }],
    })
    const { getAIContent } = require('../src/services/claudeService')
    const result = await getAIContent('Gold', 'Precious Metals', 'per troy oz')
    expect(result).toEqual(MOCK_AI)
  })

  test('calls Claude with correct model and commodity details', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(MOCK_AI) }],
    })
    const { getAIContent } = require('../src/services/claudeService')
    await getAIContent('Gold', 'Precious Metals', 'per troy oz')
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-sonnet-4-6',
        max_tokens: 1536,
      })
    )
  })

  test('throws on malformed JSON from Claude', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'not valid json {{' }],
    })
    const { getAIContent } = require('../src/services/claudeService')
    await expect(getAIContent('Gold', 'Precious Metals', 'per troy oz')).rejects.toThrow()
  })
})
