import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Lock, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userType) {
      newErrors.userType = "Selecciona un tipo de usuario";
    }
    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }
    if (!formData.fullName) {
      newErrors.fullName = "El nombre completo es obligatorio";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí se procesaría el registro (guardar en localStorage o enviar a backend)
      console.log("Registro exitoso:", formData);
      
      // Mostrar el diálogo de éxito
      setShowSuccessDialog(true);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header naranja con botón de regreso */}
      <div className="bg-[#FF5722] p-4 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-bold ml-4">Crear Cuenta</h1>
      </div>

      {/* Contenido del formulario */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#FF5722] p-4 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <p className="text-center text-gray-600 mb-6">
              Únete a la comunidad UDLAP y gestiona tus boletos de manera fácil y transparente
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tipo de usuario */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-gray-700 font-medium">
                  Tipo de Usuario *
                </Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange("userType", value)}
                >
                  <SelectTrigger
                    id="userType"
                    className={`w-full ${errors.userType ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudiante">Estudiante</SelectItem>
                    <SelectItem value="externo">Externo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <p className="text-red-500 text-sm">{errors.userType}</p>
                )}
              </div>

              {/* Nombre completo */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Nombre Completo *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              {/* Correo electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Correo Electrónico *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Contraseña *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirmar Contraseña *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Botón de registro */}
              <button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-3.5 px-6 rounded-full font-medium transition-colors shadow-md mt-6"
              >
                Crear Cuenta
              </button>
            </form>
          </div>

          {/* Link para iniciar sesión */}
          <div className="text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#FF5722] font-medium hover:underline"
              >
                Inicia Sesión
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Diálogo de éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-[#4CAF50] p-3 rounded-full">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              ¡Perfil Creado!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600">
              Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión
              para comenzar a gestionar tus boletos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button
              onClick={handleSuccessDialogClose}
              className="w-full bg-[#FF5722] hover:bg-[#f4511e] text-white py-3 px-6 rounded-full font-medium transition-colors"
            >
              Ir a Iniciar Sesión
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
