import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPurchaseItems, getPurchaseOrders } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

export default function MyPurchases() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [ordersData, itemsData] = await Promise.all([
          getPurchaseOrders(),
          getPurchaseItems(),
        ])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setItems(Array.isArray(itemsData) ? itemsData : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const myOrders = useMemo(() => {
    return orders
      .filter((o) => String(o.user_id) === String(user?.id))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [orders, user])

  const totalSpent = useMemo(() => {
    return myOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
  }, [myOrders])

  const completedCount = useMemo(() => {
    return myOrders.filter((o) => o.status === 'completed').length
  }, [myOrders])

  const groupedItems = useMemo(() => {
    const map = new Map()
    for (const item of items) {
      const key = String(item.purchase_order_id)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(item)
    }
    return map
  }, [items])

  if (loading) return <div className="page"><Loader text="Cargando mis compras..." /></div>

  return (
    <div className="page" id="page-my-purchases">
      <header className="header" style={{ justifyContent: 'flex-start', gap: 12 }}>
        <button className="header__back" onClick={() => navigate('/perfil')} aria-label="Volver">
          <Icon name="chevron-left" className="w-5 h-5" />
        </button>
        <h1 className="header__title">Mis compras</h1>
      </header>

      <div className="container" style={{ marginTop: 12 }}>
        {error && (
          <div className="alert alert--error">
            <span><Icon name="warning" className="w-4 h-4" /></span>
            <span>{error}</span>
          </div>
        )}

        <div className="dashboard-quick-grid" style={{ marginBottom: 12 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Órdenes</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 700 }}>{myOrders.length}</p>
          </div>
          <div className="card" style={{ marginBottom: 0 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Completadas</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 700 }}>{completedCount}</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Total gastado</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>${totalSpent.toLocaleString('es-MX')}</p>
        </div>

        {myOrders.length === 0 ? (
          <div className="card empty-state">
            <span className="empty-state__icon"><Icon name="box" className="w-10 h-10" /></span>
            <p>No tienes compras registradas</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {myOrders.map((o) => {
              const orderItems = groupedItems.get(String(o.id)) || []
              return (
                <div key={o.id} className="card" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong>Orden #{o.id}</strong>
                    <span className={`badge ${o.status === 'completed' ? 'badge--green' : 'badge--yellow'}`}>{o.status}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {orderItems.length} artículo(s)
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {new Date(o.created_at).toLocaleDateString('es-MX')}
                  </p>
                  <p style={{ fontWeight: 700, marginTop: 8 }}>${Number(o.total_amount || 0).toLocaleString('es-MX')} {o.currency || 'MXN'}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
