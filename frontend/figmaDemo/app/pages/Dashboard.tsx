import { useNavigate } from "react-router";
import { DollarSign, TrendingUp, AlertCircle, Calendar, CreditCard, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const financialData = {
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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-6">
        <h1 className="text-2xl font-semibold">Dashboard Financiero</h1>
        <p className="text-sm text-white/90 mt-1">{user?.name || "Estudiante Becado"}</p>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Financial Overview */}
        <div className="bg-gradient-to-br from-[#FF5722] to-[#f4511e] rounded-lg p-5 mb-4 text-white shadow-lg">
          <p className="text-sm text-white/80 mb-2">Balance Total</p>
          <p className="text-4xl font-bold mb-4">
            ${(financialData.tuition.pending + financialData.tickets.potentialDebt).toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-white/80">Colegiatura pendiente</p>
              <p className="font-semibold">${financialData.tuition.pending.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80">Boletos pendientes</p>
              <p className="font-semibold">${financialData.tickets.potentialDebt.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {financialData.tickets.pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  ¡Atención! Tienes {financialData.tickets.pending} boletos sin vender
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Fecha límite: {financialData.tickets.deadline}
                </p>
                <button
                  onClick={() => navigate("/app/tickets")}
                  className="text-xs text-yellow-800 font-semibold underline mt-2"
                >
                  Ver mis boletos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scholarship Info */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Mi Beca</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {financialData.scholarship.percentage}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{financialData.scholarship.type}</p>
          <p className="text-2xl font-bold text-[#4CAF50]">
            ${financialData.scholarship.amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Descuento aplicado este semestre</p>
        </div>

        {/* Tuition Status */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Colegiatura</h3>
            <span className="text-xs text-gray-500">{financialData.tuition.semester}</span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total semestre:</span>
              <span className="font-medium">${financialData.tuition.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pagado:</span>
              <span className="font-medium text-green-600">${financialData.tuition.paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pendiente:</span>
              <span className="font-medium text-red-600">${financialData.tuition.pending.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-[#4CAF50] h-2 rounded-full transition-all"
              style={{ width: `${(financialData.tuition.paid / financialData.tuition.amount) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {Math.round((financialData.tuition.paid / financialData.tuition.amount) * 100)}% completado
          </p>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Vence: {financialData.tuition.dueDate}</span>
            </div>
            <button
              onClick={() => navigate("/app/payments")}
              className="text-sm text-[#FF5722] font-semibold hover:underline"
            >
              Pagar ahora
            </button>
          </div>
        </div>

        {/* Tickets Status */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-semibold mb-3">Estado de Boletos</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Vendidos</p>
              <p className="text-2xl font-bold text-green-600">{financialData.tickets.sold}</p>
              <p className="text-xs text-gray-500 mt-1">${financialData.tickets.amountFromSales}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Sin vender</p>
              <p className="text-2xl font-bold text-red-600">{financialData.tickets.pending}</p>
              <p className="text-xs text-gray-500 mt-1">${financialData.tickets.potentialDebt}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/app/tickets")}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2.5 px-4 rounded-lg transition-colors"
          >
            Gestionar mis boletos
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/app/transactions")}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <FileText className="w-6 h-6 text-[#FF5722] mb-2" />
            <p className="text-sm font-medium">Historial</p>
          </button>
          <button
            onClick={() => navigate("/app/payments")}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <CreditCard className="w-6 h-6 text-[#FF5722] mb-2" />
            <p className="text-sm font-medium">Pagos</p>
          </button>
        </div>
      </div>
    </div>
  );
}
