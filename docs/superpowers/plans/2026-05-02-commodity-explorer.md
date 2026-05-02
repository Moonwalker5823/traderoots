# TradeRoots Commodity Explorer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a three-screen commodity education app with live price data, simulated price history charts, and Claude-generated educational content.

**Architecture:** Monorepo — Vite/React frontend at repo root, Express backend in `/backend`. All external API calls (API Ninjas + Anthropic) go through the backend. Frontend uses React Router v6 for URL-based navigation across three screens.

**Tech Stack:** React 18, Vite, Tailwind CSS v3, React Router v6, Recharts, Express, `@anthropic-ai/sdk` (`claude-sonnet-4-6`), API Ninjas commodities API, Jest (backend tests)

---

## File Map

### Frontend (repo root)
| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add react-router-dom, recharts, tailwindcss, postcss, autoprefixer, prettier |
| `vite.config.js` | Modify | Add dev proxy: `/api/*` → `http://localhost:3001` |
| `tailwind.config.js` | Create | Content paths + custom color tokens |
| `postcss.config.js` | Create | Standard tailwindcss + autoprefixer |
| `.prettierrc` | Create | Project formatting config |
| `.gitignore` | Modify | Add .env, dist, .superpowers |
| `.env` | Create | Empty in dev; `VITE_API_URL` set on Vercel for prod |
| `public/favicon.svg` | Create | SVG icon (roots + upward arrow) |
| `src/index.css` | Replace | Tailwind directives + shimmer keyframe |
| `src/App.css` | Delete | Replaced by Tailwind |
| `src/App.jsx` | Replace | React Router with three routes |
| `src/data/categories.js` | Create | All 5 categories + 21 commodities (ES module) |
| `src/components/Logo.jsx` | Create | SVG logo component |
| `src/components/SkeletonCard.jsx` | Create | Shimmer loading card |
| `src/components/CategoryCard.jsx` | Create | Category card with hover glow |
| `src/components/CommodityCard.jsx` | Create | Price card with change indicator |
| `src/components/PriceChart.jsx` | Create | Recharts LineChart for history |
| `src/pages/CategoryListPage.jsx` | Create | Screen 1 |
| `src/pages/CategoryDetailPage.jsx` | Create | Screen 2 — fetches category prices |
| `src/pages/CommodityDetailPage.jsx` | Create | Screen 3 — full detail |
| `src/hooks/useCommodity.js` | Create | Fetch + session cache hook |

### Backend (`backend/`)
| File | Action | Purpose |
|---|---|---|
| `backend/package.json` | Create | Express + Anthropic SDK + Jest, CommonJS |
| `backend/.env` | Create | ANTHROPIC_API_KEY, API_NINJAS_KEY, PORT, FRONTEND_URL |
| `backend/.gitignore` | Create | Ignore node_modules, .env |
| `backend/src/server.js` | Create | Express app, CORS, routes, /health |
| `backend/src/data/categories.js` | Create | Commodity registry with API keys (CommonJS) |
| `backend/src/routes/commodity.js` | Create | Two route handlers |
| `backend/src/services/priceService.js` | Create | API Ninjas fetch + null fallback |
| `backend/src/services/historyService.js` | Create | Seeded price history generator |
| `backend/src/services/claudeService.js` | Create | Anthropic SDK call with prompt caching |
| `backend/test/commodity.test.js` | Create | Jest unit tests for all three services |

---

## Phase 1 — Project Setup

### Task 1: Config files

**Files:**
- Modify: `.gitignore`
- Create: `.prettierrc`
- Create: `.env`
- Create: `backend/.env`
- Create: `backend/.gitignore`

- [ ] **Step 1: Update .gitignore**

```
# dependencies
node_modules
backend/node_modules

# build
dist

# env
.env
backend/.env

# brainstorm session files
.superpowers
```

- [ ] **Step 2: Create .prettierrc**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

- [ ] **Step 3: Create root .env (empty — Vite proxy handles dev, VITE_API_URL is set on Vercel)**

```
# Production only — set VITE_API_URL=https://your-railway-url on Vercel
```

- [ ] **Step 4: Create backend/.gitignore**

```
node_modules
.env
```

- [ ] **Step 5: Create backend/.env**

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
API_NINJAS_KEY=your-api-ninjas-key-here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

- [ ] **Step 6: Commit**

```bash
git init
git add .gitignore .prettierrc .env backend/.env backend/.gitignore
git commit -m "chore: add config and env files"
```

---

### Task 2: Install frontend dependencies and configure Tailwind

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: Install frontend packages**

```bash
npm install react-router-dom recharts
npm install -D tailwindcss@3 postcss autoprefixer prettier
```

Expected: packages added to node_modules, package.json updated.

- [ ] **Step 2: Add prettier script to package.json**

Open `package.json` and add to `"scripts"`:
```json
"format": "prettier --write \"src/**/*.{js,jsx,css}\""
```

- [ ] **Step 3: Update vite.config.js to add dev proxy**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

- [ ] **Step 4: Create tailwind.config.js**

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F1E',
        surface: '#111827',
        divider: '#1e2a45',
        gold: {
          DEFAULT: '#FFD700',
          dark: '#C9A227',
        },
        muted: '#8892A4',
        up: '#00C896',
        down: '#FF4B4B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js tailwind.config.js postcss.config.js
