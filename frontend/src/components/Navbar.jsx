import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const links = [
    { to: '/home', label: 'Inicio', icon: '🏠' },
    { to: '/dashboard', label: 'Finanzas', icon: '💰' },
    { to: '/marketplace', label: 'Marketplace', icon: '🛍️' },
    { to: '/boletos', label: 'Mis Boletos', icon: '🎟️' },
    { to: '/soporte', label: 'Ayuda', icon: '💬' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🎰</span>
          <span>Marketplace UDLAP</span>
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <li key={link.to} style={{ listStyle: 'none' }}>
              <Link
                to={link.to}
                className={`navbar__link ${isActive(link.to) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                id={`nav-link-${link.to.replace('/', '') || 'home'}`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}

          {/* Usuario + notificaciones + perfil + logout */}
          {user && (
            <li style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
              <Link to="/notificaciones" aria-label="Notificaciones" style={{ textDecoration: 'none', fontSize: '1.25rem' }}>
                🔔
              </Link>
              <Link 
                to="/perfil"
                id="navbar-user-name"
                style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>👤</span>
                <span>{user.firstName || user.fullName || user.email}</span>
              </Link>
              <button
                id="navbar-logout"
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'background var(--transition)',
                }}
                onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.35)'}
                onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                Salir
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
