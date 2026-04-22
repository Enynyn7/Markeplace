import { useState, useEffect } from 'react'
import { getPosts } from '../api'
import Loader from '../components/Loader'
import TicketCard from '../components/TicketCard'

export default function Marketplace() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const result = await getPosts()
      // Si la API devuelve la data directamente o envuelta en .data
      const parsedData = result.data !== undefined ? result.data : result;
      setPosts(Array.isArray(parsedData) ? parsedData : [parsedData]);
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => 
    post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="page" id="page-marketplace">
      <div className="container">
        <header className="page-header fade-in">
          <h1 className="page-header__title">Marketplace</h1>
          <p className="page-header__subtitle">
            Encuentra productos, servicios y boletos de la comunidad UDLAP
          </p>
        </header>

        {/* Search Bar */}
        <div className="search-bar fade-in">
          <input
            type="text"
            className="input"
            placeholder="Buscar productos o servicios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            <p>No se encontraron resultados para "{searchQuery}"</p>
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
                category={`Categoría ${post.category_id}`}
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
