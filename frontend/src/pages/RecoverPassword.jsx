import { useState } from 'react'
import Icon from '../components/Icon'
import { useNavigate } from 'react-router-dom'
import { recoverPassword } from '../api'

export default function RecoverPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await recoverPassword(email)
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      setError(err.message || 'Error al solicitar recuperación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" id="page-recover" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ justifyContent: 'space-between' }}>
        <button className="header__back" onClick={() => navigate(-1)} aria-label="Volver">&#8592;</button>
      </header>
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
        <div className="card fade-in" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 4 }}>Recuperar Contraseña</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
            Ingresa tu correo para recibir un código de recuperación.
          </p>
          {error && <div className="alert alert--error fade-in" style={{ marginBottom: 16 }}><span><Icon name="warning" className="w-4 h-4" /></span> {error}</div>}
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="recover-email">Email</label>
              <input id="recover-email" type="email" className="input" placeholder="correo@udlap.mx" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn--orange btn--lg btn--block" disabled={loading} style={{ marginTop: 16 }}>
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
