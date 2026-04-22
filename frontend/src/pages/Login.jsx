import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'comunidad'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulamos un delay de red para el login
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="page" id="page-login" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Header naranja */}
      <header className="header" style={{ justifyContent: 'space-between' }}>
        <button className="header__back" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <button className="header__back">
          👤
        </button>
      </header>

      {/* Contenido */}
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>UDLAP</h1>
        </div>

        <div className="card fade-in" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                className="input"
                placeholder="correo@udlap.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                className="input"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--orange btn--lg btn--block"
              disabled={loading}
              style={{ marginTop: 16 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <button
              type="button"
              className="btn btn--block"
              style={{ background: 'transparent', color: 'var(--color-text-secondary)', textDecoration: 'underline', marginTop: 16, fontSize: '0.875rem' }}
              onClick={() => alert("Función de recuperación no implementada")}
            >
              ¿Olvidaste la contraseña?
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
