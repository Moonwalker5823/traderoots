# History of the Trade — Design Spec

**Date:** 2026-05-02  
**Status:** Approved

## Problem

The CategoryListPage and CategoryDetailPage are educationally thin — they show categories and prices but give users no historical context about commodity trading. Users with no background have no entry point into how global commodity markets evolved before they start browsing.

## Solution

Two additions:

1. **CategoryListPage** — A general "History of the Trade" section below the category grid. One AI fetch covers the entire history of commodity trading.
2. **CategoryDetailPage** — A per-category "History of [Category] Trading" section below the commodity grid. One AI fetch per category (5 total), each covering that category's specific trading history.

Both use the same deferred reveal pattern: fetch starts on page load, teaser card + gold button shown while it runs, content revealed on click.

## Architecture

### CategoryListPage

```
Page load
  └── GET /api/history → Claude (3–8s cold, instant from server cache)
        └── loading=true → TradeHistoryTeaser + CTA button
              user browses category grid (~natural dwell)
              fetch completes → loading=false
              user clicks → content revealed + smooth-scroll
```

### CategoryDetailPage

```
Page load
  └── GET /api/category/:id/history → Claude (3–8s cold, cached per category)
        └── loading=true → CategoryHistoryTeaser + CTA button
              user browses commodity grid (~natural dwell)
              fetch completes → loading=false
              user clicks → content revealed + smooth-scroll
```

**Backend cache:** Server-side `Map` in `commodity.js`. One Claude call per unique request per server session, shared across all users.

**Frontend cache:** Module-level cache objects (`historyCache`, `categoryHistoryCache`) in their respective page files. Navigating away and back does not re-fetch within the same session.

## Claude Content Schemas

### `GET /api/history`
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

### `GET /api/category/:id/history`
```json
{
  "history": {
    "overview": "2–3 sentence intro to this category's trading history",
    "origins": "paragraph on how this category of commodities came to be traded",
    "key_milestones": ["milestone 1", "milestone 2", "milestone 3"],
    "modern_landscape": "how this category is traded today",
    "fun_fact": "one surprising fact about this category's trading history"
  }
}
```

## Components

### CategoryListPage additions (all inline, no new files)

**`useTradeHistory()` hook** — Fetches `GET /api/history` on mount. Module-level `historyCache` for session persistence. Returns `{ data, loading, error }`.

**`TradeHistoryTeaser`** — Static preview card, three rows:
- 🏛️ **Ancient origins** — Mesopotamia to medieval trade routes
- 📈 **Rise of exchanges** — How futures markets were born
- 🌐 **Modern global markets** — Electronic trading and today's landscape

**`TradeHistoryContent`** — Revealed content: overview card, ancient origins card, rise of exchanges card, modern markets card, fun fact card (gold accent).

**Reveal logic** — `revealed` state + `hasScrolled` ref + `contentRef` + `useEffect([revealed, loading])`. Same three-state button pattern as `CommodityDetailPage`.

### CategoryDetailPage additions (all inline, no new files)

**`useCategoryHistory(id)` hook** — Fetches `GET /api/category/:id/history` on mount, keyed by `id`. Module-level `categoryHistoryCache` for session persistence. Resets on `id` change. Returns `{ data, loading, error }`.

**`CategoryHistoryTeaser`** — Static preview card, three rows:
- 📜 **Origins** — How this market first emerged
- 🏗️ **Key milestones** — Defining moments in this category's history
- 🌍 **Today's landscape** — How it's traded in modern markets

**`CategoryHistoryContent`** — Revealed content: overview card, origins card, key milestones card (bullet list), modern landscape card, fun fact card (gold accent).

**Reveal logic** — Same `revealed` / `hasScrolled` / `contentRef` pattern, independent from `CategoryDetailPage`'s existing price-data state.

## Page Layouts

### CategoryListPage
```
Header (Logo)
  Page title + subtitle
  Category grid (5 tiles, 2-column, unchanged)
  TradeHistoryTeaser + CTA button        ← new
  [TradeHistoryContent on reveal]        ← new
```

### CategoryDetailPage
```
Header (Logo)
  Back button
  Category icon + name + description
  Commodity grid (unchanged)
  CategoryHistoryTeaser + CTA button     ← new
  [CategoryHistoryContent on reveal]     ← new
```

## Error Handling

Both history sections fail silently — if the fetch errors, the teaser card and button are hidden and the rest of the page is unaffected. History is supplementary content; a fetch failure should never degrade the primary experience.

## Changes Required

| File | Change |
|---|---|
| `backend/src/routes/commodity.js` | Add `GET /api/history` + `GET /api/category/:id/history` routes with server-side caches |
| `backend/src/services/claudeService.js` | Add `getTradeHistory()` and `getCategoryHistory(name, description)` functions |
| `src/pages/CategoryListPage.jsx` | Add `useTradeHistory` hook + `TradeHistoryTeaser` + `TradeHistoryContent` + reveal logic |
| `src/pages/CategoryDetailPage.jsx` | Add `useCategoryHistory` hook + `CategoryHistoryTeaser` + `CategoryHistoryContent` + reveal logic |

## Out of Scope

- localStorage persistence across sessions
- Retry button on error
- Any changes to CategoryCard, CommodityDetailPage, or other existing components
