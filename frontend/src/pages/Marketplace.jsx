import { useState, useEffect } from 'react'
import { getPosts, getCategories } from '../api'
import Loader from '../components/Loader'
import TicketCard from '../components/TicketCard'
import FilterSection from '../components/FilterSection'
import Icon from '../components/Icon'

function normalizeList(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (value?.data) return [value.data]
  return value ? [value] : []
}

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getPostPrice(post) {
  const price = Number(post?.price ?? post?.amount ?? 0)
  return Number.isFinite(price) && price >= 0 ? price : 0
}

function postIncludesTicket(post) {
  return Boolean(post?.includes_ticket || post?.includesTicket || post?.ticket_id)
}

function buildSearchText(post, categoryName) {
  return normalizeText([
    post?.id,
    post?.title,
    post?.content,
    post?.description,
    post?.category_name,
    post?.category_slug,
    categoryName,
    post?.ticket_id,
    post?.ticket_folio,
    post?.ticket_subject,
    post?.ticket_description,
    post?.author_email,
    post?.author_first_name,
    post?.author_last_name
  ].filter(Boolean).join(' '))
}

export default function Marketplace() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })

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

      const safePosts = normalizeList(postsResult)
      const safeCategories = normalizeList(categoriesResult)

      const sortedPosts = safePosts
        .map(post => ({
          ...post,
          price: getPostPrice(post),
          includes_ticket: postIncludesTicket(post)
        }))
        .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))

      setPosts(sortedPosts)
      setCategories(safeCategories)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el marketplace')
    } finally {
      setLoading(false)
    }
  }

  function getCategoryName(categoryId) {
    const category = categories.find(cat => String(cat.id) === String(categoryId))
    return category ? category.name : `Categoría ${categoryId}`
  }

  const filteredPosts = posts.filter(post => {
    const categoryName = post.category_name || getCategoryName(post.category_id)
    const query = normalizeText(searchQuery.trim())
    const searchText = buildSearchText(post, categoryName)

    const matchesSearch = query === "" || searchText.includes(query)

    const matchesCategory =
      selectedCategory === "" || String(post.category_id) === String(selectedCategory)

    const matchesStatus =
      selectedStatus === "" || String(post.status).toLowerCase() === selectedStatus.toLowerCase()

    const price = getPostPrice(post)
    const matchesPrice = price >= Number(priceRange.min) && price <= Number(priceRange.max)

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice
  })

  return (
    <div className="page" id="page-marketplace">
      <div className="container">
        <header className="header fade-in marketplace-header" style={{ marginBottom: 12 }}>
          <div>
            <h1 className="header__title">Marketplace</h1>
          </div>
          <button
            type="button"
            className="btn btn--orange"
            onClick={fetchMarketplaceData}
          >
            Refrescar
          </button>
        </header>

        <div className="market-layout fade-in" style={{ display: 'grid', gap: '16px' }}>
          <div className="market-results">
            <div className="search-bar" style={{ display: 'grid', gap: '12px' }}>
              <div className="market-search-wrap">
                <span className="market-search-icon"><Icon name="search" className="w-4 h-4" /></span>
                <input
                  type="text"
                  className="input"
                  placeholder="Buscar producto, boleto, folio, categoría o vendedor"
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
              <FilterSection
                categories={categories}
                onApply={({ category, minPrice, maxPrice }) => {
                  setSelectedCategory(category || '')
                  setPriceRange({ min: Number(minPrice ?? 0), max: Number(maxPrice || 10000) })
                }}
                initialCategory={selectedCategory}
                initialMin={priceRange.min}
                initialMax={priceRange.max}
              />
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
                  {filteredPosts.map(post => {
                    const categoryName = post.category_name || getCategoryName(post.category_id)
                    const sellerName = [post.author_first_name, post.author_last_name].filter(Boolean).join(' ')

                    return (
                      <TicketCard
                        key={post.id}
                        id={post.id}
                        listing={post}
                        title={post.title}
                        price={getPostPrice(post)}
                        includesTicket={postIncludesTicket(post)}
                        category={categoryName}
                        sellerName={sellerName || post.author_email || `Vendedor #${post.author_user_id || 'Anónimo'}`}
                        images={post.images}
                      />
                    )
                  })}
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