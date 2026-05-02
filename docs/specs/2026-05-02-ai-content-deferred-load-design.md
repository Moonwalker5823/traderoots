# AI Content Deferred Load — Design Spec

**Date:** 2026-05-02  
**Status:** Approved

## Problem

The commodity detail page's AI educational content (`/api/commodity/:slug/ai`) takes 3–8 seconds on a cold first hit (no server cache). The current UX shows skeleton cards and a "Loading educational content…" message, which makes the wait feel broken and unresolved.

## Solution

Replace the skeleton loading state with a **teaser card + CTA button** pattern. The AI fetch still starts immediately on page load, but instead of blank skeletons the user sees a defined card previewing the content sections. A gold "View Educational Content" button sits at the bottom of the viewport. By the time the user reads the price header and chart and clicks the button, the fetch is typically complete.

This is a pure frontend change — no backend or hook modifications required.

## Architecture

The `useCommodity` hook already fires both fetches in parallel on page load. `aiLoading` tracks whether the AI fetch is in progress; `data.ai` holds the result. These are used as-is.

```
Page load
  ├── /api/commodity/:slug     → price data (~200ms)
  │     └── renders PriceHeader + PriceChart immediately
  └── /api/commodity/:slug/ai  → AI data (3–8s cold)
        └── aiLoading=true → show AITeaserCard + CTA button
              user reads price/chart (~10–20s natural dwell)
              fetch completes → aiLoading=false
              user clicks button → AI sections revealed + scroll
```

## Components

### AITeaserCard

A new component rendered during `aiLoading`. Replaces the existing skeleton cards.

- Gold left border, same `bg-surface` / `border-divider` styling as other cards
- Three rows, each with a small icon tile and two lines of text:
  - 📖 **What it is & why it matters** — Origin, global role, and history
  - 🏭 **Who trades it** — Producers, buyers, investors
  - 💡 **Key & fun facts** — Market insights and curiosities
- No interactivity — purely a preview of coming content

### CTA Button

Rendered below `AITeaserCard`, naturally landing at the bottom of the visible viewport.

**Three states:**

| State | Condition | Button appearance | Hint text |
|---|---|---|---|
| Idle | `aiLoading && !clicked` | Enabled gold, "View Educational Content ↓" | "Preparing content in the background…" |
| Loading | `clicked && aiLoading` | Spinner + "Loading…", disabled | Hidden |
| Ready | `!aiLoading && !clicked` | Enabled gold, "View Educational Content ↓" | Hidden (content is ready, no wait) |

On click when `!aiLoading`: unmount the teaser card + button entirely, render the AI sections in their place, and smooth-scroll to the first section ("What Is It").  
On click when `aiLoading`: set `clicked=true`, disable the button (spinner state), wait for fetch to complete, then unmount teaser + button and render AI sections + scroll.

## Changes Required

| File | Change |
|---|---|
| `src/pages/CommodityDetailPage.jsx` | Add `AITeaserCard` component; replace `aiLoading` skeleton block with teaser card + CTA button; add click state + scroll-to-content logic |
| `src/hooks/useCommodity.js` | No changes |
| `backend/` | No changes |

## Out of Scope

- Hover-based prefetch on the category page
- Server-Sent Events / streaming
- Any changes to the price/chart loading path
- Persistent cross-session caching (server cache already handles repeat visits)
