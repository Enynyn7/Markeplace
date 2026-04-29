import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, ShoppingBag, Ticket, Bell, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const isActive = (path: string) => {
    if (path === "/app" && location.pathname === "/app") return true;
    if (path !== "/app" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Outlet />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => navigate("/app")}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              isActive("/app") && location.pathname === "/app"
                ? "text-[#FF5722] bg-[#FF5722]/10"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Inicio</span>
          </button>

          <button
            onClick={() => navigate("/app/marketplace")}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              isActive("/app/marketplace")
                ? "text-[#FF5722] bg-[#FF5722]/10"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs">Marketplace</span>
          </button>

          <button
            onClick={() => navigate("/app/tickets")}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              isActive("/app/tickets")
                ? "text-[#FF5722] bg-[#FF5722]/10"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span className="text-xs">Boletos</span>
          </button>

          <button
            onClick={() => navigate("/app/notifications")}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              isActive("/app/notifications")
                ? "text-[#FF5722] bg-[#FF5722]/10"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs">Alertas</span>
          </button>

          <button
            onClick={() => navigate("/app/profile")}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              isActive("/app/profile")
                ? "text-[#FF5722] bg-[#FF5722]/10"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}