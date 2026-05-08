import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Icon from './Icon'

function formatPrice(value) {
  const price = Number(value ?? 0)

  if (!Number.isFinite(price)) {
    return '$0.00'
  }

  return price.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
  })
}

export default function TicketCard(props) {
  const {
    id,
    title,
    sellerName,
    sellerImage,
    price,
    includesTicket,
    category,
    listing,
    images = []
  } = props

  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)

  const safeImages = Array.isArray(images) ? images : []
  const ticketLabel = listing?.ticket_folio || listing?.ticket_subject || listing?.subject || listing?.ticket_id

  const next = (e) => {
    e.stopPropagation()
    if (safeImages.length > 0) setIdx((idx + 1) % safeImages.length)
  }

  const prev = (e) => {
    e.stopPropagation()
    if (safeImages.length > 0) setIdx((idx - 1 + safeImages.length) % safeImages.length)
  }

  const toDetails = () => navigate(`/app/products/${id}`, { state: { product: listing } })

  return (
    <div className="ticket-card bg-white rounded-lg shadow-sm overflow-hidden">
      <div onClick={toDetails} role="button" aria-label={`Ver ${title}`} className="ticket-card__media relative w-full bg-gray-100 cursor-pointer">
        {safeImages.length > 0 ? (
          <img src={safeImages[idx].url || safeImages[idx]} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="ticket-card__placeholder w-full h-full flex items-center justify-center">
            <div className="ticket-card__placeholder-inner">
              <Icon name="box" className="ticket-card__placeholder-icon" />
              <span className="ticket-card__placeholder-text">Imagen no disponible</span>
            </div>
          </div>
        )}

        {safeImages.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-1 rounded-full">
              <Icon name="chevron-left" className="w-4 h-4" />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-1 rounded-full">
              <Icon name="chevron-right" className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {safeImages.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i) }} className={`${i === idx ? 'bg-white w-6 h-2 rounded-full' : 'bg-white/60 w-2 h-2 rounded-full'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-base pr-2 flex-1">{title}</h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {sellerImage ? (
              <img src={sellerImage} alt={sellerName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Icon name="user" className="w-4 h-4" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">{sellerName || 'Vendedor Anónimo'}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {category && <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">{category}</span>}
          {includesTicket && <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"><Icon name="ticket" className="w-3 h-3" /> Incluye boleto</span>}
          {includesTicket && ticketLabel && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">#{ticketLabel}</span>}
        </div>

        <p className="ticket-card__price">{formatPrice(price)}</p>

        <div className="flex gap-2">
          <button onClick={toDetails} className="btn btn--orange btn--block">Comprar</button>
          <button onClick={toDetails} className="btn btn--outline btn--block">Ver detalles</button>
        </div>
      </div>
    </div>
  )
}