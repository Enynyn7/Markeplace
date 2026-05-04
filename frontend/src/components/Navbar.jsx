import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const links = [
    { to: '/dashboard', label: 'Inicio', icon: 'home' },
    { to: '/dashboard', label: 'Finanzas', icon: 'dollar' },
    { to: '/marketplace', label: 'Marketplace', icon: 'bag' },
    { to: '/boletos', label: 'Boletos', icon: 'ticket' },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner">
        <Link to="/dashboard" className="navbar__logo">
          <span className="navbar__logo-icon"><Icon name="ticket" className="w-5 h-5" /></span>
          <span>Marketplace UDLAP</span>
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          {menuOpen ? <Icon name="x" className="w-5 h-5" /> : <Icon name="menu" className="w-5 h-5" />}
        </button>

        <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <li key={link.to} style={{ listStyle: 'none' }}>
              <Link
                to={link.to}
                className={`navbar__link ${isActive(link.to) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                id={`nav-link-${link.to.replace('/', '') || 'dashboard'}`}
              >
                <Icon name={link.icon} className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}

          {/* Usuario + notificaciones + perfil + logout */}
          {user ? (
            <li style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
              <Link to="/notificaciones" aria-label="Notificaciones" style={{ textDecoration: 'none', fontSize: '1.25rem', color: 'white' }}>
                <Icon name="bell" className="w-5 h-5" />
              </Link>
              <Link
                to="/perfil"
                id="navbar-user-name"
                style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.95)', whiteSpace: 'nowrap', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Icon name="user" className="w-4 h-4" />
                <span>{user.firstName || user.fullName || user.email}</span>
              </Link>
              <button
                id="navbar-logout"
                onClick={handleLogout}
                className="btn"
                style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.12)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
              >
                Salir
              </button>
            </li>
          ) : (
            <li style={{ listStyle: 'none', marginLeft: 8 }}>
              <Link to="/login" className="navbar__link" id="nav-link-login">Ingresar</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
