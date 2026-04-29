import { useNavigate } from "react-router";
import { ChevronLeft, CreditCard, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function Payments() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2025,
      isDefault: false,
    },
  ]);

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este método de pago?")) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    }
  };

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
        <h1 className="text-xl font-semibold">Métodos de pago</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Add New Payment Method */}
        <button
          onClick={() => alert("Agregar nuevo método de pago")}
          className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 hover:border-[#FF5722] hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Agregar método de pago</span>
          </div>
        </button>

        {/* Payment Methods List */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF5722] to-[#FFA726] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{method.brand}</p>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      •••• •••• •••• {method.last4}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Expira {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {!method.isDefault && (
                <button
                  onClick={() => alert("Establecer como método principal")}
                  className="w-full mt-3 pt-3 border-t border-gray-100 text-sm text-[#FF5722] hover:text-[#f4511e] font-medium"
                >
                  Establecer como principal
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Tus métodos de pago están protegidos y encriptados. 
            Solo se utilizarán para completar compras de boletos en el marketplace.
          </p>
        </div>
      </div>
    </div>
  );
}
