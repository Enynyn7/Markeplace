import { useNavigate } from "react-router";
import { ChevronLeft, Bell, Lock, Globe, Moon } from "lucide-react";
import { useState } from "react";
import { Switch } from "../components/ui/switch";

export function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
        <h1 className="text-xl font-semibold">Configuración</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Notifications Section */}
        <div className="bg-white rounded-lg mb-4 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FF5722]" />
              <h2 className="font-semibold">Notificaciones</h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones push</p>
                <p className="text-sm text-gray-600">
                  Recibe alertas sobre eventos y ventas
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones por email</p>
                <p className="text-sm text-gray-600">
                  Recibe resúmenes por correo
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg mb-4 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#FF5722]" />
              <h2 className="font-semibold">Seguridad</h2>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <button
              onClick={() => alert("Cambiar contraseña")}
              className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <p className="font-medium">Cambiar contraseña</p>
              <p className="text-sm text-gray-600">
                Actualiza tu contraseña regularmente
              </p>
            </button>

            <button
              onClick={() => alert("Verificación en dos pasos")}
              className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <p className="font-medium">Verificación en dos pasos</p>
              <p className="text-sm text-gray-600">
                Añade una capa extra de seguridad
              </p>
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg mb-4 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FF5722]" />
              <h2 className="font-semibold">Preferencias</h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <button
              onClick={() => alert("Cambiar idioma")}
              className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <p className="font-medium">Idioma</p>
              <p className="text-sm text-gray-600">Español (México)</p>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo oscuro</p>
                <p className="text-sm text-gray-600">
                  Próximamente disponible
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                disabled
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 space-y-3">
            <button
              onClick={() => alert("Términos y condiciones")}
              className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <p className="font-medium">Términos y condiciones</p>
            </button>

            <button
              onClick={() => alert("Política de privacidad")}
              className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <p className="font-medium">Política de privacidad</p>
            </button>

            <div className="p-2">
              <p className="text-sm text-gray-600">Versión 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
