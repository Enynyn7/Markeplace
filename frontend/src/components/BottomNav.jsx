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
        <button onClick={() => navigate('/dashboard')} className={isActive('/dashboard') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="home" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Inicio</div>
        </button>

        <button onClick={() => navigate('/marketplace')} className={isActive('/marketplace') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="bag" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Marketplace</div>
        </button>

        <button onClick={() => navigate('/boletos')} className={isActive('/boletos') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="ticket" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Boletos</div>
        </button>

        <button onClick={() => navigate('/notificaciones')} className={isActive('/notificaciones') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="bell" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Alertas</div>
        </button>

        <button onClick={() => navigate('/perfil')} className={isActive('/perfil') ? 'bottom-nav__btn active' : 'bottom-nav__btn'}>
          <Icon name="user" className="bottom-nav__icon" />
          <div className="bottom-nav__label">Perfil</div>
        </button>
      </div>
    </nav>
  )
}
