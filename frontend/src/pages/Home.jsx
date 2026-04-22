import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page" id="page-home">
      <div className="container">
        {/* Hero — orange header like Figma */}
        <section className="hero fade-in">
          <h1 className="hero__title">UDLAP</h1>
          <p className="hero__subtitle">
            Sistema de Gestión y Marketplace de Boletos, Productos y Servicios
          </p>
          <div className="hero__actions">
            <Link to="/boletos" className="hero__btn--primary" id="cta-boletos">
              🎟️ Ver Boletos
            </Link>
            <Link to="/productos" className="hero__btn--secondary" id="cta-productos">
              🛍️ Marketplace
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="features">
          <h2 className="features__title">¿Qué puedes hacer?</h2>
          <div className="features__grid stagger">
            <Link to="/boletos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card feature-card" id="feature-boletos">
                <span className="feature-card__icon">🎟️</span>
                <h3 className="feature-card__title">Detalle de Boletos</h3>
                <p className="feature-card__desc">
                  Consulta folio, comprador, evidencia de pago y estado de tus boletos.
                </p>
              </div>
            </Link>
            <Link to="/productos" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card feature-card" id="feature-productos">
                <span className="feature-card__icon">🛍️</span>
                <h3 className="feature-card__title">Detalle de Productos</h3>
                <p className="feature-card__desc">
                  Explora productos con imágenes, precio y disponibilidad.
                </p>
              </div>
            </Link>
            <Link to="/soporte" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card feature-card" id="feature-soporte">
                <span className="feature-card__icon">💬</span>
                <h3 className="feature-card__title">Soporte y FAQ</h3>
                <p className="feature-card__desc">
                  Preguntas frecuentes y formulario de contacto directo.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
