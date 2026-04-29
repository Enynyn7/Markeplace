import { useNavigate } from "react-router";
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { useState } from "react";

export function TransactionHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "tuition" | "tickets">("all");

  const transactions = [
    {
      id: 1,
      type: "ticket_sale",
      description: "Venta de boleto A-12348",
      buyer: "Ana Martínez",
      amount: 500,
      date: "20 de Marzo, 2026",
      status: "completado",
    },
    {
      id: 2,
      type: "tuition_payment",
      description: "Pago de colegiatura",
      amount: 25000,
      date: "15 de Marzo, 2026",
      status: "completado",
    },
    {
      id: 3,
      type: "ticket_sale",
      description: "Venta de boleto A-12347",
      buyer: "Carlos López",
      amount: 500,
      date: "12 de Marzo, 2026",
      status: "pendiente",
    },
    {
      id: 4,
      type: "ticket_sale",
      description: "Venta de boleto A-12346",
      buyer: "María Rodríguez",
      amount: 500,
      date: "10 de Marzo, 2026",
      status: "completado",
    },
    {
      id: 5,
      type: "tuition_payment",
      description: "Pago de colegiatura",
      amount: 20000,
      date: "5 de Marzo, 2026",
      status: "completado",
    },
    {
      id: 6,
      type: "ticket_sale",
      description: "Venta de boleto A-12345",
      buyer: "Juan Pérez García",
      amount: 500,
      date: "1 de Marzo, 2026",
      status: "completado",
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "tuition") return t.type === "tuition_payment";
    if (filter === "tickets") return t.type === "ticket_sale";
    return true;
  });

  const totalTicketSales = transactions
    .filter((t) => t.type === "ticket_sale" && t.status === "completado")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTuitionPaid = transactions
    .filter((t) => t.type === "tuition_payment")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/app/profile")}
          className="w-10 h-10 bg-[#FFA726] rounded-full flex items-center justify-center hover:bg-[#ff9800] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Historial de transacciones</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Ventas de boletos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalTicketSales}</p>
            <p className="text-xs text-gray-500 mt-1">Ingresos totales</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">Colegiatura pagada</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalTuitionPaid}</p>
            <p className="text-xs text-gray-500 mt-1">Total pagado</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-[#FF5722] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("tickets")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === "tickets"
                ? "bg-[#FF5722] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Boletos
          </button>
          <button
            onClick={() => setFilter("tuition")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === "tuition"
                ? "bg-[#FF5722] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Colegiatura
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "ticket_sale"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {transaction.type === "ticket_sale" ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold mb-0.5">
                      {transaction.description}
                    </p>
                    {transaction.buyer && (
                      <p className="text-sm text-gray-600">
                        Comprador: {transaction.buyer}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.type === "ticket_sale"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {transaction.type === "ticket_sale" ? "+" : "-"}$
                    {transaction.amount}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs mt-1 ${
                      transaction.status === "completado"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {transaction.status === "completado"
                      ? "Completado"
                      : "Pendiente"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={() => alert("Exportando historial en PDF...")}
          className="w-full mt-4 bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors border border-gray-300"
        >
          Exportar historial completo
        </button>
      </div>
    </div>
  );
}