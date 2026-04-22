import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTicketDetail } from '../api'
import Loader from '../components/Loader'

function getStatusBadge(status) {
  if (!status) return <span className="badge badge--gray">N/A</span>
  const map = {
    available: { cls: 'badge--blue', label: 'Disponible' },
    sold: { cls: 'badge--green', label: 'Vendido' },
    pending: { cls: 'badge--yellow', label: 'Pendiente' },
    completed: { cls: 'badge--green', label: 'Completado' },
    approved: { cls: 'badge--green', label: 'Aprobado' },
    rejected: { cls: 'badge--red', label: 'Rechazado' },
  }
  const info = map[status] || { cls: 'badge--gray', label: status }
  return <span className={`badge ${info.cls}`}>{info.label}</span>
}

export default function Tickets() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchId, setSearchId] = useState(id || '')
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTicket = async (ticketId) => {
    if (!ticketId) return
    setLoading(true)
    setError(null)
    setTicket(null)
    try {
      const result = await getTicketDetail(ticketId)
      setTicket(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      setSearchId(id)
      fetchTicket(id)
    }
  }, [id])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchId.trim()) {
      navigate(`/boletos/${searchId.trim()}`)
    }
  }

  return (
    <div className="page" id="page-tickets">
      <div className="container">
        {/* Page Header */}
        <div className="page-header fade-in">
          <h1 className="page-header__title">Detalles del Boleto</h1>
          <p className="page-header__subtitle">
            Busca un boleto por su ID para ver información completa
          </p>
        </div>

        {/* Search */}
        <form className="search-bar fade-in" onSubmit={handleSearch} id="ticket-search-form">
          <input
            type="number"
            className="input"
            placeholder="ID del boleto (ej: 2)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            min="1"
            id="ticket-search-input"
          />
          <button type="submit" className="btn btn--orange" id="ticket-search-btn">
            Buscar
          </button>
        </form>

        {loading && <Loader text="Buscando boleto..." />}

        {error && (
          <div className="alert alert--error fade-in" id="ticket-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Ticket Detail Card — Figma style */}
        {ticket && !loading && (
          <div className="slide-up">
            {/* Status Banner */}
            <div className={`status-banner ${
              ticket.estado_venta === 'completed' ? 'status-banner--success' : 'status-banner--warning'
            }`}>
              <div className="status-banner__icon">
                {ticket.estado_venta === 'completed' ? '💰' : '⏳'}
              </div>
              <div className="status-banner__text">
                <strong>{ticket.estado_venta === 'completed' ? 'Pago recibido' : 'Pago pendiente'}</strong>
                <span>{ticket.estado_venta === 'completed'
                  ? 'El boleto está confirmado y activo'
                  : 'Esperando confirmación de pago'}</span>
              </div>
            </div>

            {/* QR / Ticket Number */}
            <div className="card" id="ticket-detail-card" style={{ textAlign: 'center' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 4 }}>
                {ticket.folio || `Boleto #${ticket.ticket_id}`}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                ID: {ticket.ticket_id}
              </p>

              <div style={{
                width: 120, height: 120, margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #FF5722, #f4511e)',
                borderRadius: 'var(--radius-lg)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
                boxShadow: 'var(--shadow-lg)'
              }}>
                🎟️
              </div>

              <div style={{
                background: '#f3f4f6', padding: '8px 16px',
                borderRadius: 'var(--radius-md)', display: 'inline-block',
                fontFamily: 'monospace', fontSize: '0.875rem'
              }}>
                Folio: {ticket.folio || 'N/A'}
              </div>
            </div>

            {/* Buyer Info */}
            <div className="card">
              <h2 className="card__title" style={{ marginBottom: 16 }}>Información del Comprador</h2>
              <div className="icon-row">
                <div className="icon-row__icon icon-row__icon--orange">👤</div>
                <div className="icon-row__text">
                  <strong>{ticket.nombre_comprador || 'Sin comprador asignado'}</strong>
                  <span>{ticket.nombre_comprador ? 'Comprador verificado' : 'Boleto sin vender'}</span>
                </div>
              </div>
            </div>

            {/* Sale Details */}
            <div className="card">
              <h2 className="card__title" style={{ marginBottom: 16 }}>Detalles de la Venta</h2>

              <div className="info-row">
                <span className="info-row__label">Estado del boleto</span>
                <span className="info-row__value">{getStatusBadge(ticket.estado_boleto)}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Estado de venta</span>
                <span className="info-row__value">{getStatusBadge(ticket.estado_venta)}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Evidencia de pago</span>
                <span className="info-row__value">
                  {ticket.evidencia_pago_url ? (
                    <a href={ticket.evidencia_pago_url} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                      📎 Ver comprobante
                    </a>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>Sin evidencia</span>
                  )}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Estado evidencia</span>
                <span className="info-row__value">{getStatusBadge(ticket.estado_evidencia)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !ticket && !id && (
          <div className="empty-state fade-in">
            <span className="empty-state__icon">🔍</span>
            <p>Ingresa un ID de boleto para consultar su detalle</p>
            <p style={{ fontSize: '0.75rem', marginTop: 8, color: 'var(--color-text-muted)' }}>
              IDs disponibles: 1, 2, 3, 4, 5, 6, 7
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
