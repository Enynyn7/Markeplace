import { useNavigate, useParams } from "react-router";
import { ChevronLeft, QrCode, Download, Share2, Calendar, MapPin, User, DollarSign, AlertCircle } from "lucide-react";
import { useState } from "react";

export function TicketDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showQR, setShowQR] = useState(false);

  // Simulación de datos del boleto
  const ticket = {
    id: id,
    event: "Sorteo UDLAP 2026",
    ticketNumber: "A-12345",
    date: "30 de Mayo, 2026",
    time: "19:00",
    location: "Auditorio UDLAP",
    address: "Ex Hacienda Sta. Catarina Mártir, 72810 San Andrés Cholula, Pue.",
    buyer: "Juan Pérez García",
    buyerEmail: "juan.perez@example.com",
    buyerPhone: "+52 222 123 4567",
    price: 500,
    status: "pagado",
    token: "ABC123XYZ",
    seller: "Ana Martínez (Tú)",
    saleDate: "10 de Marzo, 2026",
    paymentStatus: "completado",
    prizes: [
      "1er Premio: Casa en Cholula",
      "2do Premio: Automóvil 2026",
      "3er Premio: $100,000 MXN",
      "Y muchos premios más..."
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/app/tickets")}
          className="w-10 h-10 bg-[#FFA726] rounded-full flex items-center justify-center hover:bg-[#ff9800] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Detalles del Boleto</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Payment Status Banner */}
        <div className={`rounded-lg p-3 mb-4 ${
          ticket.paymentStatus === "completado" 
            ? "bg-green-50 border border-green-200" 
            : "bg-yellow-50 border border-yellow-200"
        }`}>
          <div className="flex items-center gap-2">
            {ticket.paymentStatus === "completado" ? (
              <>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Pago recibido</p>
                  <p className="text-xs text-green-700">El boleto está confirmado y activo</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pago pendiente</p>
                  <p className="text-xs text-yellow-700">Esperando confirmación de pago</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-md">
          <div className="text-center mb-4">
            <h2 className="font-semibold text-lg mb-1">Boleto {ticket.ticketNumber}</h2>
            <p className="text-sm text-gray-600">{ticket.event}</p>
          </div>

          <div className="flex flex-col items-center mb-4">
            {showQR ? (
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4 rounded-lg">
                <div className="text-center p-4">
                  <QrCode className="w-full h-full" />
                  <p className="text-xs text-gray-500 mt-2">Código QR Virtual</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowQR(true)}
                className="w-48 h-48 bg-gradient-to-br from-[#FF5722] to-[#f4511e] hover:from-[#f4511e] hover:to-[#e64a19] rounded-lg flex flex-col items-center justify-center mb-4 transition-all shadow-lg"
              >
                <QrCode className="w-16 h-16 text-white mb-2" />
                <span className="text-white font-medium">Mostrar QR</span>
              </button>
            )}

            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm font-mono text-center">Token: {ticket.token}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => alert("Descargando boleto en PDF...")}
              className="flex-1 flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-white py-2.5 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar</span>
            </button>
            <button
              onClick={() => alert("Compartiendo boleto...")}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white py-2.5 px-4 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Información del Sorteo</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#FF5722] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{ticket.date}</p>
                <p className="text-sm text-gray-600">{ticket.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#FF5722] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{ticket.location}</p>
                <p className="text-sm text-gray-600">{ticket.address}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium mb-2">Premios principales:</p>
            <ul className="space-y-1">
              {ticket.prizes.map((prize, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-[#FF5722] mt-1">•</span>
                  <span>{prize}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buyer Details */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Información del Comprador</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#FF5722] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{ticket.buyer}</p>
                <p className="text-sm text-gray-600">{ticket.buyerEmail}</p>
                <p className="text-sm text-gray-600">{ticket.buyerPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Detalles de la Venta</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Vendedor:</span>
              <span className="font-medium">{ticket.seller}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha de venta:</span>
              <span className="font-medium">{ticket.saleDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Número de boleto:</span>
              <span className="font-medium font-mono">{ticket.ticketNumber}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-semibold">Precio:</span>
              <span className="font-semibold text-[#4CAF50] text-lg">${ticket.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado de pago:</span>
              <span className={`font-medium ${
                ticket.paymentStatus === "completado" ? "text-green-600" : "text-yellow-600"
              }`}>
                {ticket.paymentStatus === "completado" ? "Completado" : "Pendiente"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              if (confirm("¿Deseas enviar un recordatorio de pago al comprador?")) {
                alert("Recordatorio enviado a " + ticket.buyer);
              }
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Enviar recordatorio de pago
          </button>
          
          <button
            onClick={() => {
              if (confirm("¿Estás seguro de que deseas cancelar esta venta?\n\nEl boleto volverá a estar disponible.")) {
                alert("Venta cancelada. El boleto está nuevamente disponible.");
                navigate("/app/tickets");
              }
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Cancelar venta
          </button>
        </div>
      </div>
    </div>
  );
}