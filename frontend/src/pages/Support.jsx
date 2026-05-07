import { useState, useEffect, useMemo } from 'react'
import { getFAQs, submitSupportRequest } from '../api'
import { useAuth } from '../context/AuthContext'
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
  const { user } = useAuth()

  const [faqs, setFaqs] = useState([])
  const [loadingFaqs, setLoadingFaqs] = useState(true)
  const [faqError, setFaqError] = useState(null)

  const [formData, setFormData] = useState({
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
      setFaqs(Array.isArray(result?.data) ? result.data : result)
    } catch (err) {
      setFaqError(err.message || 'No se pudieron cargar las preguntas frecuentes')
    } finally {
      setLoadingFaqs(false)
    }
  }

  const handleInputChange = (e) => {
    setSubmitResult(null)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const canSubmit = useMemo(() => {
    return Boolean(
      user?.id &&
      formData.subject.trim() &&
      formData.message.trim() &&
      !submitting
    )
  }, [user, formData, submitting])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user?.id) {
      setSubmitResult({
        type: 'error',
        message: 'Debes iniciar sesión para enviar una solicitud de soporte.',
      })
      return
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      setSubmitResult({
        type: 'error',
        message: 'Asunto y mensaje son obligatorios.',
      })
      return
    }

    setSubmitting(true)
    setSubmitResult(null)

    try {
      const result = await submitSupportRequest({
        user_id: user.id,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      })

      setSubmitResult({
        type: 'success',
        message: result.message || 'Solicitud enviada correctamente.',
      })

      setFormData({
        subject: '',
        message: '',
      })
    } catch (err) {
      setSubmitResult({
        type: 'error',
        message: err.message || 'No se pudo enviar la solicitud.',
      })
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
            Consulta preguntas frecuentes o envía una solicitud desde tu cuenta.
          </p>
        </header>

        <div className="card fade-in" style={{ marginBottom: 16 }}>
          <h2 className="card__title" style={{ marginBottom: 16 }}>Canales disponibles</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="icon-row">
              <div className="icon-row__icon icon-row__icon--orange">
                <Icon name="mail" />
              </div>
              <div className="icon-row__text">
                <strong>Formulario de soporte</strong>
                <span>La solicitud se guarda en el sistema y queda asociada a tu usuario.</span>
              </div>
            </div>

            <div className="icon-row">
              <div className="icon-row__icon icon-row__icon--blue">
                <Icon name="help" />
              </div>
              <div className="icon-row__text">
                <strong>Preguntas frecuentes</strong>
                <span>Las respuestas se cargan desde la base de datos.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card fade-in" style={{ marginBottom: 16 }}>
          <h2 className="card__title" style={{ marginBottom: 16 }}>Enviar solicitud</h2>

          {!user?.id && (
            <div className="alert alert--error" style={{ marginBottom: 16 }}>
              <span><Icon name="warning" /></span>
              Debes iniciar sesión para enviar una solicitud de soporte.
            </div>
          )}

          <form className="form" onSubmit={handleSubmit} id="support-form">
            <div className="input-group">
              <label>Usuario</label>
              <input
                type="text"
                className="input"
                value={user?.email || 'Sin sesión activa'}
                disabled
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
              disabled={!canSubmit}
              id="support-submit-btn"
              style={{ marginTop: 8 }}
            >
              {submitting ? <><Icon name="clock" /> Enviando...</> : 'Enviar solicitud'}
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

        <div className="card fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: '1.25rem' }}><Icon name="help" /></span>
            <h2 className="card__title">Preguntas frecuentes</h2>
          </div>

          {loadingFaqs && <Loader text="Cargando preguntas frecuentes..." />}

          {faqError && (
            <div className="alert alert--error" id="faq-error">
              <span><Icon name="warning" /></span> {faqError}
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