git commit -m "chore: add frontend dependencies and configure Tailwind"
```

---

### Task 3: Backend scaffolding

**Files:**
- Create: `backend/package.json`
- Create: `backend/src/server.js`

- [ ] **Step 1: Create backend/package.json**

```json
{
  "name": "traderoots-backend",
  "version": "1.0.0",
  "type": "commonjs",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "test": "jest --testPathPattern=test/"
  },
  "jest": {
    "testEnvironment": "node"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

- [ ] **Step 2: Install backend packages**

```bash
cd backend && npm install && cd ..
```

Expected: `backend/node_modules` created.

- [ ] **Step 3: Create backend/src/server.js**

```js
'use strict'
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const commodityRoutes = require('./routes/commodity')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api', commodityRoutes)

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
```

- [ ] **Step 4: Verify server starts (requires routes file — create a stub)**

Create `backend/src/routes/commodity.js` stub:
```js
'use strict'
const express = require('express')
const router = express.Router()
module.exports = router
```

Run:
```bash
cd backend && node src/server.js
```

Expected output: `Backend running on port 3001`

Stop with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add backend/
git commit -m "chore: scaffold Express backend"
```

---

## Phase 2 — Backend Services (TDD)

### Task 4: priceService — API Ninjas fetch with null fallback

**Files:**
- Create: `backend/src/services/priceService.js`
- Create: `backend/test/commodity.test.js` (priceService section)

- [ ] **Step 1: Write failing tests for priceService**

Create `backend/test/commodity.test.js`:

```js
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
```

- [ ] **Step 2: Run tests — expect failure (module not found)**

```bash
cd backend && npx jest --testPathPattern=test/ 2>&1 | head -20
```

Expected: `Cannot find module '../src/services/priceService'`

- [ ] **Step 3: Implement priceService.js**

Create `backend/src/services/priceService.js`:

```js
'use strict'

const BASE_URL = 'https://api.api-ninjas.com/v1/commodityprice'

async function fetchPrice(apiKey) {
  try {
    const res = await fetch(`${BASE_URL}?name=${apiKey}`, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.price ?? null
  } catch {
    return null
  }
}

module.exports = { fetchPrice }
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
cd backend && npx jest --testPathPattern=test/ --verbose 2>&1 | grep -E "(PASS|FAIL|✓|✗|×|√)"
```

Expected: 3 tests pass for `priceService.fetchPrice`

- [ ] **Step 5: Commit**

```bash
git add backend/src/services/priceService.js backend/test/commodity.test.js
git commit -m "feat: add priceService with API Ninjas fetch and null fallback"
```

---

### Task 5: historyService — seeded price history generator

**Files:**
- Create: `backend/src/services/historyService.js`
- Modify: `backend/test/commodity.test.js` (add historyService section)

- [ ] **Step 1: Add failing tests for historyService**

Append to `backend/test/commodity.test.js`:

```js
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
```

- [ ] **Step 2: Run tests — expect historyService tests to fail**

```bash
cd backend && npx jest --testPathPattern=test/ 2>&1 | grep -E "(PASS|FAIL|Cannot find)"
```

Expected: `Cannot find module '../src/services/historyService'`

- [ ] **Step 3: Implement historyService.js**

Create `backend/src/services/historyService.js`:

```js
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
```

- [ ] **Step 4: Run all tests — expect all pass**

```bash
cd backend && npx jest --testPathPattern=test/ --verbose 2>&1 | tail -20
```

Expected: 3 priceService tests + 6 historyService tests all pass.

- [ ] **Step 5: Commit**

```bash
git add backend/src/services/historyService.js backend/test/commodity.test.js
git commit -m "feat: add historyService with seeded deterministic price history"
```

---

### Task 6: claudeService — Anthropic SDK with prompt caching

**Files:**
- Create: `backend/src/services/claudeService.js`
- Modify: `backend/test/commodity.test.js` (add claudeService section)

- [ ] **Step 1: Add failing tests for claudeService**

Insert the following immediately after the `'use strict'` line at the top of `backend/test/commodity.test.js`, before the priceService describe block. Jest hoists `jest.mock()` calls automatically, but the constant and mock declaration must appear before any `require()` of the mocked module:

```js
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
    "Gold is the only metal that is yellow in its pure form — all other metals are grey or white.",
    'Ancient Egyptians believed gold was the flesh of the sun god Ra.',
    'The largest gold nugget ever found, the Welcome Stranger (1869), weighed 97 kg.',
  ],
  related_commodities: ['silver', 'platinum', 'copper'],
}
```

Then append the describe block after the historyService tests:

```js
// ─── claudeService ───────────────────────────────────────────────────────────

