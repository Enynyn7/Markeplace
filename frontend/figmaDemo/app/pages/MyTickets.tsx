import { ChevronRight, QrCode, Calendar, Users, DollarSign, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function MyTickets() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Datos del estudiante becado
  const studentData = {
    totalAssigned: 10,
    sold: 5,
    pending: 5,
    deadline: "15 de Mayo, 2026",
    amountOwed: 2500, // pending * 500
    amountPaid: 2500, // sold * 500
  };

  const myTickets = [
    {
      id: 1,
      event: "Sorteo UDLAP 2026",
      buyer: "Juan Pérez García",
      date: "10 de Marzo, 2026",
      amount: 500,
      status: "pagado",
      ticketNumber: "A-12345",
      token: "ABC123XYZ",
    },
    {
      id: 2,
      event: "Sorteo UDLAP 2026",
      buyer: "María Rodríguez",
      date: "12 de Marzo, 2026",
      amount: 500,
      status: "pagado",
      ticketNumber: "A-12346",
      token: "DEF456UVW",
    },
    {
      id: 3,
      event: "Sorteo UDLAP 2026",
      buyer: "Carlos López",
      date: "15 de Marzo, 2026",
      amount: 500,
      status: "pendiente",
      ticketNumber: "A-12347",
      token: "GHI789RST",
      paymentDate: "30 de Marzo, 2026",
    },
    {
      id: 4,
      event: "Sorteo UDLAP 2026",
      buyer: "Ana Martínez",
      date: "18 de Marzo, 2026",
      amount: 500,
      status: "pagado",
      ticketNumber: "A-12348",
      token: "JKL012MNO",
    },
    {
      id: 5,
      event: "Sorteo UDLAP 2026",
      buyer: "Luis Hernández",
      date: "20 de Marzo, 2026",
      amount: 500,
      status: "pendiente",
      ticketNumber: "A-12349",
      token: "PQR345STU",
      paymentDate: "5 de Abril, 2026",
    },
  ];

  const pendingTickets = Array.from({ length: studentData.pending }, (_, i) => ({
    id: `pending-${i}`,
    ticketNumber: `A-1235${i}`,
    status: "sin_vender",
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-6">
        <h1 className="text-2xl font-semibold text-center">Gestión de Boletos</h1>
        <p className="text-sm text-center text-white/90 mt-1">Sorteo UDLAP 2026</p>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <QrCode className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Vendidos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{studentData.sold}/{studentData.totalAssigned}</p>
            <p className="text-xs text-gray-500 mt-1">${studentData.amountPaid} recaudado</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xs text-gray-600">Pendientes</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{studentData.pending}</p>
            <p className="text-xs text-gray-500 mt-1">${studentData.amountOwed} adeudo</p>
          </div>
        </div>

        {/* Deadline Warning */}
        {studentData.pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Fecha límite: {studentData.deadline}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Tienes {studentData.pending} boletos sin vender. Si no los vendes, deberás pagarlos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 bg-[#FF5722] text-white py-2 px-4 rounded-lg font-medium">
            Vendidos
          </button>
          <button
            onClick={() => alert("Función próximamente")}
            className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50"
          >
            Pendientes de pago
          </button>
        </div>

        {/* Sold Tickets List */}
        <div className="space-y-3 mb-4">
          <h3 className="font-semibold text-gray-700">Boletos Vendidos</h3>
          {myTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/app/tickets/${ticket.id}`)}
              className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Boleto {ticket.ticketNumber}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status === "pagado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {ticket.status === "pagado" ? "Pagado" : "Pago pendiente"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span>{ticket.buyer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Vendido: {ticket.date}</span>
                  </div>
                  {ticket.status === "pendiente" && ticket.paymentDate && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Fecha de pago: {ticket.paymentDate}</span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#4CAF50]" />
                  <span className="font-semibold text-lg">${ticket.amount}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">Token: {ticket.token}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Tickets to Sell */}
        {pendingTickets.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Boletos Sin Vender ({pendingTickets.length})</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-700">Talonario asignado</p>
                  <p className="text-sm text-gray-600">{studentData.pending} boletos disponibles</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">${studentData.amountOwed}</p>
                  <p className="text-xs text-gray-500">Adeudo potencial</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/app/listings")}
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2.5 px-4 rounded-lg transition-colors"
              >
                Publicar en Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
