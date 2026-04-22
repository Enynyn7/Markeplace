export default function Loader({ text = 'Cargando...' }) {
  return (
    <div className="loader" id="loader">
      <div className="spinner"></div>
      <span className="loader__text">{text}</span>
    </div>
  )
}