describe('claudeService.getAIContent', () => {
  const Anthropic = require('@anthropic-ai/sdk')
  const mockCreate = jest.fn()

  beforeAll(() => {
    Anthropic.mockImplementation(() => ({ messages: { create: mockCreate } }))
  })

  beforeEach(() => {
    jest.resetModules()
    mockCreate.mockReset()
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
        max_tokens: 1024,
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
```

- [ ] **Step 2: Run tests — expect claudeService tests to fail**

```bash
cd backend && npx jest --testPathPattern=test/ 2>&1 | grep -E "(PASS|FAIL|Cannot find)"
```

Expected: `Cannot find module '../src/services/claudeService'`

- [ ] **Step 3: Implement claudeService.js**

Create `backend/src/services/claudeService.js`:

```js
'use strict'
const Anthropic = require('@anthropic-ai/sdk')

const SYSTEM_PROMPT = `You are a commodity market educator for TradeRoots, an educational web app that teaches people about global commodity markets. Your job is to generate accurate, engaging educational content about individual commodities for users who have no prior finance background.

Return ONLY a valid JSON object matching the exact schema below. Do not include markdown formatting, code fences, explanatory text, or any characters outside the JSON object itself.

{
  "what_it_is": "2-3 sentences describing what this commodity is and where it comes from",
  "why_it_matters": "1-2 sentences explaining its global economic importance",
  "brief_history": "2-3 sentences on how it became a globally traded commodity",
  "who_trades_it": [
    {"type": "Producers", "description": "who produces or extracts this commodity and at what scale"},
    {"type": "Commercial Buyers", "description": "which industries buy it as a production input"},
    {"type": "Investors & Institutions", "description": "how institutional players (funds, banks) participate"},
    {"type": "Individual Investors", "description": "accessible ways retail investors can gain exposure"}
  ],
  "key_facts": ["significant fact 1", "significant fact 2", "significant fact 3"],
  "fun_facts": ["surprising or quirky fact 1", "surprising or quirky fact 2", "surprising or quirky fact 3"],
  "related_commodities": ["slug1", "slug2", "slug3"]
}

FIELD GUIDANCE

what_it_is: Ground the reader in the physical reality of the commodity. Name the top producing countries or regions. Describe how it is extracted, grown, raised, or refined. Aim for 2-3 complete sentences that make someone who has never thought about this commodity feel oriented.

why_it_matters: Explain the commodity's economic significance for everyday people. Which industries depend on it? What happens across the economy when its supply is disrupted?

brief_history: Tell the origin story of how humans began trading this commodity and how organized exchanges emerged around it. Include one memorable historical moment that illustrates its importance.

who_trades_it — all four types require specific, concrete descriptions:
- Producers: Name the types of companies (mining firms, oil majors, grain cooperatives) or the leading producer countries.
- Commercial Buyers: Name the actual industries that consume this as an input. Be precise (e.g. "automotive catalytic converter manufacturers" not just "manufacturers").
- Investors & Institutions: Name actual instruments and institution types — commodity ETFs, futures contracts, swaps, central bank reserves, hedge funds.
- Individual Investors: Describe accessible entry points — which ETFs track it, whether physical ownership is practical, or whether producer stocks offer exposure.

key_facts: 3 informative facts that give genuine insight into this commodity's scale, importance, or market dynamics — production volumes, geographic supply concentration, strategic reserves, historical price records, or major downstream products. These should make the reader feel meaningfully better informed.

fun_facts: Exactly 3 surprising, counterintuitive, or quirky facts that make a reader say "I had no idea." Look for unexpected everyday uses, unusual records, historical curiosities, pop culture connections, or facts that challenge assumptions. Keep the tone light and engaging — these are the memorable conversation-starter moments.

related_commodities: Choose exactly 3 slugs from the approved list below that are most directly connected to this commodity through substitution, shared supply chain, or strong price correlation. Use only slugs from this list, spelled exactly as shown:

gold, silver, platinum, palladium, crude-oil, natural-gas, gasoline, heating-oil, wheat, corn, coffee, sugar, cotton, soybeans, copper, aluminum, zinc, nickel, live-cattle, lean-hogs, feeder-cattle

RULES:
- Output only the JSON object. Zero other characters.
- No markdown, no code fences, no preamble of any kind.
- Write in the present tense about enduring facts. No "as of 2024" or "currently" qualifiers.
- If a financial term is unavoidable, include a brief parenthetical explanation.
- Every JSON string value must be a single sentence or short phrase — no embedded newlines.
- Tone: approachable, intellectually curious, educational. Written for a smart adult with no economics background.`

async function getAIContent(commodityName, categoryName, unit) {
  const client = new Anthropic()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1536,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Generate educational content for: ${commodityName}. Category: ${categoryName}. Unit: ${unit}.`,
      },
    ],
  })
  return JSON.parse(response.content[0].text)
}

module.exports = { getAIContent }
```

- [ ] **Step 4: Run all tests — expect all pass**

```bash
cd backend && npx jest --testPathPattern=test/ --verbose 2>&1 | tail -25
```

Expected: 3 priceService + 6 historyService + 3 claudeService = 12 tests pass.

- [ ] **Step 5: Commit**

```bash
git add backend/src/services/claudeService.js backend/test/commodity.test.js
git commit -m "feat: add claudeService with Anthropic SDK and prompt caching"
```

---

### Task 7: Backend data registry and API routes

**Files:**
- Create: `backend/src/data/categories.js`
- Replace: `backend/src/routes/commodity.js`

- [ ] **Step 1: Create backend/src/data/categories.js**

```js
'use strict'

// API Ninjas commodity name keys — verify at api-ninjas.com/api/commodityprice
const categories = [
  {
    id: 'precious-metals',
    name: 'Precious Metals',
    commodities: [
      { slug: 'gold', name: 'Gold', ticker: 'XAU', unit: 'per troy oz', apiKey: 'gold', fallbackPrice: 1900, teaser: 'The world\'s most recognized store of value and safe-haven asset.' },
      { slug: 'silver', name: 'Silver', ticker: 'XAG', unit: 'per troy oz', apiKey: 'silver', fallbackPrice: 23, teaser: 'Dual role as both monetary metal and critical industrial input.' },
      { slug: 'platinum', name: 'Platinum', ticker: 'XPT', unit: 'per troy oz', apiKey: 'platinum', fallbackPrice: 900, teaser: 'Rarer than gold, prized in auto catalysts and green hydrogen.' },
      { slug: 'palladium', name: 'Palladium', ticker: 'XPD', unit: 'per troy oz', apiKey: 'palladium', fallbackPrice: 1100, teaser: 'Dominant in gasoline catalytic converters; tight global supply.' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    commodities: [
      { slug: 'crude-oil', name: 'Crude Oil', ticker: 'CL', unit: 'per barrel', apiKey: 'crude_oil', fallbackPrice: 75, teaser: 'The world\'s most traded commodity — benchmark for global energy costs.' },
      { slug: 'natural-gas', name: 'Natural Gas', ticker: 'NG', unit: 'per MMBtu', apiKey: 'natural_gas', fallbackPrice: 2.5, teaser: 'Cleaner-burning fossil fuel powering heating and electricity generation.' },
      { slug: 'gasoline', name: 'Gasoline', ticker: 'RB', unit: 'per gallon', apiKey: 'gasoline', fallbackPrice: 2.5, teaser: 'Refined petroleum product that fuels most of the world\'s vehicles.' },
      { slug: 'heating-oil', name: 'Heating Oil', ticker: 'HO', unit: 'per gallon', apiKey: 'heating_oil', fallbackPrice: 2.6, teaser: 'Distillate fuel used to heat homes across the northeastern US and Europe.' },
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    commodities: [
      { slug: 'wheat', name: 'Wheat', ticker: 'ZW', unit: 'per bushel', apiKey: 'wheat', fallbackPrice: 550, teaser: 'Staple grain underpinning global food security and bread supplies.' },
      { slug: 'corn', name: 'Corn', ticker: 'ZC', unit: 'per bushel', apiKey: 'corn', fallbackPrice: 450, teaser: 'Versatile crop used in food, ethanol fuel, and animal feed worldwide.' },
      { slug: 'coffee', name: 'Coffee', ticker: 'KC', unit: 'per lb', apiKey: 'coffee', fallbackPrice: 185, teaser: 'The world\'s second most traded commodity after crude oil.' },
      { slug: 'sugar', name: 'Sugar', ticker: 'SB', unit: 'per lb', apiKey: 'sugar', fallbackPrice: 18, teaser: 'Raw sweetener produced from sugarcane and beets on six continents.' },
      { slug: 'cotton', name: 'Cotton', ticker: 'CT', unit: 'per lb', apiKey: 'cotton', fallbackPrice: 80, teaser: 'Soft fiber that clothes the majority of the world\'s population.' },
      { slug: 'soybeans', name: 'Soybeans', ticker: 'ZS', unit: 'per bushel', apiKey: 'soybeans', fallbackPrice: 1150, teaser: 'Versatile oilseed driving global protein and vegetable oil supply.' },
    ],
  },
  {
    id: 'industrial-metals',
    name: 'Industrial Metals',
    commodities: [
      { slug: 'copper', name: 'Copper', ticker: 'HG', unit: 'per lb', apiKey: 'copper', fallbackPrice: 4.0, teaser: 'The metal of electrification — essential for wiring, EVs, and renewables.' },
      { slug: 'aluminum', name: 'Aluminum', ticker: 'ALI', unit: 'per lb', apiKey: 'aluminum', fallbackPrice: 1.1, teaser: 'Lightweight metal that transformed aerospace, packaging, and construction.' },
      { slug: 'zinc', name: 'Zinc', ticker: 'ZNC', unit: 'per lb', apiKey: 'zinc', fallbackPrice: 1.25, teaser: 'Essential for galvanizing steel and preventing corrosion in infrastructure.' },
      { slug: 'nickel', name: 'Nickel', ticker: 'NI', unit: 'per lb', apiKey: 'nickel', fallbackPrice: 7.5, teaser: 'Key ingredient in stainless steel and lithium-ion battery cathodes.' },
    ],
  },
  {
    id: 'livestock',
    name: 'Livestock',
    commodities: [
      { slug: 'live-cattle', name: 'Live Cattle', ticker: 'LE', unit: 'per lb', apiKey: 'live_cattle', fallbackPrice: 185, teaser: 'Futures on beef cattle ready for slaughter, traded on the CME.' },
      { slug: 'lean-hogs', name: 'Lean Hogs', ticker: 'HE', unit: 'per lb', apiKey: 'lean_hogs', fallbackPrice: 85, teaser: 'Pork futures reflecting supply of market-weight hogs for processing.' },
      { slug: 'feeder-cattle', name: 'Feeder Cattle', ticker: 'GF', unit: 'per lb', apiKey: 'feeder_cattle', fallbackPrice: 240, teaser: 'Young cattle sold to feedlots for finishing before slaughter.' },
    ],
  },
]

function findCategory(id) {
  return categories.find((c) => c.id === id) || null
}

function findCommodity(slug) {
  for (const cat of categories) {
    const commodity = cat.commodities.find((c) => c.slug === slug)
    if (commodity) return { ...commodity, categoryId: cat.id, categoryName: cat.name }
  }
  return null
}

module.exports = { categories, findCategory, findCommodity }
```

- [ ] **Step 2: Implement commodity routes**

Replace `backend/src/routes/commodity.js`:

```js
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
```

- [ ] **Step 3: Smoke test both routes with curl**

Start the backend:
```bash
cd backend && node src/server.js &
```

Test category prices:
```bash
curl http://localhost:3001/api/category/precious-metals/prices | python3 -m json.tool | head -30
```

Expected: JSON with `categoryId` and `commodities` array (prices may be null if API Ninjas key not set yet — that's fine).

Test health:
```bash
curl http://localhost:3001/health
```

Expected: `{"status":"ok"}`

Stop the backend: `kill %1`

- [ ] **Step 4: Run all Jest tests — expect 12 passing**

```bash
cd backend && npx jest --testPathPattern=test/ --verbose 2>&1 | tail -20
```

Expected: 12 tests pass (priceService×3, historyService×6, claudeService×3)

- [ ] **Step 5: Commit**

```bash
git add backend/src/data/categories.js backend/src/routes/commodity.js
git commit -m "feat: add backend routes and commodity registry"
```

---

## Phase 3 — Frontend Shell

### Task 8: Static commodity data for the frontend

**Files:**
- Create: `src/data/categories.js`

- [ ] **Step 1: Create src/data/categories.js**

```js
export const categories = [
  {
    id: 'precious-metals',
    name: 'Precious Metals',
    icon: '🥇',
    description: 'Rare, naturally occurring metals valued for investment and industry',
    commodities: [
      { slug: 'gold', name: 'Gold', ticker: 'XAU', unit: 'per troy oz', teaser: 'The world\'s most recognized store of value and safe-haven asset.', related: ['silver', 'platinum', 'copper'] },
      { slug: 'silver', name: 'Silver', ticker: 'XAG', unit: 'per troy oz', teaser: 'Dual role as both monetary metal and critical industrial input.', related: ['gold', 'platinum', 'copper'] },
      { slug: 'platinum', name: 'Platinum', ticker: 'XPT', unit: 'per troy oz', teaser: 'Rarer than gold, prized in auto catalysts and green hydrogen.', related: ['gold', 'palladium', 'silver'] },
      { slug: 'palladium', name: 'Palladium', ticker: 'XPD', unit: 'per troy oz', teaser: 'Dominant in gasoline catalytic converters; tight global supply.', related: ['platinum', 'gold', 'nickel'] },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: '⚡',
    description: 'Fuels that power the global economy from oil fields to pipelines',
    commodities: [
      { slug: 'crude-oil', name: 'Crude Oil', ticker: 'CL', unit: 'per barrel', teaser: 'The world\'s most traded commodity — benchmark for global energy costs.', related: ['natural-gas', 'gasoline', 'heating-oil'] },
      { slug: 'natural-gas', name: 'Natural Gas', ticker: 'NG', unit: 'per MMBtu', teaser: 'Cleaner-burning fossil fuel powering heating and electricity generation.', related: ['crude-oil', 'heating-oil', 'coal'] },
      { slug: 'gasoline', name: 'Gasoline', ticker: 'RB', unit: 'per gallon', teaser: 'Refined petroleum product that fuels most of the world\'s vehicles.', related: ['crude-oil', 'heating-oil', 'natural-gas'] },
      { slug: 'heating-oil', name: 'Heating Oil', ticker: 'HO', unit: 'per gallon', teaser: 'Distillate fuel used to heat homes across the northeastern US and Europe.', related: ['crude-oil', 'natural-gas', 'gasoline'] },
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: '🌾',
    description: 'Crops and soft commodities traded on exchanges worldwide',
    commodities: [
      { slug: 'wheat', name: 'Wheat', ticker: 'ZW', unit: 'per bushel', teaser: 'Staple grain underpinning global food security and bread supplies.', related: ['corn', 'soybeans', 'sugar'] },
      { slug: 'corn', name: 'Corn', ticker: 'ZC', unit: 'per bushel', teaser: 'Versatile crop used in food, ethanol fuel, and animal feed worldwide.', related: ['wheat', 'soybeans', 'sugar'] },
      { slug: 'coffee', name: 'Coffee', ticker: 'KC', unit: 'per lb', teaser: 'The world\'s second most traded commodity after crude oil.', related: ['sugar', 'cotton', 'wheat'] },
      { slug: 'sugar', name: 'Sugar', ticker: 'SB', unit: 'per lb', teaser: 'Raw sweetener produced from sugarcane and beets on six continents.', related: ['corn', 'coffee', 'wheat'] },
      { slug: 'cotton', name: 'Cotton', ticker: 'CT', unit: 'per lb', teaser: 'Soft fiber that clothes the majority of the world\'s population.', related: ['soybeans', 'corn', 'wheat'] },
      { slug: 'soybeans', name: 'Soybeans', ticker: 'ZS', unit: 'per bushel', teaser: 'Versatile oilseed driving global protein and vegetable oil supply.', related: ['corn', 'wheat', 'cotton'] },
    ],
  },
  {
    id: 'industrial-metals',
    name: 'Industrial Metals',
    icon: '⚙️',
    description: 'Base metals essential to manufacturing, construction, and technology',
    commodities: [
      { slug: 'copper', name: 'Copper', ticker: 'HG', unit: 'per lb', teaser: 'The metal of electrification — essential for wiring, EVs, and renewables.', related: ['aluminum', 'zinc', 'nickel'] },
      { slug: 'aluminum', name: 'Aluminum', ticker: 'ALI', unit: 'per lb', teaser: 'Lightweight metal that transformed aerospace, packaging, and construction.', related: ['copper', 'zinc', 'nickel'] },
      { slug: 'zinc', name: 'Zinc', ticker: 'ZNC', unit: 'per lb', teaser: 'Essential for galvanizing steel and preventing corrosion in infrastructure.', related: ['copper', 'aluminum', 'nickel'] },
      { slug: 'nickel', name: 'Nickel', ticker: 'NI', unit: 'per lb', teaser: 'Key ingredient in stainless steel and lithium-ion battery cathodes.', related: ['copper', 'palladium', 'zinc'] },
    ],
  },
  {
    id: 'livestock',
    name: 'Livestock',
    icon: '🐄',
    description: 'Animal products traded as futures on the CME Group exchanges',
    commodities: [
      { slug: 'live-cattle', name: 'Live Cattle', ticker: 'LE', unit: 'per lb', teaser: 'Futures on beef cattle ready for slaughter, traded on the CME.', related: ['feeder-cattle', 'lean-hogs', 'corn'] },
      { slug: 'lean-hogs', name: 'Lean Hogs', ticker: 'HE', unit: 'per lb', teaser: 'Pork futures reflecting supply of market-weight hogs for processing.', related: ['live-cattle', 'feeder-cattle', 'corn'] },
      { slug: 'feeder-cattle', name: 'Feeder Cattle', ticker: 'GF', unit: 'per lb', teaser: 'Young cattle sold to feedlots for finishing before slaughter.', related: ['live-cattle', 'lean-hogs', 'corn'] },
    ],
  },
]

export function findCategory(id) {
  return categories.find((c) => c.id === id) || null
}

export function findCommodity(slug) {
  for (const cat of categories) {
    const commodity = cat.commodities.find((c) => c.slug === slug)
    if (commodity) return { ...commodity, categoryId: cat.id, categoryName: cat.name }
  }
  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/categories.js
git commit -m "feat: add static commodity data for frontend"
```

---

### Task 9: index.css, App.jsx routing, cleanup

**Files:**
- Replace: `src/index.css`
- Replace: `src/App.jsx`
- Delete: `src/App.css`

- [ ] **Step 1: Replace src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #0a0f1e;
    color: #ffffff;
    font-family: Inter, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
}

@layer utilities {
  .animate-shimmer {
    background: linear-gradient(90deg, #1e2a45 25%, #2a3a55 50%, #1e2a45 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

- [ ] **Step 2: Delete src/App.css**

```bash
rm src/App.css src/assets/react.svg
```

- [ ] **Step 3: Replace src/App.jsx**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CategoryListPage from './pages/CategoryListPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import CommodityDetailPage from './pages/CommodityDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoryListPage />} />
        <Route path="/category/:id" element={<CategoryDetailPage />} />
        <Route path="/commodity/:slug" element={<CommodityDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

Create stub pages so the app doesn't crash:
- `src/pages/CategoryListPage.jsx` → `export default function CategoryListPage() { return <div className="p-8 text-white">Category List</div> }`
- `src/pages/CategoryDetailPage.jsx` → `export default function CategoryDetailPage() { return <div className="p-8 text-white">Category Detail</div> }`
- `src/pages/CommodityDetailPage.jsx` → `export default function CommodityDetailPage() { return <div className="p-8 text-white">Commodity Detail</div> }`

- [ ] **Step 4: Verify app starts and Tailwind loads**

```bash
npm run dev
```

Open http://localhost:5173 — expect navy background, white text "Category List". Stop with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/App.jsx src/pages/
git commit -m "feat: configure Tailwind, routing shell, and stub pages"
```

---

### Task 10: Logo, favicon, and SkeletonCard

**Files:**
- Create: `src/components/Logo.jsx`
- Create: `public/favicon.svg`
- Create: `src/components/SkeletonCard.jsx`

- [ ] **Step 1: Create src/components/Logo.jsx**

```jsx
export default function Logo() {
  return (
    <svg width="220" height="60" viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
      </defs>
      <g transform="translate(10,10)">
        <circle cx="20" cy="20" r="6" fill="url(#logoGold)" />
        <path
          d="M20 26 L12 40 M20 26 L20 42 M20 26 L28 40"
          stroke="#FFD700"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 14 L26 8 L32 12 L40 4"
          fill="none"
          stroke="url(#logoGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polygon points="40,4 36,4 39,1" fill="#FFD700" />
      </g>
      <text
        x="70"
        y="38"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="#FFFFFF"
      >
        Trade<tspan fill="#FFD700">Roots</tspan>
      </text>
    </svg>
  )
}
```

- [ ] **Step 2: Create public/favicon.svg**

```svg
<svg width="32" height="32" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="60" rx="8" fill="#0A0F1E"/>
  <g transform="translate(10,10)">
    <circle cx="20" cy="20" r="6" fill="#FFD700"/>
    <path d="M20 26 L12 40 M20 26 L20 42 M20 26 L28 40" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
    <path d="M20 14 L26 8 L32 12 L40 4" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="40,4 36,4 39,1" fill="#FFD700"/>
  </g>
</svg>
```

- [ ] **Step 3: Update index.html to use the favicon**

In `index.html`, replace the existing favicon link:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 4: Create src/components/SkeletonCard.jsx**

```jsx
export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-surface border border-divider rounded-xl p-5 ${className}`}>
      <div className="flex justify-between mb-3">
        <div className="h-4 w-1/3 rounded animate-shimmer" />
        <div className="h-4 w-10 rounded animate-shimmer" />
      </div>
      <div className="h-7 w-1/2 rounded animate-shimmer mb-1" />
      <div className="h-3 w-1/4 rounded animate-shimmer mb-4" />
      <div className="h-3 w-3/4 rounded animate-shimmer" />
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Logo.jsx src/components/SkeletonCard.jsx public/favicon.svg index.html
git commit -m "feat: add Logo SVG component, favicon, and SkeletonCard"
```

---

## Phase 4 — Screen 1: Category Landing

### Task 11: CategoryCard and CategoryListPage

**Files:**
- Create: `src/components/CategoryCard.jsx`
- Replace: `src/pages/CategoryListPage.jsx`

- [ ] **Step 1: Create src/components/CategoryCard.jsx**

```jsx
import { useNavigate } from 'react-router-dom'

export default function CategoryCard({ category }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/category/${category.id}`)}
      className="bg-surface border border-divider rounded-xl p-6 text-left transition-all duration-200 hover:border-gold hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:-translate-y-0.5 w-full"
    >
      <div className="text-4xl mb-3">{category.icon}</div>
      <h3 className="text-white font-bold text-base mb-2">{category.name}</h3>
      <p className="text-muted text-sm leading-relaxed mb-4">{category.description}</p>
      <span className="bg-divider text-gold text-xs font-bold px-3 py-1 rounded">
        {category.commodities.length} commodities
      </span>
    </button>
  )
}
```

- [ ] **Step 2: Replace src/pages/CategoryListPage.jsx**

```jsx
import Logo from '../components/Logo'
import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/categories'

export default function CategoryListPage() {
  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-divider px-6 py-4 flex items-center justify-between">
        <Logo />
        <span className="text-muted text-sm hidden sm:block">Commodity Education Explorer</span>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">Explore Commodity Markets</h1>
          <p className="text-muted text-sm">
            Select a category to browse commodities and learn how global markets work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Verify Screen 1 in browser**

```bash
npm run dev
```

Open http://localhost:5173. Expect: navy background, TradeRoots logo, five category cards in a grid, gold glow on hover. Test navigation to /category/precious-metals (shows the stub page). Stop with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add src/components/CategoryCard.jsx src/pages/CategoryListPage.jsx
git commit -m "feat: build Screen 1 — category landing page"
```

---

## Phase 5 — Screen 2: Category Detail

### Task 12: CommodityCard and CategoryDetailPage

**Files:**
- Create: `src/components/CommodityCard.jsx`
- Replace: `src/pages/CategoryDetailPage.jsx`

- [ ] **Step 1: Create src/components/CommodityCard.jsx**

```jsx
import { useNavigate } from 'react-router-dom'

export default function CommodityCard({ commodity }) {
  const navigate = useNavigate()
  const isUp = commodity.changeDirection === 'up'
  const hasPrice = commodity.price !== null && commodity.price !== undefined

  return (
    <button
      onClick={() => navigate(`/commodity/${commodity.slug}`)}
      className="bg-surface border border-divider rounded-xl p-5 text-left w-full transition-all duration-200 hover:border-gold/40 hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-white font-bold text-base">{commodity.name}</span>
        <span className="bg-divider text-muted text-xs font-bold px-2 py-0.5 rounded">
          {commodity.ticker}
        </span>
      </div>

      {hasPrice ? (
        <>
          <div className="text-gold text-2xl font-bold">
            ${commodity.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-muted text-xs mt-0.5 mb-2">{commodity.unit}</div>
          {commodity.change !== null && (
            <div className={`flex items-center gap-1.5 text-sm font-bold ${isUp ? 'text-up' : 'text-down'}`}>
              <span>{isUp ? '▲' : '▼'}</span>
              <span>{isUp ? '+' : ''}{commodity.change.toFixed(2)}%</span>
              <span className="text-muted font-normal text-xs">from prev. close</span>
            </div>
          )}
        </>
      ) : (
        <div className="text-amber-400 text-xs mt-1 mb-2">Price data temporarily unavailable</div>
      )}

      <p className="text-muted text-xs leading-relaxed mt-3 pt-3 border-t border-divider">
        {commodity.teaser}
      </p>
    </button>
  )
}
```

- [ ] **Step 2: Replace src/pages/CategoryDetailPage.jsx**

```jsx
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
  }, [id])

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
```

- [ ] **Step 3: Verify Screen 2 end-to-end**

Start both servers:
```bash
cd backend && node src/server.js &
cd .. && npm run dev
```

Open http://localhost:5173, click "Precious Metals". Expect: skeleton cards while loading, then four commodity cards with prices (or "unavailable" if API key not configured). Stop both with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add src/components/CommodityCard.jsx src/pages/CategoryDetailPage.jsx
git commit -m "feat: build Screen 2 — category detail with live prices"
```

---

## Phase 6 — Screen 3: Commodity Detail

### Task 13: PriceChart component

**Files:**
- Create: `src/components/PriceChart.jsx`

- [ ] **Step 1: Create src/components/PriceChart.jsx**

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceChart({ history, direction }) {
  if (!history || history.length === 0) return null

  const color = direction === 'up' ? '#00C896' : '#FF4B4B'
  const data = history.map(({ date, price }) => ({ date: date.slice(5), price }))

  return (
    <div className="bg-surface border border-divider rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Price History</h3>
        <span className="text-xs text-muted italic">Illustrative — for educational purposes</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fill: '#8892A4', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#8892A4', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v.toLocaleString()}`}
            width={75}
          />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid #1e2a45',
              borderRadius: 6,
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(v) => [`$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Price']}
            labelFormatter={(l) => `Date: ${l}`}
          />
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PriceChart.jsx
git commit -m "feat: add PriceChart with Recharts LineChart"
```

---

### Task 14: useCommodity hook

**Files:**
- Create: `src/hooks/useCommodity.js`

- [ ] **Step 1: Create src/hooks/useCommodity.js**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useCommodity.js
git commit -m "feat: add useCommodity hook with session-level cache"
```

---

### Task 15: CommodityDetailPage — Screen 3

**Files:**
- Replace: `src/pages/CommodityDetailPage.jsx`

- [ ] **Step 1: Replace src/pages/CommodityDetailPage.jsx**

```jsx
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import PriceChart from '../components/PriceChart'
import SkeletonCard from '../components/SkeletonCard'
import { useCommodity } from '../hooks/useCommodity'
import { findCommodity } from '../data/categories'

function PriceHeader({ data }) {
  const isUp = data.changeDirection === 'up'
  return (
    <div className="bg-surface border border-divider rounded-xl p-6 mb-4">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-white text-2xl font-bold">{data.name}</h1>
            <span className="bg-divider text-gold text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              {data.category?.replace(/-/g, ' ')}
            </span>
          </div>
          {data.priceUnavailable ? (
            <div className="text-amber-400 text-sm">Price data temporarily unavailable</div>
          ) : (
            <>
              <div className="text-gold text-4xl font-bold">
                ${data.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-muted text-sm mt-1">{data.unit}</div>
              <div className={`flex items-center gap-2 mt-2 text-base font-bold ${isUp ? 'text-up' : 'text-down'}`}>
                <span>{isUp ? '▲' : '▼'}</span>
                <span>{isUp ? '+' : ''}{data.change?.toFixed(2)}%</span>
                <span className="text-muted font-normal text-sm">today</span>
              </div>
            </>
          )}
        </div>
        <div className="text-right">
          <div className="text-muted text-xs">Last updated</div>
          <div className="text-white text-sm">
            {new Date(data.updatedAt).toLocaleString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AISection({ data, onRetry }) {
  if (!data.ai) {
    return (
      <div className="bg-surface border border-divider rounded-xl p-6 text-center">
        <p className="text-muted text-sm mb-3">Descriptions loading…</p>
        <button
          onClick={onRetry}
          className="text-gold text-sm border border-gold/40 rounded px-4 py-1.5 hover:bg-gold/10 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const { ai } = data
  return (
    <>
      {/* What Is It */}
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">What Is It</h3>
        <p className="text-white text-sm leading-relaxed mb-3">{ai.what_it_is}</p>
        <p className="text-muted text-sm leading-relaxed mb-3">
          <span className="text-white font-semibold">Why it matters: </span>{ai.why_it_matters}
        </p>
        <p className="text-muted text-sm leading-relaxed">
          <span className="text-white font-semibold">History: </span>{ai.brief_history}
        </p>
      </div>

      {/* Who Trades It */}
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Who Trades It</h3>
        <div className="flex flex-col gap-3">
          {ai.who_trades_it?.map((participant) => (
            <div key={participant.type} className="bg-navy rounded-lg p-4">
              <div className="text-white text-sm font-bold mb-1">{participant.type}</div>
              <div className="text-muted text-sm leading-relaxed">{participant.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Facts */}
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Key Facts</h3>
        <div className="flex flex-col gap-3">
          {ai.key_facts?.map((fact, i) => (
            <div key={i} className="border-l-2 border-gold pl-4 py-1">
              <p className="text-white text-sm leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Facts */}
      {ai.fun_facts?.length > 0 && (
        <div className="bg-surface border border-divider rounded-xl p-6">
          <h3 className="text-up text-xs font-bold uppercase tracking-widest mb-4">Fun Facts</h3>
          <div className="flex flex-col gap-3">
            {ai.fun_facts.map((fact, i) => (
              <div key={i} className="border-l-2 border-up pl-4 py-1">
                <p className="text-white text-sm leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function RelatedSection({ relatedSlugs }) {
  const navigate = useNavigate()
  if (!relatedSlugs?.length) return null

  return (
    <div className="bg-surface border border-divider rounded-xl p-6">
      <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">Explore Related</h3>
      <div className="flex flex-wrap gap-3">
        {relatedSlugs.map((slug) => {
          const commodity = findCommodity(slug)
          if (!commodity) return null
          return (
            <button
              key={slug}
              onClick={() => navigate(`/commodity/${slug}`)}
              className="bg-divider border border-divider hover:border-gold/50 rounded-lg px-4 py-2 transition-colors"
            >
              <div className="text-white text-sm font-bold">{commodity.name}</div>
              <div className="text-muted text-xs">{commodity.categoryName?.replace(/-/g, ' ')}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function CommodityDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, retry } = useCommodity(slug)

  const commodity = findCommodity(slug)

  if (!commodity) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="text-muted">Commodity not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-divider px-6 py-4">
        <Logo />
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(`/category/${commodity.categoryId}`)}
          className="text-muted text-sm mb-6 hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back to {commodity.categoryName?.replace(/-/g, ' ')}
        </button>

        {error && (
          <div className="bg-surface border border-divider rounded-xl p-4 mb-4 text-amber-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={retry} className="text-gold text-sm border border-gold/40 rounded px-3 py-1 hover:bg-gold/10 transition-colors ml-4">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            <SkeletonCard className="h-36" />
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-48" />
          </div>
        ) : data ? (
          <div className="flex flex-col gap-4">
            <PriceHeader data={data} />
            <PriceChart history={data.history} direction={data.changeDirection} />
            <AISection data={data} onRetry={retry} />
            <RelatedSection relatedSlugs={data.ai?.related_commodities} />
          </div>
        ) : null}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Verify Screen 3 end-to-end**

Start both servers:
```bash
cd backend && node src/server.js &
cd .. && npm run dev
```

Navigate: Home → Precious Metals → Gold. Expect:
- Skeleton cards while loading
- Price header with gold price, change indicator
- Recharts line chart with "Illustrative" disclaimer
- What Is It, Who Trades It, Key Facts, Fun Facts sections (Claude-generated)
- Related commodity chips

If `ANTHROPIC_API_KEY` is not set yet, the AI sections will show the Retry button — that's correct behavior.

- [ ] **Step 3: Test back navigation and related chips**

Click "← Back to Precious Metals" → should return to Screen 2.
Click a related commodity chip → should navigate to that commodity's Screen 3.
Use the browser back button → should work correctly via React Router history.

- [ ] **Step 4: Commit**

```bash
git add src/pages/CommodityDetailPage.jsx
git commit -m "feat: build Screen 3 — commodity detail with AI content and price chart"
```

---

## Phase 7 — Polish and Verification

### Task 16: ESLint + Prettier pass

**Files:**
- Possibly modify many files to fix lint/format issues

- [ ] **Step 1: Run Prettier on all frontend source files**

```bash
npx prettier --write "src/**/*.{js,jsx,css}"
```

Expected: files reformatted (or "X files unchanged" if already clean).

- [ ] **Step 2: Run ESLint and fix any errors**

```bash
npm run lint
```

If errors appear, fix them (common: unused imports, missing keys in `.map()`, etc.).

- [ ] **Step 3: Verify frontend builds cleanly**

```bash
npm run build
```

Expected: `dist/` created with no build errors.

- [ ] **Step 4: Run backend tests one final time**

```bash
cd backend && npx jest --testPathPattern=test/ --verbose
```

Expected: 12 tests pass.

- [ ] **Step 5: Full smoke test — all three screens with both servers running**

```bash
cd backend && node src/server.js &
cd .. && npm run dev
```

Checklist:
- [ ] Screen 1 loads with 5 category cards, gold hover glow works
- [ ] Screen 2 shows skeleton → commodity cards with prices
- [ ] Screen 3 shows skeleton → price header, chart, AI sections, related chips
- [ ] Back buttons work on both Screen 2 and Screen 3
- [ ] Related chips on Screen 3 navigate to correct commodities
- [ ] Visiting a commodity a second time loads instantly (cache hit — no network request in browser DevTools)
- [ ] Mobile layout correct at 375px width (1-column grids)

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: ESLint and Prettier pass, production build verified"
```

---

## Prerequisites Checklist

Before running end-to-end:

1. **API Ninjas key**: Sign up at https://api-ninjas.com (free tier), get your key, add to `backend/.env` as `API_NINJAS_KEY=...`
2. **Anthropic API key**: Get from https://console.anthropic.com, add to `backend/.env` as `ANTHROPIC_API_KEY=sk-ant-...`
3. **Verify API Ninjas commodity names**: Test a few slugs manually:
   ```bash
   curl "https://api.api-ninjas.com/v1/commodityprice?name=gold" -H "X-Api-Key: YOUR_KEY"
   ```
   If any commodity name doesn't return data, update `apiKey` in `backend/src/data/categories.js`.

## Deployment Notes (after local verification)

**Vercel (frontend):**
- Connect repo, set root directory to `.` (repo root)
- Add env var: `VITE_API_URL=https://your-railway-backend-url`

**Railway (backend):**
- Connect repo, set root directory to `backend/`
- Start command: `node src/server.js`
- Add env vars: `ANTHROPIC_API_KEY`, `API_NINJAS_KEY`, `FRONTEND_URL=https://your-vercel-url`
