import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

const SETTINGS_KEY = 'udlap_settings'

export default function Settings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    marketingEmails: false,
    language: 'es-MX',
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (raw) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(raw) }))
      }
    } catch {
      // ignore corrupted local settings
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="page" id="page-settings">
      <header className="header" style={{ justifyContent: 'flex-start', gap: 12 }}>
        <button className="header__back" onClick={() => navigate('/perfil')} aria-label="Volver">
          <Icon name="chevron-left" className="w-5 h-5" />
        </button>
        <h1 className="header__title">Configuración</h1>
      </header>

      <div className="container" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Notificaciones</h2>
          </div>

          <div className="icon-row" style={{ justifyContent: 'space-between' }}>
            <div>
              <strong>Push</strong>
              <span style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Alertas en app</span>
            </div>
            <button className="btn btn--outline" style={{ padding: '6px 10px' }} onClick={() => toggle('pushNotifications')}>
              {settings.pushNotifications ? 'On' : 'Off'}
            </button>
          </div>

          <div className="icon-row" style={{ justifyContent: 'space-between' }}>
            <div>
              <strong>Email</strong>
              <span style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Resumen por correo</span>
            </div>
            <button className="btn btn--outline" style={{ padding: '6px 10px' }} onClick={() => toggle('emailNotifications')}>
              {settings.emailNotifications ? 'On' : 'Off'}
            </button>
          </div>

          <div className="icon-row" style={{ justifyContent: 'space-between' }}>
            <div>
              <strong>Promociones</strong>
              <span style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Comunicaciones comerciales</span>
            </div>
            <button className="btn btn--outline" style={{ padding: '6px 10px' }} onClick={() => toggle('marketingEmails')}>
              {settings.marketingEmails ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Cuenta</h2>
          </div>
          <button className="btn btn--outline btn--block" onClick={() => navigate('/recover-password')}>
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  )
}
