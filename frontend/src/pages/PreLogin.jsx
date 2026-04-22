import { useNavigate } from 'react-router-dom'

export default function PreLogin() {
  const navigate = useNavigate()

  return (
    <div className="page" id="page-prelogin" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Header naranja */}
      <div style={{ background: 'var(--color-primary)', height: 96, width: '100%' }}></div>

      {/* Contenido */}
      <div className="container fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: 12 }}>UDLAP</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 40, maxWidth: 300, lineHeight: 1.4 }}>
          Sistema de Gestión y Marketplace de Boletos, Productos y Servicios
        </p>

        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            onClick={() => navigate('/login?type=comunidad')}
            className="btn btn--orange btn--lg btn--block"
            style={{ borderRadius: 999, boxShadow: 'var(--shadow-md)' }}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => alert("Registro no implementado")}
            className="btn btn--green btn--lg btn--block"
            style={{ borderRadius: 999, boxShadow: 'var(--shadow-md)' }}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )
}
