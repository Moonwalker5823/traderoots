import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CategoryListPage from './pages/CategoryListPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import CommodityDetailPage from './pages/CommodityDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoryListPage />} />
        <Route path="/category/:id" element={<CategoryDetailPage />} />
        <Route path="/commodity/:slug" element={<CommodityDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
