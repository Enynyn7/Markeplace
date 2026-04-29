import { Bell, Calendar, DollarSign, Tag, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  type: "deadline" | "sale" | "payment" | "reminder" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "alert",
      title: "¡Fecha límite próxima!",
      message: "Te quedan 15 días para vender tus boletos restantes o deberás pagarlos.",
      timestamp: "Hace 1 hora",
      read: false,
    },
    {
      id: 2,
      type: "sale",
      title: "Articulo vendido",
      message: "María González pago por un articulo de tu marketplace. $500 agregados a tu balance.",
      timestamp: "Hace 3 horas",
      read: false,
    },
    {
      id: 3,
      type: "payment",
      title: "Pago de colegiatura próximo",
      message: "Se aproxima una fecha limite de pago diferido de colegiatura, el 15 de Abril, 2026.",
      timestamp: "Hace 5 horas",
      read: false,
    },
    {
      id: 4,
      type: "reminder",
      title: "Recordatorio de pago diferido",
      message: "Carlos López debe pagar el boleto A-12347 el 30 de Marzo.",
      timestamp: "Ayer",
      read: true,
    },
    {
      id: 5,
      type: "sale",
      title: "Interés en tu publicación",
      message: "2 personas han viesto tus publicaciones en el marketplace.",
      timestamp: "Hace 2 días",
      read: true,
    },
    {
      id: 6,
      type: "deadline",
      title: "Actualización del sorteo",
      message: "La fecha del sorteo UDLAP 2026 se mantiene para el 30 de Mayo.",
      timestamp: "Hace 3 días",
      read: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return Calendar;
      case "sale":
        return DollarSign;
      case "payment":
        return DollarSign;
      case "reminder":
        return Bell;
      case "alert":
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "deadline":
        return "bg-blue-100 text-blue-600";
      case "sale":
        return "bg-green-100 text-green-600";
      case "payment":
        return "bg-purple-100 text-purple-600";
      case "reminder":
        return "bg-yellow-100 text-yellow-600";
      case "alert":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Notificaciones</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-white/90 mt-1">{unreadCount} sin leer</p>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm bg-[#FFA726] hover:bg-[#ff9800] px-3 py-1.5 rounded-lg transition-colors"
          >
            Marcar todas
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                    !notification.read ? "border-l-4 border-[#FF5722]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getColor(
                        notification.type
                      )}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`font-semibold ${
                            !notification.read ? "text-gray-900" : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#FF5722] rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}