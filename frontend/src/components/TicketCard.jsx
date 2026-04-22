import { Link } from 'react-router-dom'

export default function TicketCard(props) {
  const {
    id,
    title,
    sellerName,
    sellerImage,
    price,
    includesTicket,
    category,
    images
  } = props;

  return (
    <div className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
      <Link to={`/productos/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: 160, background: '#f3f4f6', overflow: 'hidden' }}>
          {images && images.length > 0 ? (
            <img src={images[0].url || images[0]} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              📦
            </div>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {category && <span className="badge badge--orange">{category}</span>}
            {includesTicket && <span className="badge badge--green">🎟️ Incluye boleto</span>}
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 12 }}>
            ${price?.toLocaleString('es-MX')} MXN
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb', overflow: 'hidden' }}>
              {sellerImage ? (
                <img src={sellerImage} alt={sellerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
              )}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{sellerName || 'Vendedor Anónimo'}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
