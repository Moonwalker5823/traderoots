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
            </>
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
          <span className="text-white font-semibold">Why it matters: </span>
          {ai.why_it_matters}
        </p>
        <p className="text-muted text-sm leading-relaxed">
          <span className="text-white font-semibold">History: </span>
          {ai.brief_history}
        </p>
      </div>

      {/* Who Trades It */}
      <div className="bg-surface border border-divider rounded-xl p-6">
        <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-4">
          Who Trades It
        </h3>
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
            <AISection data={data} onRetry={retry} />
            <RelatedSection relatedSlugs={data.ai?.related_commodities} />
          </div>
        ) : null}
      </main>
    </div>
  )
}
