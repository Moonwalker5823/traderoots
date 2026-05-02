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
