import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPaymentMethod, deletePaymentMethod, getPaymentMethods } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import Icon from '../components/Icon'

export default function Payments() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    method_type: 'credit_card',
    provider: '',
    last4: '',
  })

  const loadMethods = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPaymentMethods()
      const list = Array.isArray(data) ? data : []
      const mine = list.filter((m) => String(m.user_id) === String(user?.id))
      setMethods(mine)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadMethods()
    } else {
      setLoading(false)
    }
  }, [user])

  const canSave = useMemo(() => {
    return Boolean(form.provider.trim() && /^\d{4}$/.test(form.last4))
  }, [form])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!user?.id || !canSave) return

    setSaving(true)
    setError(null)
    try {
      await createPaymentMethod({
        user_id: user.id,
        method_type: form.method_type,
        provider: form.provider.trim(),
        last4: form.last4,
        status: 'active',
      })
      setForm({ method_type: 'credit_card', provider: '', last4: '' })
      await loadMethods()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este método de pago?')) return
    try {
      await deletePaymentMethod(id)
      setMethods((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page"><Loader text="Cargando métodos de pago..." /></div>

  return (
    <div className="page" id="page-payments">
      <header className="header" style={{ justifyContent: 'flex-start', gap: 12 }}>
        <button className="header__back" onClick={() => navigate('/perfil')} aria-label="Volver">
          <Icon name="chevron-left" className="w-5 h-5" />
        </button>
        <h1 className="header__title">Métodos de pago</h1>
      </header>

      <div className="container" style={{ marginTop: 12 }}>
        {error && (
          <div className="alert alert--error">
            <span><Icon name="warning" className="w-4 h-4" /></span>
            <span>{error}</span>
          </div>
        )}

        <div className="card">
          <h2 className="card__title" style={{ marginBottom: 12 }}>Agregar método</h2>
          <form onSubmit={handleCreate} className="form">
            <div className="input-group">
              <label htmlFor="payment-type">Tipo</label>
              <select
                id="payment-type"
                className="input"
                value={form.method_type}
                onChange={(e) => setForm((prev) => ({ ...prev, method_type: e.target.value }))}
              >
                <option value="credit_card">Tarjeta de crédito</option>
                <option value="debit_card">Tarjeta de débito</option>
                <option value="bank_transfer">Transferencia</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="payment-provider">Proveedor/Banco</label>
              <input
                id="payment-provider"
                className="input"
                value={form.provider}
                onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
                placeholder="Ej: Visa, BBVA"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="payment-last4">Últimos 4 dígitos</label>
              <input
                id="payment-last4"
                className="input"
                value={form.last4}
                onChange={(e) => setForm((prev) => ({ ...prev, last4: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                placeholder="1234"
                required
              />
            </div>

            <button type="submit" className="btn btn--green btn--block" disabled={!canSave || saving}>
              {saving ? 'Guardando...' : 'Guardar método'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card__title" style={{ marginBottom: 12 }}>Mis métodos</h2>
          {methods.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon"><Icon name="credit-card" className="w-10 h-10" /></span>
              <p>No tienes métodos de pago guardados</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {methods.map((m) => (
                <div key={m.id} className="icon-row" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="icon-row__icon icon-row__icon--orange"><Icon name="credit-card" className="w-5 h-5" /></div>
                    <div>
                      <strong style={{ display: 'block' }}>{m.provider || 'Método'}</strong>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{m.method_type} •••• {m.last4 || '----'}</span>
                    </div>
                  </div>
                  <button className="btn btn--outline" style={{ padding: '8px 10px' }} onClick={() => handleDelete(m.id)}>
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
