import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deletePost, getPosts } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

export default function MyListings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPosts()
      const list = Array.isArray(data) ? data : []
      setPosts(list)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const myPosts = useMemo(() => {
    return posts.filter((p) => String(p.author_user_id) === String(user?.id))
  }, [posts, user])

  const handleDelete = async (postId) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return
    try {
      await deletePost(postId)
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page"><Loader text="Cargando publicaciones..." /></div>

  return (
    <div className="page" id="page-my-listings">
      <header className="header" style={{ justifyContent: 'flex-start', gap: 12 }}>
        <button className="header__back" onClick={() => navigate('/perfil')} aria-label="Volver">
          <Icon name="chevron-left" className="w-5 h-5" />
        </button>
        <h1 className="header__title">Mis publicaciones</h1>
      </header>

      <div className="container" style={{ marginTop: 12 }}>
        {error && (
          <div className="alert alert--error">
            <span><Icon name="warning" className="w-4 h-4" /></span>
            <span>{error}</span>
          </div>
        )}

        <button onClick={() => navigate('/app/listings/create')} className="btn btn--green btn--block" style={{ marginBottom: 12 }}>
          <Icon name="check" className="w-4 h-4" /> Nueva publicación
        </button>

        {myPosts.length === 0 ? (
          <div className="card empty-state">
            <span className="empty-state__icon"><Icon name="bag" className="w-10 h-10" /></span>
            <p>Aún no tienes publicaciones</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {myPosts.map((post) => (
              <div key={post.id} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{post.title}</h3>
                  <span className={`badge ${post.status === 'published' ? 'badge--green' : 'badge--gray'}`}>
                    {post.status === 'published' ? 'Publicada' : 'Borrador'}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                  {post.content || 'Sin descripción'}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn--outline" style={{ flex: 1 }} onClick={() => navigate(`/app/products/${post.id}`)}>
                    Ver
                  </button>
                  <button className="btn btn--outline" style={{ flex: 1, color: 'var(--color-red)', borderColor: 'var(--color-red-border)' }} onClick={() => handleDelete(post.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
