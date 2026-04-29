import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, CreditCard, History, Settings, HelpCircle, LogOut, User, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate("/");
    }
  };

  const menuItems = [
    {
      icon: CreditCard,
      label: "Métodos de pago",
      onClick: () => navigate("/app/payments"),
    },
    {
      icon: ShoppingBag,
      label: "Mis publicaciones",
      onClick:() => navigate("/app/listings")
    },
    {
      icon: History,
      label: "Mis compras",
      onClick: () => navigate("/app/transactions"),
    },
    {
      icon: Settings,
      label: "Configuración",
      onClick: () => navigate("/app/settings"),
    },
    {
      icon: HelpCircle,
      label: "Soporte/Duda",
      onClick: () => navigate("/app/support"),
    },
    {
      icon: LogOut,
      label: "Cerrar sesión",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4">
        <button
          onClick={() => navigate("/app")}
          className="w-10 h-10 bg-transparent hover:bg-[#f4511e] rounded-full flex items-center justify-center transition-colors mb-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </header>

      <div className="max-w-md mx-auto">
        {/* Profile Info */}
        <div className="bg-white px-4 py-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-3">
              <User className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="font-semibold text-lg">{user?.name || "Nombre de usuario"}</h2>
            <p className="text-sm text-gray-600">{user?.email || "email@udlap.mx"}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white mt-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-700" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}