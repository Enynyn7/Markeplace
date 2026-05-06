import { useState } from 'react'
import Icon from '../components/Icon'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/app')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" id="page-login" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>

      {/* Header naranja */}
      <header className="header" style={{ justifyContent: 'space-between' }}>
        <button className="header__back" onClick={() => navigate(-1)} aria-label="Volver">
          &#8592;
        </button>
        <div style={{ width: 40 }}></div>
      </header>

      {/* Contenido */}
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
            UDLAP
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: 4 }}>
            Marketplace
          </p>
        </div>

        <div className="card fade-in" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 4 }}>Iniciar Sesión</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
            Ingresa tus credenciales para continuar
          </p>

          {/* Mensaje de error */}
          {error && (
            <div className="alert alert--error fade-in" id="login-error" style={{ marginBottom: 16 }}>
              <span><Icon name="warning" className="w-4 h-4" /></span>
              <div>
                <strong style={{ display: 'block' }}>{error}</strong>
                {error.toLowerCase().includes('credenciales') && (
                  <span style={{ fontSize: '0.8125rem' }}>
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}
                    >
                      Regístrate aquí
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="correo@udlap.mx"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                required
                autoComplete="current-password"
              />
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => navigate('/recover-password')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8125rem', cursor: 'pointer', padding: 0 }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn--orange btn--lg btn--block"
              disabled={loading}
              style={{ marginTop: 16 }}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Link a registro */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            ¿No tienes cuenta?{' '}
            <button
              id="go-to-register"
              type="button"
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
