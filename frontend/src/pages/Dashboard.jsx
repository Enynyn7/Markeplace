import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFinancialAccounts, getFinancialMovements, getPosts, getPurchaseOrders, getTickets } from '../api'
import Loader from '../components/Loader'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'

function formatMoney(value) {
  return Number(value || 0).toLocaleString('es-MX')
}

function isSoldTicket(ticket) {
  const status = String(ticket?.estado_venta || ticket?.status || '').toLowerCase()
  return ['completed', 'sold', 'approved', 'completado'].includes(status)
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [account, setAccount] = useState(null)
  const [tickets, setTickets] = useState([])
  const [movements, setMovements] = useState([])
  const [posts, setPosts] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [accountsData, ticketsData, movementsData, postsData, ordersData] = await Promise.all([
          getFinancialAccounts(user.id),
          getTickets(user.id),
          getFinancialMovements(null, user.id),
          getPosts(),
          getPurchaseOrders(user.id),
        ])

        const accountData = Array.isArray(accountsData) ? accountsData[0] : accountsData
        setAccount(accountData || null)

        const ticketList = Array.isArray(ticketsData) ? ticketsData : []
        setTickets(ticketList)

        setMovements(Array.isArray(movementsData) ? movementsData : [])
        setPosts(Array.isArray(postsData) ? postsData : [])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } catch (err) {
        setError(`Error cargando el dashboard: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user])

  const soldTickets = tickets.filter(isSoldTicket)
  const pendingTickets = tickets.filter((ticket) => !isSoldTicket(ticket))
  const soldTotal = soldTickets.reduce((sum, ticket) => sum + Number(ticket.price || 0), 0)
  const pendingTotal = pendingTickets.reduce((sum, ticket) => sum + Number(ticket.price || 0), 0)
  const balanceTotal = Number(account?.balance || 0)
  const recentActivities = [
    ...movements.map((movement) => ({
      id: `movement-${movement.id}`,
      date: movement.created_at,
      description: movement.description || 'Movimiento',
      amount: Number(movement.amount || 0),
    })),
    ...posts
      .filter((post) => String(post.author_user_id) === String(user?.id))
      .map((post) => ({
        id: `post-${post.id}`,
        date: post.created_at,
        description: `Publicacion: ${post.title}`,
        amount: 0,
      })),
    ...orders.map((order) => ({
      id: `order-${order.id}`,
      date: order.created_at,
      description: `Compra orden #${order.id}`,
      amount: -Math.abs(Number(order.total_amount || 0)),
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  if (loading) {
    return <div className="page container"><Loader text="Cargando finanzas..." /></div>
  }

  return (
    <div className="page" id="page-dashboard">
      <div className="container">
        <header className="header fade-in" style={{ marginBottom: 16 }}>
          <div>
            <h1 className="header__title">Dashboard Financiero</h1>
            <p className="header__subtitle">{user?.fullName || user?.name || 'Usuario'}</p>
          </div>
        </header>

        {error && (
          <div className="alert alert--error fade-in">
            <span><Icon name="warning" className="w-4 h-4" /></span> {error}
          </div>
        )}

        <div className="stagger">
          <div className="card dashboard-overview-card">
            <p className="dashboard-overview-label">Balance total</p>
            <p className="dashboard-overview-amount">${formatMoney(balanceTotal)}</p>
            <div className="dashboard-overview-split">
              <div>
                <p className="dashboard-overview-sub">Cuenta</p>
                <p className="dashboard-overview-subvalue">{account?.account_type || 'Sin cuenta'}</p>
              </div>
              <div className="dashboard-overview-right">
                <p className="dashboard-overview-sub">Moneda</p>
                <p className="dashboard-overview-subvalue">{account?.currency || 'MXN'}</p>
              </div>
            </div>
          </div>

          {pendingTickets.length > 0 && (
            <div className="alert alert--error" style={{ background: 'var(--color-yellow-light)', borderColor: 'var(--color-yellow-border)', color: 'var(--color-yellow-text)', alignItems: 'flex-start' }}>
              <span style={{ marginTop: 2 }}><Icon name="warning" className="w-4 h-4" /></span>
              <div>
                <strong style={{ display: 'block', marginBottom: 4 }}>Tienes {pendingTickets.length} boletos sin vender</strong>
                <span style={{ fontSize: '0.75rem', display: 'block' }}>Adeudo potencial: ${formatMoney(pendingTotal)}</span>
                <button onClick={() => navigate('/app/tickets')} style={{ background: 'none', border: 'none', color: 'var(--color-yellow-text)', textDecoration: 'underline', fontSize: '0.75rem', padding: 0, marginTop: 8, cursor: 'pointer', fontWeight: 600 }}>
                  Ver mis boletos
                </button>
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Estado de Boletos</h3>
            <div className="tickets-stats-grid" style={{ marginBottom: 16 }}>
              <div className="ticket-state-box ticket-state-box--sold">
                <p className="ticket-state-box__label">Vendidos</p>
                <p className="ticket-state-box__value">{soldTickets.length}</p>
                <p className="ticket-state-box__meta">${formatMoney(soldTotal)}</p>
              </div>
              <div className="ticket-state-box ticket-state-box--pending">
                <p className="ticket-state-box__label">Sin vender</p>
                <p className="ticket-state-box__value">{pendingTickets.length}</p>
                <p className="ticket-state-box__meta">${formatMoney(pendingTotal)}</p>
              </div>
            </div>
            <button className="btn btn--green btn--block" onClick={() => navigate('/app/tickets')}>
              Gestionar mis boletos
            </button>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Movimientos Recientes</h3>
              {account && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{account.account_type}</span>}
            </div>

            {recentActivities.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                No hay movimientos registrados.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentActivities.map((movement) => (
                  <div key={movement.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{movement.description || 'Transacción'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(movement.date).toLocaleDateString('es-MX')}</p>
                    </div>
                    <span style={{ fontWeight: 600, color: Number(movement.amount) >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                      {Number(movement.amount) >= 0 ? '+' : ''}${formatMoney(Math.abs(Number(movement.amount || 0)))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-quick-grid">
            <button className="btn btn--outline dashboard-quick-btn" onClick={() => navigate('/app/transactions')}>
              <Icon name="box" className="dashboard-quick-btn__icon" />
              <span>Mis compras</span>
            </button>
            <button className="btn btn--outline dashboard-quick-btn" onClick={() => navigate('/app/payments')}>
              <Icon name="credit-card" className="dashboard-quick-btn__icon" />
              <span>Métodos de pago</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
