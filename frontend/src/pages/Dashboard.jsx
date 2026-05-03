import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFinancialAccounts, getFinancialMovements } from '../api'
import Loader from '../components/Loader'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [financialData, setFinancialData] = useState({
    balanceTotal: 0,
    tuition: {
      semester: "Primavera 2026",
      amount: 95000,
      paid: 45000,
      pending: 50000,
      dueDate: "15 de Abril, 2026",
    },
    tickets: {
      assigned: 10,
      sold: 5,
      pending: 5,
      amountFromSales: 2500,
      potentialDebt: 2500,
      deadline: "15 de Mayo, 2026",
    },
    scholarship: {
      type: "Beca Académica",
      percentage: 60,
      amount: 57000,
    },
  })

  const [movements, setMovements] = useState([])

  useEffect(() => {
    fetchFinancialData()
  }, [user])

  const fetchFinancialData = async () => {
    if (!user) return;
    try {
      const data = await getFinancialAccounts(user.id)
      const account = Array.isArray(data) ? data[0] : data
      
      if (account) {
        setFinancialData(prev => ({
          ...prev,
          balanceTotal: Number(account.balance) || 0,
          tuition: {
            ...prev.tuition,
            pending: Number(account.balance) || 0
          }
        }))
        
        try {
          const movs = await getFinancialMovements(account.id)
          if (Array.isArray(movs)) {
            const filtered = movs.filter(m => m.financial_account_id === account.id).reverse()
            setMovements(filtered)
          }
        } catch (movErr) {
          console.error("No se pudieron cargar los movimientos:", movErr)
        }
      }
    } catch (err) {
      setError("Error cargando cuenta financiera: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="page container"><Loader text="Cargando finanzas..." /></div>
  }

  return (
    <div className="page" id="page-dashboard">
      <div className="container">
        <header className="header fade-in" style={{ marginBottom: 16 }}>
          <div>
            <h1 className="header__title">Dashboard Financiero</h1>
            <p className="header__subtitle">{user?.fullName || "Estudiante Becado"}</p>
          </div>
        </header>

        {error && (
          <div className="alert alert--error fade-in">
            <span><Icon name="warning" className="w-4 h-4" /></span> {error}
          </div>
        )}

        <div className="stagger">
          {/* Overview */}
          <div className="card dashboard-overview-card">
            <p className="dashboard-overview-label">Balance Total</p>
            <p className="dashboard-overview-amount">
              ${(financialData.tuition.pending + financialData.tickets.potentialDebt).toLocaleString('es-MX')}
            </p>
            <div className="dashboard-overview-split">
              <div>
                <p className="dashboard-overview-sub">Colegiatura pendiente</p>
                <p className="dashboard-overview-subvalue">${financialData.tuition.pending.toLocaleString('es-MX')}</p>
              </div>
              <div className="dashboard-overview-right">
                <p className="dashboard-overview-sub">Boletos pendientes</p>
                <p className="dashboard-overview-subvalue">${financialData.tickets.potentialDebt.toLocaleString('es-MX')}</p>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {financialData.tickets.pending > 0 && (
              <div className="alert alert--error" style={{ background: 'var(--color-yellow-light)', borderColor: 'var(--color-yellow-border)', color: 'var(--color-yellow-text)', alignItems: 'flex-start' }}>
                <span style={{ marginTop: 2 }}><Icon name="warning" className="w-4 h-4" /></span>
              <div>
                <strong style={{ display: 'block', marginBottom: 4 }}>¡Atención! Tienes {financialData.tickets.pending} boletos sin vender</strong>
                <span style={{ fontSize: '0.75rem', display: 'block' }}>Fecha límite: {financialData.tickets.deadline}</span>
                <button onClick={() => navigate('/boletos')} style={{ background: 'none', border: 'none', color: 'var(--color-yellow-text)', textDecoration: 'underline', fontSize: '0.75rem', padding: 0, marginTop: 8, cursor: 'pointer', fontWeight: 600 }}>
                  Ver mis boletos
                </button>
              </div>
            </div>
          )}

          {/* Beca */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 600 }}>Mi Beca</h3>
              <span className="badge badge--blue" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{financialData.scholarship.percentage}%</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              {financialData.scholarship.type}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-green)' }}>
              ${financialData.scholarship.amount.toLocaleString('es-MX')}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>Descuento aplicado este semestre</p>
          </div>

          {/* Estado de Boletos */}
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Estado de Boletos</h3>
            <div className="tickets-stats-grid" style={{ marginBottom: 16 }}>
              <div className="ticket-state-box ticket-state-box--sold">
                <p className="ticket-state-box__label">Vendidos</p>
                <p className="ticket-state-box__value">{financialData.tickets.sold}</p>
                <p className="ticket-state-box__meta">${financialData.tickets.amountFromSales.toLocaleString('es-MX')}</p>
              </div>
              <div className="ticket-state-box ticket-state-box--pending">
                <p className="ticket-state-box__label">Sin vender</p>
                <p className="ticket-state-box__value">{financialData.tickets.pending}</p>
                <p className="ticket-state-box__meta">${financialData.tickets.potentialDebt.toLocaleString('es-MX')}</p>
              </div>
            </div>
            <button className="btn btn--green btn--block" onClick={() => navigate('/boletos')}>
              Gestionar mis boletos
            </button>
          </div>

          {/* Colegiatura */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Colegiatura</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{financialData.tuition.semester}</span>
            </div>
            
            <div className="info-row">
              <span className="info-row__label">Total semestre</span>
              <span className="info-row__value">${financialData.tuition.amount.toLocaleString('es-MX')}</span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Pagado</span>
              <span className="info-row__value" style={{ color: 'var(--color-green)' }}>${financialData.tuition.paid.toLocaleString('es-MX')}</span>
            </div>
            <div className="info-row" style={{ borderBottom: 'none' }}>
              <span className="info-row__label">Pendiente</span>
              <span className="info-row__value" style={{ color: 'var(--color-red)' }}>${financialData.tuition.pending.toLocaleString('es-MX')}</span>
            </div>

            <div style={{ background: '#e5e7eb', height: 8, borderRadius: 4, margin: '16px 0 8px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--color-green)', height: '100%', width: `${(financialData.tuition.paid / financialData.tuition.amount) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
              {Math.round((financialData.tuition.paid / financialData.tuition.amount) * 100)}% completado
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}><Icon name="calendar" className="w-4 h-4" /> Vence: {financialData.tuition.dueDate}</span>
              <button onClick={() => navigate('/payments')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Pagar ahora
              </button>
            </div>
          </div>

          {/* Historial de Movimientos Reales */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Movimientos Recientes</h3>
            </div>
            
            {movements.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                No hay movimientos registrados.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {movements.slice(0, 5).map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{m.description || 'Transacción'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {new Date(m.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{ fontWeight: 600, color: Number(m.amount) >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                      {Number(m.amount) >= 0 ? '+' : ''}${Math.abs(Number(m.amount)).toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}
                {movements.length > 5 && (
                  <button onClick={() => navigate('/transactions')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', textAlign: 'center', marginTop: 8 }}>
                    Ver todo el historial
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Acciones Rápidas */}
          <div className="dashboard-quick-grid">
             <button className="btn btn--outline dashboard-quick-btn" onClick={() => navigate('/transactions')}>
               <Icon name="box" className="dashboard-quick-btn__icon" />
               <span>Mis compras</span>
             </button>
             <button className="btn btn--outline dashboard-quick-btn" onClick={() => navigate('/payments')}>
               <Icon name="credit-card" className="dashboard-quick-btn__icon" />
               <span>Métodos de pago</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  )
}
