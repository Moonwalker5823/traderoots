import Logo from '../components/Logo'
import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/categories'

export default function CategoryListPage() {
  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-divider px-6 py-4 flex items-center justify-between">
        <Logo />
        <span className="text-muted text-sm hidden sm:block">Commodity Education Explorer</span>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">Explore Commodity Markets</h1>
          <p className="text-muted text-sm">
            Select a category to browse commodities and learn how global markets work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </main>
    </div>
  )
}
