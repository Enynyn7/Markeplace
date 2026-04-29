import { useNavigate } from "react-router";

export function PreLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header naranja */}
      <div className="bg-[#FF5722] h-24"></div>

      {/* Contenido central */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <h1 className="text-5xl font-bold text-[#FF5722] mb-3">UDLAP</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Sistema de Gestión y Marketplace de Boletos, Productos y Servicios</p>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => navigate("/login?type=comunidad")}
            className="w-full bg-[#FF5722] hover:bg-[#f4511e] text-white py-3.5 px-6 rounded-full font-medium transition-colors shadow-md"
          >
            Iniciar Sesion
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-3.5 px-6 rounded-full font-medium transition-colors shadow-md"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}