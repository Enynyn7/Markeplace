import { useEffect, useState } from 'react'
import { getNotifications, markNotificationRead } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      getNotifications(user.id)
        .then(data => {
          setNotifications(Array.isArray(data) ? data : [])
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAll = async () => {
    const unread = notifications.filter(n => !n.is_read)
    for (let n of unread) {
      await markNotificationRead(n.id)
    }
    setNotifications(notifications.map(n => ({ ...n, is_read: true })))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  if (loading) return <div className="page"><Loader text="Cargando notificaciones..." /></div>

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <header className="header" style={{ background: 'var(--color-primary)', color: 'white', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Notificaciones</h1>
          {unreadCount > 0 && <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>{unreadCount} sin leer</p>}
        </div>
        <button onClick={handleMarkAll} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem' }}>
          Marcar todas
        </button>
      </header>

      <div className="container" style={{ marginTop: 16 }}>
        {notifications.length === 0 ? (
          <div className="card fade-in" style={{ textAlign: 'center', padding: 40 }}>
            <span style={{ color: '#cbd5e1' }}><Icon name="bell" className="w-10 h-10" /></span>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 16 }}>No tienes notificaciones</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map(n => (
              <div key={n.id} onClick={() => !n.is_read && handleMarkAsRead(n.id)} className="card fade-in" style={{ padding: 16, cursor: 'pointer', borderLeft: !n.is_read ? '4px solid var(--color-primary)' : 'none', opacity: n.is_read ? 1 : 0.7 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 40, height: 40, backgroundColor: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="bell" className="w-5 h-5" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', color: n.is_read ? 'var(--color-text-secondary)' : 'var(--color-text)' }}>{n.title || 'Notificación'}</h3>
                      {!n.is_read && <div style={{ width: 8, height: 8, backgroundColor: 'var(--color-primary)', borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>{n.message}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
