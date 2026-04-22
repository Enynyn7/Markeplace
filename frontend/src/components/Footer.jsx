export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <p className="footer__text">
          © {new Date().getFullYear()} Marketplace UDLAP — Proyecto de Ingeniería de Software
        </p>
        <div className="footer__links">
          <span className="footer__link">Sprint 2</span>
          <span className="footer__link">Developer 3 — Frontend</span>
        </div>
      </div>
    </footer>
  )
}
