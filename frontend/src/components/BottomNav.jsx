import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Icon from './Icon'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <div className="bottom-nav__inner">
        <button onClick={() => navigate('/app')} className={isActive('/app') && location.pathname === '/app' ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="home" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Inicio</div>
        </button>

        <button onClick={() => navigate('/app/marketplace')} className={isActive('/app/marketplace') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="bag" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Marketplace</div>
        </button>

        <button onClick={() => navigate('/app/tickets')} className={isActive('/app/tickets') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="ticket" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Boletos</div>
        </button>

        <button onClick={() => navigate('/app/notifications')} className={isActive('/app/notifications') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="bell" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Alertas</div>
        </button>

        <button onClick={() => navigate('/app/profile')} className={isActive('/app/profile') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="user" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Perfil</div>
        </button>
      </div>
    </nav>
  )
}
