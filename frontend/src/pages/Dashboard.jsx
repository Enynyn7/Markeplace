import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFinancialAccounts } from '../api'
import Loader from '../components/Loader'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Data local combinada con API
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

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      const data = await getFinancialAccounts()
      const account = Array.isArray(data) ? data[0] : data
      
      // Ajustamos el pending usando el balance de la API si existe
      if (account && account.balance !== undefined) {
        setFinancialData(prev => ({
          ...prev,
          balanceTotal: account.balance,
          tuition: {
            ...prev.tuition,
            pending: account.balance
          }
        }))
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
        <header className="page-header fade-in" style={{ textAlign: 'left' }}>
          <h1 className="page-header__title">Dashboard Financiero</h1>
          <p className="page-header__subtitle">Estudiante Becado</p>
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
            <div className="alert alert--error" style={{ background: 'var(--color-yellow-light)', borderColor: 'var(--color-yellow-border)', color: 'var(--color-yellow-text)' }}>
              <span>⚠️</span>
              <div>
                <strong style={{ display: 'block' }}>¡Atención! Tienes {financialData.tickets.pending} boletos sin vender</strong>
                <span style={{ fontSize: '0.75rem' }}>Fecha límite: {financialData.tickets.deadline}</span>
              </div>
            </div>
          )}

          {/* Beca */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 600 }}>Mi Beca</h3>
              <span className="badge badge--blue">{financialData.scholarship.percentage}%</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              {financialData.scholarship.type}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-green)' }}>
              ${financialData.scholarship.amount.toLocaleString('es-MX')}
            </p>
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
              <div style={{ background: 'var(--color-green)', height: '100%', width: `${(financialData.tuition.paid / financialData.tuition.amount) * 100}%` }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
              {Math.round((financialData.tuition.paid / financialData.tuition.amount) * 100)}% completado
            </p>
          </div>

          {/* Acciones */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
             <button className="btn btn--outline" onClick={() => navigate('/boletos')} style={{ padding: 16 }}>
               🎟️ Mis Boletos
             </button>
             <button className="btn btn--orange" style={{ padding: 16 }}>
               💳 Pagar ahora
             </button>
          </div>

        </div>
      </div>
    </div>
  )
}
