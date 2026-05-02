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
