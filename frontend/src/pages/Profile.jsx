import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../api'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      getProfile(user.id).then(setProfile).catch(console.error).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout()
      navigate("/")
    }
  }

  if (loading) return <div className="page"><Loader text="Cargando perfil..." /></div>

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <header className="header" style={{ background: 'var(--color-primary)', color: 'white', borderBottom: 'none', justifyContent: 'flex-start', padding: '16px' }}>
        <button className="header__back" onClick={() => navigate('/app')} style={{ color: 'white', marginRight: '16px' }}>
          &#8592;
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Mi Perfil</h1>
      </header>
      
      <div className="container" style={{ marginTop: -20 }}>
        <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <div style={{ width: 96, height: 96, backgroundColor: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Icon name="user" className="w-10 h-10" />
            )}
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.fullName || 'Usuario'}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{user?.email || 'email@udlap.mx'}</p>
          {profile?.phone && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 4 }}><Icon name="phone" /> {profile.phone}</p>}
        </div>

        <div className="card fade-in" style={{ padding: 0, overflow: 'hidden', marginTop: 16 }}>
          {[
            { icon: 'credit-card', label: 'Métodos de pago', onClick: () => navigate('/payments') },
            { icon: 'bag', label: 'Mis publicaciones', onClick: () => navigate('/listings') },
            { icon: 'bag', label: 'Mis compras', onClick: () => navigate('/transactions') },
            { icon: 'settings', label: 'Configuración', onClick: () => navigate('/settings') },
            { icon: 'help', label: 'Soporte/Duda', onClick: () => navigate('/soporte') },
          ].map((item, i) => (
            <div key={i} onClick={item.onClick} style={{ display: 'flex', alignItems: 'center', padding: 16, borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, backgroundColor: '#f9fafb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Icon name={item.icon} className="w-5 h-5" />
              </div>
              <span style={{ flex: 1, fontWeight: 500 }}>{item.label}</span>
              <span style={{ color: '#9ca3af', fontWeight: 'bold' }}>&#8250;</span>
            </div>
          ))}
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', padding: 16, cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, backgroundColor: '#fee2e2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <Icon name="x" />
            </div>
            <span style={{ flex: 1, fontWeight: 500, color: '#dc2626' }}>Cerrar sesión</span>
          </div>
        </div>
      </div>
    </div>
  )
}
