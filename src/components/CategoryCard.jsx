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
