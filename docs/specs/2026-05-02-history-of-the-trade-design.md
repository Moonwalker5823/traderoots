# History of the Trade — Design Spec

**Date:** 2026-05-02  
**Status:** Approved

## Problem

The CategoryListPage is fully static — it shows category tiles but offers no educational context about commodity trading as a whole. Users with no background have no entry point into the history and mechanics of global commodity markets before they start browsing.

## Solution

Add a "History of the Trade" section below the category grid on the CategoryListPage. A teaser card previews the three content sections. A gold "View History of the Trade" button reveals the full content when clicked. The AI fetch starts immediately on page load so the content is ready (or nearly ready) by the time the user scrolls down and clicks.

## Architecture

```
Page load
  └── GET /api/history → Claude (3–8s cold, instant from server cache)
        └── loading=true → show TradeHistoryTeaser + CTA button
              user browses category grid
              fetch completes → loading=false
              user clicks button → content revealed + smooth-scroll
```

**Backend cache:** Server-side `Map` in `commodity.js` (same pattern as commodity AI cache). One Claude call per server session, shared across all users.

**Frontend cache:** Module-level `historyCache` object in `CategoryListPage.jsx` (same session-cache pattern as `useCommodity`). Navigating away and back does not re-fetch.

## Claude Content Schema

`GET /api/history` returns:

```json
{
  "history": {
    "overview": "2–3 sentence intro to commodity trading",
    "ancient_origins": "paragraph on earliest commodity trade",
    "rise_of_exchanges": "paragraph on how organized futures markets emerged",
    "modern_markets": "paragraph on electronic trading and today's landscape",
    "fun_fact": "one surprising historical fact"
  }
}
```

## Components

All new code lives in `src/pages/CategoryListPage.jsx` (no new files).

### `useTradeHistory()` hook

Fetches `GET /api/history` on mount. Uses a module-level `historyCache` object for session persistence. Returns `{ data, loading, error }`.

### `TradeHistoryTeaser`

Static preview card shown before reveal. Three rows:
- 🏛️ **Ancient origins** — Mesopotamia to medieval trade routes
- 📈 **Rise of exchanges** — How futures markets were born
- 🌐 **Modern global markets** — Electronic trading and today's landscape

Same `bg-surface` / `border-divider` / `text-gold` styling as `AITeaserCard`.

### `TradeHistoryContent`

Revealed content. Four cards:
1. Overview paragraph
2. Ancient Origins paragraph
3. Rise of Exchanges paragraph
4. Modern Markets paragraph + Fun Fact (gold accent)

### CTA Button & Reveal Logic (inside `CategoryListPage`)

Same three-state pattern as commodity detail:

| State | Condition | Appearance |
|---|---|---|
| Idle | `!revealed && loading` | Gold button + hint "Preparing content in the background…" |
| Loading | `revealed && loading` | Spinner card "Loading content…" |
| Ready | `!revealed && !loading` | Gold button, no hint |

On click: set `revealed=true`. `useEffect([revealed, loading])` smooth-scrolls `contentRef` into view once both are true. `hasScrolled` ref prevents re-scroll.

## Page Layout

```
Header (Logo)
  Page title + subtitle
  Category grid (5 tiles, 2-column, unchanged)
  TradeHistoryTeaser + CTA button   ← new
  [TradeHistoryContent on reveal]   ← new
```

## Error Handling

If `GET /api/history` fails, the teaser card and button are hidden and no error is shown — the rest of the page is unaffected. Silent failure is appropriate here since history is supplementary content.

## Changes Required

| File | Change |
|---|---|
| `backend/src/routes/commodity.js` | Add `GET /api/history` route + server-side cache entry |
| `backend/src/services/claudeService.js` | Add `getTradeHistory()` function with system prompt |
| `src/pages/CategoryListPage.jsx` | Add `useTradeHistory` hook + `TradeHistoryTeaser` + `TradeHistoryContent` components + reveal logic |

## Out of Scope

- Per-category history (deferred to a future spec)
- localStorage persistence across sessions
- Retry button on error
- Any changes to CategoryDetailPage, CategoryCard, or other existing components
