import { useState, useEffect } from 'react'
import { getPosts, getCategories } from '../api'
import Loader from '../components/Loader'
import TicketCard from '../components/TicketCard'
import FilterSection from '../components/FilterSection'
import Icon from '../components/Icon'

export default function Marketplace() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 10, max: 10000 })

  useEffect(() => {
    fetchMarketplaceData()
  }, [])

  const fetchMarketplaceData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [postsResult, categoriesResult] = await Promise.all([
        getPosts(),
        getCategories()
      ])

      const parsedPosts = postsResult.data !== undefined ? postsResult.data : postsResult
      const parsedCategories = categoriesResult.data !== undefined ? categoriesResult.data : categoriesResult

      setPosts(Array.isArray(parsedPosts) ? parsedPosts : [parsedPosts])
      setCategories(Array.isArray(parsedCategories) ? parsedCategories : [parsedCategories])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post?.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post?.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const postCategoryName = getCategoryName(post.category_id)
    const matchesCategory =
      selectedCategory === "" || String(postCategoryName).toLowerCase() === String(selectedCategory).toLowerCase()

    const matchesStatus =
      selectedStatus === "" || String(post.status).toLowerCase() === selectedStatus.toLowerCase()

    const rawPrice = post.price ?? post.amount
    const hasPrice = rawPrice !== undefined && rawPrice !== null && rawPrice !== ''
    const price = Number(rawPrice)
    const matchesPrice = !hasPrice || (price >= Number(priceRange.min) && price <= Number(priceRange.max))
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice
  })

  function getCategoryName(categoryId) {
    const category = categories.find(cat => String(cat.id) === String(categoryId))
    return category ? category.name : `Categoría ${categoryId}`
  }

  return (
    <div className="page" id="page-marketplace">
      <div className="container">
        <header className="header fade-in marketplace-header" style={{ marginBottom: 12 }}>
          <div>
            <h1 className="header__title">Marketplace</h1>
          </div>
        </header>

        <div className="market-layout fade-in" style={{ display: 'grid', gap: '16px' }}>
          <div className="market-results">
            <div className="search-bar" style={{ display: 'grid', gap: '12px' }}>
              <div className="market-search-wrap">
                <span className="market-search-icon"><Icon name="search" className="w-4 h-4" /></span>
                <input
                  type="text"
                  className="input"
                  placeholder="Buscar servicios/productos/usuarios"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="input"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="published">Publicado</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="market-filters">
              <FilterSection categories={categories} onApply={({ category, minPrice, maxPrice }) => {
                setSelectedCategory(category || '')
                setPriceRange({ min: Number(minPrice || 10), max: Number(maxPrice || 10000) })
              }} initialCategory={selectedCategory} initialMin={priceRange.min} initialMax={priceRange.max} />
            </div>

            {!loading && !error && filteredPosts.length === 0 && (
              <div className="empty-state fade-in">
                <span className="empty-state__icon"><Icon name="search" className="w-10 h-10" /></span>
                <p>No se encontraron resultados con los filtros actuales</p>
              </div>
            )}

            {!loading && filteredPosts.length > 0 && (
              <div className="stagger">
                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                  {filteredPosts.map(post => (
                    <TicketCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      price={post.price ?? post.amount ?? 0}
                      includesTicket={post.includes_ticket}
                      category={getCategoryName(post.category_id)}
                      sellerName={`Vendedor #${post.seller_id || post.author_user_id || 'Anónimo'}`}
                      images={post.images}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && <Loader text="Cargando catálogo..." />}

        {error && (
          <div className="alert alert--error fade-in">
            <span><Icon name="warning" className="w-4 h-4" /></span> {error}
          </div>
        )}
      </div>
    </div>
  )
}