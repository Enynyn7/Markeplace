import { useState, useEffect } from 'react'
import { getPosts, getCategories } from '../api'
import Loader from '../components/Loader'
import TicketCard from '../components/TicketCard'

export default function Marketplace() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

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

    const matchesCategory =
      selectedCategory === "" || String(post.category_id) === selectedCategory

    const matchesStatus =
      selectedStatus === "" || String(post.status).toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => String(cat.id) === String(categoryId))
    return category ? category.name : `Categoría ${categoryId}`
  }

  return (
    <div className="page" id="page-marketplace">
      <div className="container">
        <header className="page-header fade-in">
          <h1 className="page-header__title">Marketplace</h1>
          <p className="page-header__subtitle">
            Encuentra productos, servicios y boletos de la comunidad UDLAP
          </p>
        </header>

        <div className="search-bar fade-in" style={{ display: 'grid', gap: '12px' }}>
          <input
            type="text"
            className="input"
            placeholder="Buscar productos o servicios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

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

        {loading && <Loader text="Cargando catálogo..." />}

        {error && (
          <div className="alert alert--error fade-in">
            <span>⚠️</span> {error}
          </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="empty-state fade-in">
            <span className="empty-state__icon">🔍</span>
            <p>No se encontraron resultados con los filtros actuales</p>
          </div>
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className="stagger">
            {filteredPosts.map(post => (
              <TicketCard
                key={post.id}
                id={post.id}
                title={post.title}
                price={post.price}
                includesTicket={post.includes_ticket}
                category={getCategoryName(post.category_id)}
                sellerName={`Vendedor #${post.seller_id || post.author_user_id || 'Anónimo'}`}
                images={post.images}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}