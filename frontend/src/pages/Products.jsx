import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { createPurchaseItem, createPurchaseOrder, getPaymentMethods, getPostDetail, updatePurchaseOrder } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

export default function Products() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [searchId, setSearchId] = useState(id || '')
  const [product, setProduct] = useState(location.state?.product || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [buying, setBuying] = useState(false)
  const isOwnProduct = user?.id && product?.author_user_id && String(user.id) === String(product.author_user_id)

  const fetchProduct = async (productId) => {
    if (!productId) return
    setLoading(true)
    setError(null)
    if (String(location.state?.product?.id) !== String(productId)) {
      setProduct(null)
    }
    try {
      const result = await getPostDetail(productId)
      setProduct(result.data !== undefined ? result.data : result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      setSearchId(id)
      fetchProduct(id)
    }
  }, [id])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchId.trim()) {
      navigate(`/app/products/${searchId.trim()}`)
    }
  }

  const normalizeImages = (images) => {
    if (!Array.isArray(images)) return []
    return images
      .map((image) => {
        if (!image) return null
        if (typeof image === 'string') return image
        return image.url || null
      })
      .filter(Boolean)
  }

  const formatPrice = (value) => {
    const price = Number(value || 0)
    return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleBuy = async () => {
    if (!product?.id) return
    if (!user?.id) {
      navigate('/login')
      return
    }

    setBuying(true)
    setError(null)

    try {
      if (String(product.author_user_id) === String(user.id)) {
        throw new Error('No puedes comprar tus propias publicaciones')
      }

      const methods = await getPaymentMethods(user.id)
      const activeMethods = Array.isArray(methods)
        ? methods.filter((method) => String(method.status || 'active').toLowerCase() === 'active')
        : []

      if (activeMethods.length === 0) {
        throw new Error('Agrega un metodo de pago antes de comprar')
      }

      const orderResponse = await createPurchaseOrder({
        user_id: user.id,
        status: 'pending',
        total_amount: Number(product.price || 0),
        currency: 'MXN',
      })

      const order = orderResponse.data || orderResponse

      await createPurchaseItem({
        purchase_order_id: order.id,
        item_name: product.title,
        sku: String(product.slug || product.id),
        quantity: 1,
        unit_price: Number(product.price || 0),
        line_total: Number(product.price || 0),
      })

      await updatePurchaseOrder(order.id, {
        status: 'completed',
      })

      navigate('/app/transactions')
    } catch (err) {
      setError(err.message || 'No se pudo completar la compra')
    } finally {
      setBuying(false)
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      available: { cls: 'badge--green', text: 'Disponible' },
      sold: { cls: 'badge--red', text: 'Vendido' },
      reserved: { cls: 'badge--yellow', text: 'Reservado' },
      draft: { cls: 'badge--gray', text: 'Borrador' },
      published: { cls: 'badge--green', text: 'Publicado' },
    }
    const info = map[status] || { cls: 'badge--gray', text: status || 'N/A' }
    return <span className={`badge ${info.cls}`}>{info.text}</span>
  }

  return (
    <div className="page" id="page-products">
      <div className="container">
        <div className="page-header fade-in">
          <h1 className="page-header__title">Detalles del Producto</h1>
          <p className="page-header__subtitle">
            Busca un producto por su ID para ver información completa
          </p>
        </div>

        {/* Search */}
        <form className="search-bar fade-in" onSubmit={handleSearch} id="product-search-form">
          <input
            type="number"
            className="input"
            placeholder="ID del producto (ej: 1)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            min="1"
            id="product-search-input"
          />
          <button type="submit" className="btn btn--orange" id="product-search-btn">
            Buscar
          </button>
        </form>

        {loading && <Loader text="Cargando producto..." />}

        {error && (
          <div className="alert alert--error fade-in" id="product-error">
            <span><Icon name="warning" className="w-4 h-4" /></span> {error}
          </div>
        )}

        {/* Product Detail — Figma style */}
        {product && !loading && (
          <div className="slide-up" id="product-detail">
            {/* Image */}
            <div className="product-detail__image-wrapper" style={{ marginBottom: 16 }}>
              {normalizeImages(product.images).length > 0 ? (
                <img src={normalizeImages(product.images)[0]} alt={product.title} />
              ) : (
                <Icon name="box" className="w-12 h-12 text-gray-300" />
              )}
            </div>

            {/* Category tags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="badge badge--orange">Producto</span>
              {product.includes_ticket && (
                <span className="badge badge--green"><Icon name="ticket" className="w-3 h-3" /> Incluye boleto</span>
              )}
              {getStatusBadge(product.status)}
            </div>

            {/* Title + Price */}
            <h2 className="product-detail__title">{product.title}</h2>
            <p className="product-detail__price">
              ${formatPrice(product.price)} MXN
            </p>

            {/* Includes ticket banner */}
            {product.includes_ticket && (
              <div className="status-banner status-banner--success" style={{ marginTop: 16 }}>
                <div className="status-banner__icon"><Icon name="ticket" className="w-4 h-4" /></div>
                <div className="status-banner__text">
                  <strong style={{ color: 'var(--color-green-text)' }}>Incluye 1 boleto del Sorteo UDLAP</strong>
                  <span>Este producto incluye un boleto oficial del sorteo institucional</span>
                </div>
              </div>
            )}

            {/* Buy Button */}
            <div className="card" style={{ marginTop: 16, padding: 16 }}>
              <button className="btn btn--green btn--block btn--lg" id="product-buy-btn" onClick={handleBuy} disabled={buying || isOwnProduct}>
                <Icon name="bag" className="w-4 h-4" /> {isOwnProduct ? 'No puedes comprar tu producto' : (buying ? 'Procesando...' : 'Comprar ahora')}
              </button>
              {!isOwnProduct && (
                <button className="btn btn--outline btn--block" style={{ marginTop: 8 }} onClick={() => navigate('/app/payments')}>
                  <Icon name="credit-card" className="w-4 h-4" /> Mis metodos de pago
                </button>
              )}
            </div>

            {/* Seller */}
            <div className="card">
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>Vendido por:</p>
              <div className="icon-row" style={{ padding: 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: '#e5e7eb', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0
                }}>
                  <Icon name="user" />
                </div>
                <div className="icon-row__text">
                  <strong>Vendedor #{product.seller_id || product.author_user_id || 'N/A'}</strong>
                  <span>Miembro de la comunidad UDLAP</span>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="card">
              <div className="info-row">
                <span className="info-row__label">ID del producto</span>
                <span className="info-row__value">{product.id}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Categoría</span>
                <span className="info-row__value">#{product.category_id}</span>
              </div>
              {normalizeImages(product.images).length > 0 && (
                <div className="info-row">
                  <span className="info-row__label">Imágenes</span>
                  <span className="info-row__value">{normalizeImages(product.images).length} imagen(es)</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card">
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 12 }}>Descripción</h3>
              <p className="product-detail__description">
                {product.description || product.content || 'Sin descripción disponible.'}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !product && !id && (
          <div className="empty-state fade-in">
            <span className="empty-state__icon"><Icon name="search" /></span>
            <p>Ingresa un ID de producto para consultar su detalle</p>
          </div>
        )}

        {!loading && !error && !product && id && (
          <div className="empty-state fade-in">
            <span className="empty-state__icon"><Icon name="box" /></span>
            <p>No se encontro informacion para este producto</p>
            <button className="btn btn--orange" onClick={() => navigate('/app/marketplace')}>
              Volver al marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
