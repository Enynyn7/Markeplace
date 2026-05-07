import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <h1>Recuperar contraseña</h1>
          <p>
            La recuperación de contraseña todavía no está configurada con un proveedor real de correo o SMS.
          </p>
        </div>

        <div className="alert alert-warning">
          Por seguridad, esta función queda deshabilitada hasta integrar tokens reales de recuperación.
        </div>

        <button type="button" className="button button-primary" onClick={() => navigate('/login')}>
          Volver al inicio de sesión
        </button>
      </section>
    </main>
  )
}
