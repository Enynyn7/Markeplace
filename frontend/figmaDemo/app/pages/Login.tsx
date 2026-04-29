import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ChevronLeft, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const type = searchParams.get("type") as "comunidad" | "externo" || "comunidad";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password, type);
      navigate("/app");
    } catch (error) {
      console.error("Error de login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header naranja con botones */}
      <div className="bg-[#FF5722] px-4 py-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-[#FFA726] rounded-full flex items-center justify-center hover:bg-[#ff9800] transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button className="w-10 h-10 bg-[#FFA726] rounded-full flex items-center justify-center hover:bg-[#ff9800] transition-colors">
          <User className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Contenido central */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <h1 className="text-5xl font-bold text-[#FF5722] mb-12">UDLAP</h1>

        <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5722] hover:bg-[#f4511e] text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <button
              type="button"
              onClick={() => alert("Función de recuperación de contraseña")}
              className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ¿Olvidaste la contraseña?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
