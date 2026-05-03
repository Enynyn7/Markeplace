import { useState, useEffect } from 'react'
import { getFAQs, submitSupportRequest } from '../api'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

function AccordionItem({ faq }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`accordion__item ${open ? 'open' : ''}`}>
      <button
        className="accordion__trigger"
        onClick={() => setOpen(!open)}
        id={`faq-trigger-${faq.id}`}
      >
        <span>{faq.question}</span>
        <span className="accordion__icon">▼</span>
      </button>
      <div className="accordion__content">
        <div className="accordion__body">{faq.answer}</div>
      </div>
    </div>
  )
}

export default function Support() {
  const [faqs, setFaqs] = useState([])
  const [loadingFaqs, setLoadingFaqs] = useState(true)
  const [faqError, setFaqError] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    user_id: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  useEffect(() => {
    loadFAQs()
  }, [])

  const loadFAQs = async () => {
    setLoadingFaqs(true)
    setFaqError(null)
    try {
      const result = await getFAQs()
      setFaqs(result.data || result)
    } catch (err) {
      setFaqError(err.message)
    } finally {
      setLoadingFaqs(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const result = await submitSupportRequest(formData)
      setSubmitResult({ type: 'success', message: result.message || '¡Solicitud enviada con éxito!' })
      setFormData({ user_id: '', subject: '', message: '' })
    } catch (err) {
      setSubmitResult({ type: 'error', message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page" id="page-support">
      <div className="container">
        <header className="page-header fade-in">
          <h1 className="page-header__title">Soporte y Ayuda</h1>
          <p className="page-header__subtitle">
            Encuentra respuestas rápidas o envíanos tu consulta
          </p>
        </header>

        {/* Quick Contact - Figma Style */}
        <div className="card fade-in" style={{ marginBottom: 16 }}>
          <h2 className="card__title" style={{ marginBottom: 16 }}>Contacto rápido</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="mailto:soporte@udlap.mx" className="icon-row" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon-row__icon icon-row__icon--orange"><Icon name="mail" /></div>
              <div className="icon-row__text">
                <strong>Email</strong>
                <span>soporte@udlap.mx</span>
              </div>
            </a>

            <a href="tel:+525512345678" className="icon-row" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon-row__icon icon-row__icon--green"><Icon name="phone" /></div>
              <div className="icon-row__text">
                <strong>Teléfono</strong>
                <span>+52 55 1234 5678</span>
              </div>
            </a>

            <button className="icon-row" onClick={() => alert("Chat en vivo próximamente")} style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', padding: 12 }}>
              <div className="icon-row__icon icon-row__icon--blue"><Icon name="help" /></div>
              <div className="icon-row__text">
                <strong>Chat en vivo</strong>
                <span>Disponible 9:00 - 18:00</span>
              </div>
            </button>
          </div>
        </div>

        {/* Contact Form - Figma Style */}
        <div className="card fade-in" style={{ marginBottom: 16 }}>
          <h2 className="card__title" style={{ marginBottom: 16 }}>Enviar mensaje</h2>
          
          <form className="form" onSubmit={handleSubmit} id="support-form">
            <div className="input-group">
              <label htmlFor="support-user-id">ID de usuario</label>
              <input
                type="number"
                className="input"
                id="support-user-id"
                name="user_id"
                placeholder="Ej: 3"
                value={formData.user_id}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>

            <div className="input-group">
              <label htmlFor="support-subject">Asunto</label>
              <input
                type="text"
                className="input"
                id="support-subject"
                name="subject"
                placeholder="¿En qué podemos ayudarte?"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="support-message">Mensaje</label>
              <textarea
                className="textarea"
                id="support-message"
                name="message"
                placeholder="Describe tu problema o pregunta..."
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
              />
            </div>

            <button
              type="submit"
              className="btn btn--orange btn--lg btn--block"
              disabled={submitting}
              id="support-submit-btn"
              style={{ marginTop: 8 }}
            >
              {submitting ? <><Icon name="clock" /> Enviando...</> : 'Enviar mensaje'}
            </button>
          </form>

          {submitResult && (
            <div
              className={`alert ${submitResult.type === 'success' ? 'alert--success' : 'alert--error'}`}
              style={{ marginTop: '16px' }}
              id="support-result"
            >
              <span>{submitResult.type === 'success' ? <Icon name="check" /> : <Icon name="warning" />}</span>
              {submitResult.message}
            </div>
          )}
        </div>

        {/* FAQs - Figma Style */}
        <div className="card fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: '1.25rem' }}><Icon name="help" /></span>
            <h2 className="card__title">Preguntas frecuentes</h2>
          </div>

          {loadingFaqs && <Loader text="Cargando preguntas frecuentes..." />}

          {faqError && (
            <div className="alert alert--error" id="faq-error">
              <span><Icon name="warning" className="w-4 h-4" /></span> {faqError}
            </div>
          )}

          {!loadingFaqs && !faqError && faqs.length === 0 && (
            <div className="empty-state">
              <span className="empty-state__icon"><Icon name="box" /></span>
              <p>No hay preguntas frecuentes disponibles</p>
            </div>
          )}

          {!loadingFaqs && faqs.length > 0 && (
            <div className="accordion stagger" id="faq-list">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} faq={faq} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
