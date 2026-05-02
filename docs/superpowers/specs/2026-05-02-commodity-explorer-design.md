# Commodity Explorer — Design Spec

**Date:** 2026-05-02  
**Project:** TradeRoots — Commodity Education Explorer  
**Status:** Approved

---

## Overview

A clean, educational commodity browsing tool. Users navigate three screens: a category landing page, a category detail page showing live prices, and a commodity detail page with AI-generated educational content. No trading, no accounts, no transactions.

---

## Repository Structure

The existing Vite + React project at the repo root becomes the frontend. A `/backend` subfolder holds the Express API. Both are deployed separately (Vercel for frontend, Railway for backend).

```
traderoots/                        ← repo root
├── index.html
├── vite.config.js
├── package.json                   ← frontend deps
├── eslint.config.js
├── public/
│   └── favicon.svg                ← SVG icon (roots + arrow)
├── src/
│   ├── main.jsx
│   ├── App.jsx                    ← React Router root
│   ├── index.css                  ← root styles only
│   ├── components/
│   │   ├── CategoryCard.jsx
│   │   ├── CommodityCard.jsx
│   │   ├── PriceChart.jsx
│   │   ├── SkeletonCard.jsx
│   │   └── Logo.jsx               ← SVG logo component
│   ├── pages/
│   │   ├── CategoryListPage.jsx
│   │   ├── CategoryDetailPage.jsx
│   │   └── CommodityDetailPage.jsx
│   ├── hooks/
│   │   └── useCommodity.js        ← fetch + cache hook
│   └── data/
│       └── categories.js          ← static category/commodity definitions
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   └── commodity.js
│   │   └── services/
│   │       ├── priceService.js    ← API Ninjas fetch + fallback
│   │       ├── historyService.js  ← simulated price history generator
│   │       └── claudeService.js   ← Anthropic SDK + prompt
│   └── test/
│       └── commodity.test.js
├── docs/
│   └── superpowers/specs/
│       └── 2026-05-02-commodity-explorer-design.md
└── .gitignore
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Charts | Recharts |
| Backend | Node.js, Express |
| AI | Anthropic SDK (`claude-sonnet-4-6`) |
| Price data | API Ninjas commodities API (free tier) |
| Frontend deploy | Vercel |
| Backend deploy | Railway |

---

## Environment Variables

**Root `.env` (frontend, Vite-prefixed):**
```
VITE_API_URL=http://localhost:3001
```

**`backend/.env`:**
```
ANTHROPIC_API_KEY=sk-ant-...
API_NINJAS_KEY=...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Both `.env` files are git-ignored. Vercel and Railway receive these as platform environment variables at deploy time.

**Prerequisites before running locally:**
1. Sign up at api-ninjas.com (free tier) to get `API_NINJAS_KEY`
2. Obtain `ANTHROPIC_API_KEY` from console.anthropic.com

---

## Commodity Data

Defined as static data in `src/data/categories.js`. No database needed.

| Category | Commodities | Icon |
|---|---|---|
| Precious Metals | Gold, Silver, Platinum, Palladium | 🥇 |
| Energy | Crude Oil, Natural Gas, Gasoline, Heating Oil | ⚡ |
| Agriculture | Wheat, Corn, Coffee, Sugar, Cotton, Soybeans | 🌾 |
| Industrial Metals | Copper, Aluminum, Zinc, Nickel | ⚙️ |
| Livestock | Live Cattle, Lean Hogs, Feeder Cattle | 🐄 |

Each commodity entry includes: display name, API Ninjas lookup key, unit label (e.g. "per troy oz"), ticker symbol, one-line teaser, and related commodity names.

---

## Screens

### Screen 1 — Category Landing (`/`)

- App header with TradeRoots SVG logo and tagline
- 5 category cards in a responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
- Each card: emoji icon, category name, one-line description, commodity count badge
- Hover state: gold border glow + subtle lift (`box-shadow`, `translateY(-2px)`)
- Click navigates to `/category/:id`

### Screen 2 — Category Detail (`/category/:id`)

- Back button → `/`
- Category header: emoji, name, description
- Grid of commodity cards (2-col desktop, 1-col mobile)
- Each card: name, ticker badge, current price (gold), unit, price change (green ▲ / red ▼ with %), one-line teaser
- Prices fetched from `GET /api/category/:id/prices` on mount
- Skeleton cards shown during fetch
- Click navigates to `/commodity/:name`

### Screen 3 — Commodity Detail (`/commodity/:name`)

- Back button → `/category/:id`
- **Section A — Price Header:** commodity name, category badge, current price (large, gold), absolute + % change (green/red), unit, last updated timestamp
- **Section B — Price Chart:** Recharts `LineChart`, 30 simulated data points, line color matches price direction (green if up, red if down), "Illustrative — for educational purposes" disclaimer, hidden entirely if no data
- **Section C — What Is It:** Claude-generated plain-English explanation (what + where from), why it matters globally, brief trading history
- **Section D — Who Trades It:** Claude-generated participant breakdown rendered as cards — Producers, Commercial Buyers, Institutions, Individual Investors
- **Section E — Key Facts:** 3–5 Claude-generated significant facts displayed as left-gold-bordered cards
- **Section F — Fun Facts:** 3 Claude-generated surprising/quirky facts displayed as left-green-bordered cards (`border-up`)
- **Section G — Related Commodities:** 3 clickable chips navigating directly to `/commodity/:name`

