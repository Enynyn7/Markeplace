import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

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
        </ul>
      </div>
    </nav>
  )
}
