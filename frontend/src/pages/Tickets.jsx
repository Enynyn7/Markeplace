import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTicketDetail, getTickets } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

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
  const { user } = useAuth()
  const [searchId, setSearchId] = useState(id || '')
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ticketsList, setTicketsList] = useState([])

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

  // Si no hay id, cargamos lista de boletos (comportamiento tipo "My Tickets")
  useEffect(() => {
    if (!id) {
      fetchTicketsList()
    }
  }, [id, user])

  const fetchTicketsList = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getTickets()
      const parsed = res.data !== undefined ? res.data : res
      // Si tenemos usuario, filtrar por vendedor/autor; si no, mostrar todo
      let list = Array.isArray(parsed) ? parsed : [parsed]
      if (user && (list.length > 0)) {
        list = list.filter(t => String(t.seller_id) === String(user.id) || String(t.author_user_id) === String(user.id))
      }
      setTicketsList(list)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchId.trim()) {
      navigate(`/boletos/${searchId.trim()}`)
    }
  }

  const soldCount = ticketsList.filter(t => t.estado_venta === 'completed').length
  const pendingCount = ticketsList.filter(t => t.estado_venta !== 'completed').length
  const amountPaid = ticketsList
    .filter(t => t.estado_venta === 'completed')
    .reduce((acc, t) => acc + Number(t.amount || t.price || 0), 0)
  const amountOwed = ticketsList
    .filter(t => t.estado_venta !== 'completed')
    .reduce((acc, t) => acc + Number(t.amount || t.price || 0), 0)

  return (
    <div className="page" id="page-tickets">
      <div className="container">
        {/* Page Header (Figma header styles) */}
        <header className="header fade-in" style={{ marginBottom: 12 }}>
          <div>
            <h1 className="header__title">Gestión de Boletos</h1>
            <p className="header__subtitle">Consulta y administra tus boletos asignados</p>
          </div>
        </header>

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

          {loading && <Loader text="Cargando..." />}

        {error && (
          <div className="alert alert--error fade-in" id="ticket-error">
            <span><Icon name="warning" className="w-4 h-4" /></span> {error}
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
                {ticket.estado_venta === 'completed' ? <Icon name="dollar" className="w-4 h-4" /> : <Icon name="clock" className="w-4 h-4" />}
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
                alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <Icon name="ticket" className="w-12 h-12 text-white" />
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
                <div className="icon-row__icon icon-row__icon--orange"><Icon name="user" className="w-5 h-5" /></div>
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
                       style={{ color: 'var(--color-primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="paperclip" className="w-4 h-4" /> Ver comprobante
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
        {/* Si no hay id, mostramos listado tipo "My Tickets" */}
        {!id && !loading && !error && (
          <div>
            <div className="tickets-stats-grid mb-4">
              <div className="ticket-list-card">
                <div className="ticket-list-stat-head">
                  <div className="ticket-list-stat-icon ticket-list-stat-icon--green"><Icon name="ticket" className="w-4 h-4" /></div>
                  <span className="ticket-list-stat-label">Vendidos</span>
                </div>
                <p className="ticket-list-stat-value">{soldCount}/{ticketsList.length}</p>
                <p className="ticket-list-stat-sub">${amountPaid.toLocaleString('es-MX')} recaudado</p>
              </div>

              <div className="ticket-list-card">
                <div className="ticket-list-stat-head">
                  <div className="ticket-list-stat-icon ticket-list-stat-icon--yellow"><Icon name="warning" className="w-4 h-4" /></div>
                  <span className="ticket-list-stat-label">Pendientes</span>
                </div>
                <p className="ticket-list-stat-value">{pendingCount}</p>
                <p className="ticket-list-stat-sub">${amountOwed.toLocaleString('es-MX')} adeudo</p>
              </div>
            </div>

            {pendingCount > 0 && (
              <div className="status-banner status-banner--warning mb-4">
                <div className="status-banner__icon"><Icon name="calendar" className="w-4 h-4" /></div>
                <div className="status-banner__text">
                  <strong>Fecha límite de venta</strong>
                  <span>Tienes {pendingCount} boletos pendientes de pago o venta.</span>
                </div>
              </div>
            )}

            <div className="tickets-tabs mb-4">
              <button className="tickets-tab active">Vendidos</button>
              <button className="tickets-tab">Pendientes de pago</button>
            </div>

            {ticketsList.length === 0 ? (
              <div className="empty-state fade-in">
                <span className="empty-state__icon"><Icon name="ticket" className="w-10 h-10" /></span>
                <p>No se encontraron boletos asignados.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <h3 className="font-semibold text-gray-700">Boletos Vendidos</h3>
                {ticketsList.map(t => (
                  <div key={t.id || t.ticket_id} onClick={() => navigate(`/boletos/${t.id || t.ticket_id}`)} className="ticket-list-card cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">Boleto {t.folio || (t.ticket_id || t.id)}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.estado_venta === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {t.estado_venta === 'completed' ? 'Pagado' : 'Pago pendiente'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">Vendido: {t.created_at ? new Date(t.created_at).toLocaleDateString() : '-'}</div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${Number(t.amount || t.price || 0).toLocaleString('es-MX')}</p>
                        <p className="text-xs text-gray-500">Token: {t.token || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <button onClick={() => navigate('/marketplace/publicar')} className="btn btn--green btn--block">
                Publicar en Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