All data for Screen 3 arrives in a single API response. Skeleton loaders shown for each section during fetch.

---

## Backend API

### `GET /api/category/:id/prices`

Fetches current price for every commodity in the category in parallel via API Ninjas. Returns:

```json
{
  "categoryId": "precious-metals",
  "commodities": [
    {
      "name": "Gold",
      "slug": "gold",
      "price": 1923.40,
      "unit": "per troy oz",
      "ticker": "XAU",
      "change": 0.42,
      "changeDirection": "up",
      "teaser": "The world's most recognized store of value."
    }
  ]
}
```

### `GET /api/commodity/:name`

Runs three operations in parallel via `Promise.all`:
1. `priceService` — fetches current price from API Ninjas
2. `historyService` — generates 30 simulated daily price points
3. `claudeService` — calls Claude API, returns structured JSON

Returns unified payload:

```json
{
  "name": "Gold",
  "slug": "gold",
  "category": "precious-metals",
  "price": 1923.40,
  "unit": "per troy oz",
  "ticker": "XAU",
  "change": 0.42,
  "changeDirection": "up",
  "updatedAt": "2026-05-02T15:42:00Z",
  "history": [
    { "date": "2026-04-02", "price": 1880.00 }
  ],
  "ai": {
    "what_it_is": "...",
    "why_it_matters": "...",
    "brief_history": "...",
    "who_trades_it": [
      { "type": "Producers", "description": "..." }
    ],
    "key_facts": ["...", "...", "..."],
    "fun_facts": ["...", "...", "..."],
    "related_commodities": ["silver", "platinum", "copper"]
  }
}
```

### `GET /health`

Returns `200 OK` for Railway health checks.

---

## History Service

`historyService.js` generates simulated price history seeded by commodity slug + current date (deterministic within a single day, varies day-to-day). Uses the current live price as the endpoint and walks backward 30 days applying bounded random daily moves (±1.5% max). Labeled "Illustrative — for educational purposes" in the UI.

**Price change derivation:** API Ninjas free tier returns current price only — no previous close. The `change` and `changeDirection` fields are computed from the last two points in the generated history array (today vs. yesterday). This keeps the change indicator consistent with the chart.

---

## Claude Integration

Single API call per commodity. Model: `claude-sonnet-4-6`.

System prompt instructs Claude to return only valid JSON matching the `ai` schema above. Tone: educational, approachable, no unexplained jargon. No markdown, no preamble.

Responses cached client-side in `useCommodity` hook via a `useRef` map keyed by commodity slug. Revisiting the same commodity within a session skips the API call.

---

## Error Handling

| Failure | Behavior |
|---|---|
| API Ninjas unavailable / no data | Show "—" for price with amber "Price data temporarily unavailable" badge; hide change indicator |
| Claude timeout / error | Render price + chart; AI sections show "Descriptions loading…" with Retry button |
| No history data | Omit chart section entirely — no empty axes, no error state |
| Network down | Human-readable message; never raw error objects |

---

## UI Design

**Color palette:**

| Token | Hex | Usage |
|---|---|---|
| Background | `#0A0F1E` | Page background |
| Surface | `#111827` | Cards, panels |
| Border | `#1e2a45` | Card borders, dividers |
| Gold | `#FFD700` | Primary accent, prices, headings |
| Gold dark | `#C9A227` | Gradient endpoint in logo |
| White | `#FFFFFF` | Primary text |
| Muted | `#8892A4` | Secondary text, labels |
| Green | `#00C896` | Price increase |
| Red | `#FF4B4B` | Price decrease |

**Logo:** SVG embedded directly in `Logo.jsx`. Icon portion (roots + upward trade arrow) used as `public/favicon.svg`.

**Typography:** Inter (system font stack fallback). Category labels in uppercase with letter-spacing.

**Loading states:** Shimmer skeleton cards (`background: linear-gradient` animated) for all async sections.

**Responsive:** Mobile-first. Category grid: 1-col (mobile) → 2-col (tablet) → 3-col (desktop). Commodity grid: 1-col → 2-col.

---

## Code Standards

- Tailwind CSS for all styling (no inline styles in production code)
- Prettier enforced on every file
- ESLint must pass with zero errors
- `index.css` for root styles only (CSS custom properties, base resets)
- All backend test files in `backend/test/`
- No comments unless the WHY is non-obvious
- Model: `claude-sonnet-4-6` (not `claude-sonnet-4-20250514`)
- Do not push to git without explicit user approval

---

## Deployment

**Frontend (Vercel):**
- Build command: `npm run build`
- Output: `dist/`
- Environment variable: `VITE_API_URL=https://your-railway-url`

**Backend (Railway):**
- Start command: `node src/server.js`
- Environment variables: `ANTHROPIC_API_KEY`, `API_NINJAS_KEY`, `FRONTEND_URL`
- Health check: `GET /health`
