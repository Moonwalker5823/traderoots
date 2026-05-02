# TradeRoots

An educational commodity market explorer. Browse live prices across five commodity categories, view simulated price history charts, and read AI-generated explainers covering what each commodity is, who trades it, and why it matters.

---

## Features

- **Category browser** — Precious Metals, Energy, Agriculture, Industrial Metals, Livestock
- **Live prices** — fetched from the API Ninjas commodities API
- **Price history charts** — 30-day simulated history with directional color coding
- **AI educational content** — plain-English explainers, key facts, fun facts, and related commodities
- **Fast load** — price and chart appear within ~200ms; educational content streams in after
- **Session caching** — AI content cached server-side and client-side to avoid repeat API calls

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Charts | Recharts |
| Backend | Node.js, Express |
| AI content | Anthropic API |
| Price data | API Ninjas |

---

## Local Setup

### Prerequisites

1. **API Ninjas key** — sign up at [api-ninjas.com](https://api-ninjas.com) (free tier)
2. **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

### Install

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### Configure

Copy the example env files and fill in your keys:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

`.env`:
```
VITE_API_URL=http://localhost:3001
```

`backend/.env`:
```
ANTHROPIC_API_KEY=your_key_here
API_NINJAS_KEY=your_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Run

```bash
# Terminal 1 — backend
cd backend && node src/server.js

# Terminal 2 — frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deployment

**Frontend → Vercel**
- Build command: `npm run build`
- Output: `dist/`
- Environment variable: `VITE_API_URL=https://your-railway-backend-url`

**Backend → Railway**
- Root directory: `backend/`
- Start command: `node src/server.js`
- Environment variables: `ANTHROPIC_API_KEY`, `API_NINJAS_KEY`, `FRONTEND_URL`

---

## Project Structure

```
traderoots/
├── src/
│   ├── components/     # CategoryCard, CommodityCard, PriceChart, SkeletonCard, Logo
│   ├── pages/          # CategoryListPage, CategoryDetailPage, CommodityDetailPage
│   ├── hooks/          # useCommodity — fetch + cache hook
│   └── data/           # Static category and commodity definitions
└── backend/
    └── src/
        ├── routes/     # /api/category/:id/prices, /api/commodity/:slug, /api/commodity/:slug/ai
        └── services/   # priceService, historyService, claudeService
```
