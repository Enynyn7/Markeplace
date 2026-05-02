import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from '../api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const defaultEmail = location.state?.email || ''
  
  const [email, setEmail] = useState(defaultEmail)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await resetPassword(email, code, newPassword)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Error al restablecer contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" id="page-reset" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ justifyContent: 'space-between' }}>
        <button className="header__back" onClick={() => navigate('/login')} aria-label="Volver">&#8592;</button>
      </header>
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
        <div className="card fade-in" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 4 }}>Restablecer Contraseña</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
            Ingresa el código que te enviamos y tu nueva contraseña.
          </p>
          {error && <div className="alert alert--error fade-in" style={{ marginBottom: 16 }}><span>⚠️</span> {error}</div>}
          {success && <div className="alert alert--success fade-in" style={{ marginBottom: 16 }}><span>✅</span> Contraseña actualizada. Redirigiendo...</div>}
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="reset-email">Email</label>
              <input id="reset-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="reset-code">Código SMS/Email</label>
              <input id="reset-code" type="text" className="input" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="reset-new-password">Nueva Contraseña</label>
              <input id="reset-new-password" type="password" className="input" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="btn btn--orange btn--lg btn--block" disabled={loading} style={{ marginTop: 16 }}>
              {loading ? 'Restableciendo...' : 'Restablecer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
