import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost, createPostImage, getCategories, getTickets } from '../api'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function isValidImageUrl(value) {
  if (!value) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function normalizeList(res) {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  if (Array.isArray(res?.value)) return res.value
  return []
}

export default function CreateListing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const canSell = user?.userType === 'student'

  const [categories, setCategories] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    ticketId: '',
    price: '',
    imageUrl: '',
    description: '',
    status: 'published',
  })

  useEffect(() => {
    let alive = true

    getCategories()
      .then((res) => {
        if (!alive) return
        setCategories(normalizeList(res))
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudieron cargar las categorías')
      })

    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!user?.id || !canSell) return

    let alive = true
    setLoadingTickets(true)

    getTickets(user.id)
      .then((res) => {
        if (!alive) return
        setTickets(normalizeList(res))
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'No se pudieron cargar tus boletos')
      })
      .finally(() => {
        if (!alive) return
        setLoadingTickets(false)
      })

    return () => { alive = false }
  }, [user?.id, canSell])

  const selectedCategory = useMemo(() => {
    return categories.find((category) => String(category.id) === String(form.categoryId))
  }, [categories, form.categoryId])

  const isTicketListing = useMemo(() => {
    const slug = String(selectedCategory?.slug || '').toLowerCase()
    const name = String(selectedCategory?.name || '').toLowerCase()
    return ['boleto', 'boletos', 'ticket', 'tickets'].includes(slug) ||
      ['boleto', 'boletos', 'ticket', 'tickets'].includes(name)
  }, [selectedCategory])

  const availableTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const status = String(ticket.estado_boleto || ticket.status || '').toLowerCase()
      return status === 'available' && !ticket.ticket_sale_id
    })
  }, [tickets])

  const canSubmit = useMemo(() => {
    const price = Number(form.price)

    return Boolean(
      user?.id &&
      canSell &&
      form.title.trim() &&
      form.categoryId &&
      form.price !== '' &&
      Number.isFinite(price) &&
      price >= 0 &&
      (!isTicketListing || form.ticketId) &&
      isValidImageUrl(form.imageUrl.trim())
    )
  }, [user?.id, canSell, form, isTicketListing])

  const onChange = (key) => (e) => {
    setError(null)
    setSuccess(null)

    const value = e.target.value

    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'categoryId' ? { ticketId: '' } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const imageUrl = form.imageUrl.trim()
      const now = Date.now()
      const slugBase = slugify(form.title)
      const slug = `${slugBase || 'publicacion'}-${now}`

      const payload = {
        category_id: Number(form.categoryId),
        author_user_id: user.id,
        title: form.title.trim(),
        slug,
        content: form.description.trim(),
        price: Number(form.price),
        status: form.status,
        published_at: new Date().toISOString(),
        includes_ticket: isTicketListing,
        ticket_id: isTicketListing ? Number(form.ticketId) : null,
      }

      const created = await createPost(payload)
      const post = created.data || created

      if (imageUrl) {
        await createPostImage({
          post_id: post.id,
          url: imageUrl,
          alt_text: form.title.trim(),
          sort_order: 0,
        })
      }

      setSuccess('Publicación creada correctamente')
      setTimeout(() => navigate('/app/marketplace'), 800)
    } catch (err) {
      setError(err.message || 'No se pudo crear la publicación')
    } finally {
      setLoading(false)
    }
  }

  if (!canSell) {
    return (
      <div className="page" id="page-create-listing">
        <div className="container">
          <header className="header fade-in" style={{ marginBottom: 12, justifyContent: 'space-between' }}>
            <button className="header__back" onClick={() => navigate('/app/marketplace')} aria-label="Volver">
              <Icon name="chevron-left" className="w-5 h-5" />
            </button>
            <h1 className="header__title">Publicar en Marketplace</h1>
            <div style={{ width: 40 }} />
          </header>

          <div className="card fade-in">
            <div className="card__header">
              <h2 className="card__title">Acceso restringido</h2>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              Solo los estudiantes pueden publicar productos o boletos en Marketplace.
            </p>

            <button
              type="button"
              className="btn btn--orange btn--block"
              onClick={() => navigate('/app/marketplace')}
            >
              Volver a Marketplace
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" id="page-create-listing">
      <div className="container">
        <header className="header fade-in" style={{ marginBottom: 12, justifyContent: 'space-between' }}>
          <button className="header__back" onClick={() => navigate('/app/marketplace')} aria-label="Volver">
            <Icon name="chevron-left" className="w-5 h-5" />
          </button>
          <h1 className="header__title">Publicar en Marketplace</h1>
          <div style={{ width: 40 }} />
        </header>

        <div className="card fade-in">
          <div className="card__header">
            <h2 className="card__title">Nueva publicación</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
              Si eliges la categoría Boleto, deberás seleccionar uno de tus boletos disponibles.
            </p>
          </div>

          {error && (
            <div style={{ color: 'var(--color-red)', marginBottom: 12, fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ color: 'var(--color-green)', marginBottom: 12, fontSize: '0.9rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                className="input"
                value={form.title}
                onChange={onChange('title')}
                placeholder="Ej. Boleto Gran Sorteo"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="input"
                value={form.categoryId}
                onChange={onChange('categoryId')}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {isTicketListing && (
              <div className="form-group">
                <label className="form-label">Boleto disponible</label>
                <select
                  className="input"
                  value={form.ticketId}
                  onChange={onChange('ticketId')}
                  disabled={loadingTickets}
                >
                  <option value="">
                    {loadingTickets ? 'Cargando boletos...' : 'Selecciona un boleto'}
                  </option>
                  {availableTickets.map((ticket) => (
                    <option key={ticket.ticket_id || ticket.id} value={ticket.ticket_id || ticket.id}>
                      {(ticket.folio || ticket.subject || `Boleto #${ticket.ticket_id || ticket.id}`)} — {ticket.description || 'Sin descripción'}
                    </option>
                  ))}
                </select>

                {!loadingTickets && availableTickets.length === 0 && (
                  <p style={{ color: 'var(--color-red)', fontSize: '0.8125rem', marginTop: 6 }}>
                    No tienes boletos disponibles para publicar.
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Precio</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onChange('price')}
                placeholder="Ej. 150"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Imagen por URL</label>
              <input
                className="input"
                value={form.imageUrl}
                onChange={onChange('imageUrl')}
                placeholder="https://picsum.photos/400/300"
              />
              {form.imageUrl && isValidImageUrl(form.imageUrl.trim()) && (
                <img
                  src={form.imageUrl.trim()}
                  alt="Vista previa"
                  style={{
                    width: '100%',
                    maxHeight: 180,
                    objectFit: 'cover',
                    borderRadius: 12,
                    marginTop: 10,
                  }}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="input"
                rows="4"
                value={form.description}
                onChange={onChange('description')}
                placeholder="Describe lo que estás vendiendo"
              />
            </div>

            <button
              type="submit"
              className="btn btn--orange btn--block"
              disabled={!canSubmit || loading}
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
