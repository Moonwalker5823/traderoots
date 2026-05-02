import { useState, useEffect, useRef } from 'react'
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
          <div className="text-gold text-4xl font-bold">
            ${data.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-muted text-sm mt-1">{data.unit}</div>
          {!data.priceUnavailable && data.change !== null && (
            <div
              className={`flex items-center gap-2 mt-2 text-base font-bold ${isUp ? 'text-up' : 'text-down'}`}
            >
              <span>{isUp ? '▲' : '▼'}</span>
              <span>
                {isUp ? '+' : ''}
                {data.change.toFixed(2)}%
              </span>
              <span className="text-muted font-normal text-sm">today</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-muted text-xs">Last updated</div>
          <div className="text-white text-sm">
            {new Date(data.updatedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function CollapsibleSection({ title, titleColor = 'text-gold', children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-surface border border-divider rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <span className={`${titleColor} text-xs font-bold uppercase tracking-widest`}>{title}</span>
        <span className="text-muted text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
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
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">What Is It</h3>
        <p className="text-white text-sm leading-relaxed mb-3">{ai.what_it_is}</p>
        <p className="text-muted text-sm leading-relaxed mb-3">
          <span className="text-white font-semibold">Why it matters: </span>
          {ai.why_it_matters}
        </p>
        <p className="text-muted text-sm leading-relaxed">
          <span className="text-white font-semibold">History: </span>
          {ai.brief_history}
        </p>
      </div>

      <CollapsibleSection title="Who Trades It">
        <div className="flex flex-col gap-3">
          {ai.who_trades_it?.map((participant) => (
            <div key={participant.type} className="bg-navy rounded-lg p-4">
              <div className="text-white text-sm font-bold mb-1">{participant.type}</div>
              <div className="text-muted text-sm leading-relaxed">{participant.description}</div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Key Facts">
        <div className="flex flex-col gap-3">
          {ai.key_facts?.map((fact, i) => (
            <div key={i} className="border-l-2 border-gold pl-4 py-1">
              <p className="text-white text-sm leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {ai.fun_facts?.length > 0 && (
        <CollapsibleSection title="Fun Facts" titleColor="text-up">
          <div className="flex flex-col gap-3">
            {ai.fun_facts.map((fact, i) => (
              <div key={i} className="border-l-2 border-up pl-4 py-1">
                <p className="text-white text-sm leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </>
  )
}

function RelatedSection({ relatedSlugs }) {
  const navigate = useNavigate()
  if (!relatedSlugs?.length) return null

  return (
    <div className="bg-surface border border-divider rounded-xl p-6">
      <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">
        Explore Related
      </h3>
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

function AITeaserCard() {
  return (
    <div className="bg-surface border border-divider rounded-xl p-6">
      <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-5">
        About This Commodity
      </h3>
      <div className="flex flex-col gap-4">
        {[
          { icon: '📖', title: 'What it is & why it matters', sub: 'Origin, global role, and history' },
          { icon: '🏭', title: 'Who trades it', sub: 'Producers, buyers, investors' },
          { icon: '💡', title: 'Key & fun facts', sub: 'Market insights and curiosities' },
        ].map(({ icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center text-base flex-shrink-0">
              {icon}
            </div>
            <div>
              <div className="text-white text-sm font-semibold">{title}</div>
              <div className="text-muted text-xs">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CommodityDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data, loading, aiLoading, error, retry } = useCommodity(slug)

  const commodity = findCommodity(slug)
  const [revealed, setRevealed] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (revealed && !aiLoading && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [revealed, aiLoading])

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
          className="text-lg mb-6 hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back to {commodity.categoryName?.replace(/-/g, ' ')}
        </button>

        {error && (
          <div className="bg-surface border border-divider rounded-xl p-4 mb-4 text-amber-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={retry}
              className="text-gold text-sm border border-gold/40 rounded px-3 py-1 hover:bg-gold/10 transition-colors ml-4"
            >
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
            {!revealed ? (
              <>
                <AITeaserCard />
                <div>
                  <button
                    onClick={() => setRevealed(true)}
                    className="w-full bg-gold text-navy font-bold text-sm tracking-wide py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors"
                  >
                    View Educational Content ↓
                  </button>
                  {aiLoading && (
                    <p className="text-muted text-xs text-center mt-2">
                      Preparing content in the background…
                    </p>
                  )}
                </div>
              </>
            ) : aiLoading ? (
              <div className="bg-surface border border-divider rounded-xl p-6 flex items-center justify-center gap-3">
                <span className="animate-spin inline-block w-5 h-5 border-2 border-divider border-t-gold rounded-full" />
                <span className="text-muted text-sm">Loading content…</span>
              </div>
            ) : (
              <div ref={contentRef} className="flex flex-col gap-4">
                <AISection data={data} onRetry={retry} />
                <RelatedSection relatedSlugs={data.ai?.related_commodities} />
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  )
}
