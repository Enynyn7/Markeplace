import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [errors, setErrors]   = useState({})
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
    setApiError(null)
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'El nombre es obligatorio'
    if (!form.lastName.trim())  e.lastName  = 'El apellido es obligatorio'
    if (!form.email.trim())     e.email     = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password)         e.password  = 'La contraseña es obligatoria'
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (!form.confirmPassword)  e.confirmPassword = 'Confirma tu contraseña'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError(null)

    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
      })
      setSuccess(true)
      setTimeout(() => navigate('/home'), 1800)
    } catch (err) {
      setApiError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  /* ── Pantalla de éxito ── */
  if (success) {
    return (
      <div id="page-register-success" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>
        <div className="card fade-in" style={{ textAlign: 'center', padding: 40, maxWidth: 380 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>
            ✅
          </div>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>¡Cuenta creada!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
            Tu cuenta fue creada exitosamente. Redirigiendo…
          </p>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      </div>
    )
  }

  /* ── Formulario ── */
  return (
    <div className="page" id="page-register" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>

      {/* Header naranja */}
      <header className="header" style={{ justifyContent: 'flex-start', gap: 12 }}>
        <button className="header__back" onClick={() => navigate(-1)} aria-label="Volver">
          &#8592;
        </button>
        <span className="header__title">Crear Cuenta</span>
      </header>

      {/* Contenido */}
      <div className="container" style={{ flex: 1, paddingTop: 24, paddingBottom: 40 }}>

        {/* Ícono de avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '2rem', color: 'white' }}>
            👤
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 12 }}>
            Únete al Marketplace UDLAP
          </p>
        </div>

        <div className="card fade-in" style={{ padding: 24 }}>

          {/* Error de API */}
          {apiError && (
            <div className="alert alert--error fade-in" id="register-api-error" style={{ marginBottom: 16 }}>
              <span>⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Nombre */}
            <div className="input-group">
              <label htmlFor="reg-firstName">Nombre *</label>
              <input
                id="reg-firstName"
                type="text"
                className={`input${errors.firstName ? ' input--error' : ''}`}
                placeholder="Tu nombre"
                value={form.firstName}
                onChange={handleChange('firstName')}
                autoComplete="given-name"
              />
              {errors.firstName && <span style={{ color: 'var(--color-red)', fontSize: '0.8125rem' }}>{errors.firstName}</span>}
            </div>

            {/* Apellido */}
            <div className="input-group">
              <label htmlFor="reg-lastName">Apellido *</label>
              <input
                id="reg-lastName"
                type="text"
                className={`input${errors.lastName ? ' input--error' : ''}`}
                placeholder="Tu apellido"
                value={form.lastName}
                onChange={handleChange('lastName')}
                autoComplete="family-name"
              />
              {errors.lastName && <span style={{ color: 'var(--color-red)', fontSize: '0.8125rem' }}>{errors.lastName}</span>}
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="reg-email">Correo electrónico *</label>
              <input
                id="reg-email"
                type="email"
                className={`input${errors.email ? ' input--error' : ''}`}
                placeholder="correo@udlap.mx"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
              />
              {errors.email && <span style={{ color: 'var(--color-red)', fontSize: '0.8125rem' }}>{errors.email}</span>}
            </div>

            {/* Teléfono (opcional) */}
            <div className="input-group">
              <label htmlFor="reg-phone">Teléfono <span style={{ color: 'var(--color-text-muted)' }}>(opcional)</span></label>
              <input
                id="reg-phone"
                type="tel"
                className="input"
                placeholder="+52 222 000 0000"
                value={form.phone}
                onChange={handleChange('phone')}
                autoComplete="tel"
              />
            </div>

            {/* Contraseña */}
            <div className="input-group">
              <label htmlFor="reg-password">Contraseña *</label>
              <input
                id="reg-password"
                type="password"
                className={`input${errors.password ? ' input--error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange('password')}
                autoComplete="new-password"
              />
              {errors.password && <span style={{ color: 'var(--color-red)', fontSize: '0.8125rem' }}>{errors.password}</span>}
            </div>

            {/* Confirmar contraseña */}
            <div className="input-group">
              <label htmlFor="reg-confirm">Confirmar contraseña *</label>
              <input
                id="reg-confirm"
                type="password"
                className={`input${errors.confirmPassword ? ' input--error' : ''}`}
                placeholder="Repite tu contraseña"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span style={{ color: 'var(--color-red)', fontSize: '0.8125rem' }}>{errors.confirmPassword}</span>}
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn--green btn--lg btn--block"
              disabled={loading}
              style={{ marginTop: 8, borderRadius: 999 }}
            >
              {loading ? 'Creando cuenta…' : 'Crear Cuenta'}
            </button>
          </form>
        </div>

        {/* Link a login */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            ¿Ya tienes cuenta?{' '}
            <button
              id="go-to-login"
              type="button"
              onClick={() => navigate('/login')}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
