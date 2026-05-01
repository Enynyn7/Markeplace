import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFinancialAccounts, getFinancialMovements } from '../api'
import Loader from '../components/Loader'
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
        <header className="page-header fade-in" style={{ textAlign: 'left', marginBottom: 24 }}>
          <h1 className="page-header__title" style={{ fontSize: '1.75rem' }}>Dashboard Financiero</h1>
          <p className="page-header__subtitle">{user?.fullName || "Estudiante Becado"}</p>
        </header>

        {error && (
          <div className="alert alert--error fade-in">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="stagger">
          {/* Overview */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #FF5722, #f4511e)', color: 'white', border: 'none' }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Balance Total</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '8px 0 16px' }}>
              ${(financialData.tuition.pending + financialData.tickets.potentialDebt).toLocaleString('es-MX')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <div>
                <p style={{ opacity: 0.9 }}>Colegiatura pendiente</p>
                <p style={{ fontWeight: 600 }}>${financialData.tuition.pending.toLocaleString('es-MX')}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ opacity: 0.9 }}>Boletos pendientes</p>
                <p style={{ fontWeight: 600 }}>${financialData.tickets.potentialDebt.toLocaleString('es-MX')}</p>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {financialData.tickets.pending > 0 && (
            <div className="alert alert--error" style={{ background: 'var(--color-yellow-light)', borderColor: 'var(--color-yellow-border)', color: 'var(--color-yellow-text)', alignItems: 'flex-start' }}>
              <span style={{ marginTop: 2 }}>⚠️</span>
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
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>📅 Vence: {financialData.tuition.dueDate}</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
             <button className="btn btn--outline" onClick={() => navigate('/transactions')} style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
               <span style={{ fontSize: '1.5rem' }}>📄</span>
               <span>Historial</span>
             </button>
             <button className="btn btn--outline" onClick={() => navigate('/payments')} style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
               <span style={{ fontSize: '1.5rem' }}>💳</span>
               <span>Pagos</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  )
}
