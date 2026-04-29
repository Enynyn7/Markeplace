import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, DollarSign, Package, FileText } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export function Sell() {
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    quantity: "1",
    condition: "nuevo",
    discount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = {
    producto: [
      { value: "tecnologia", label: "Tecnología" },
      { value: "ropa", label: "Ropa y Accesorios" },
      { value: "hogar", label: "Hogar" },
      { value: "alimentos", label: "Alimentos" },
      { value: "obras-artisticas", label: "Obras Artísticas" },
      { value: "otros-productos", label: "Otros" },
    ],
    servicio: [
      { value: "cursos-talleres", label: "Cursos y Talleres" },
      { value: "reparacion", label: "Reparación" },
      { value: "consultoria", label: "Consultoría" },
      { value: "comisiones", label: "Comisiones" },
      { value: "otros-servicios", label: "Otros" },
    ],
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    if (!formData.title) {
      newErrors.title = "El título es obligatorio";
    }
    if (!formData.category) {
      newErrors.category = "Selecciona una categoría";
    }
    if (!formData.subcategory) {
      newErrors.subcategory = "Selecciona una subcategoría";
    }
    if (!formData.price) {
      newErrors.price = "El precio es obligatorio";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Ingresa un precio válido";
    }
    if (!formData.description) {
      newErrors.description = "La descripción es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Publicación creada:", formData);
      setShowSuccessDialog(true);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/app/marketplace");
  };

  const subcategoryOptions =
    formData.category === "producto"
      ? categoryOptions.producto
      : formData.category === "servicio"
      ? categoryOptions.servicio
      : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4 flex items-center">
        <button
          onClick={() => navigate("/app/marketplace")}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold ml-4">Publicar en Marketplace</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#4CAF50] p-4 rounded-full">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>

          <p className="text-center text-gray-600 mb-6">
            Publica tu producto o servicio en el marketplace de la comunidad UDLAP
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Título de la publicación *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Ej: Laptop Dell XPS 15"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700 font-medium">
                Categoría *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  handleInputChange("category", value);
                  setFormData((prev) => ({ ...prev, subcategory: "" }));
                }}
              >
                <SelectTrigger
                  id="category"
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="producto">Producto</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            {/* Subcategoría */}
            {formData.category && (
              <div className="space-y-2">
                <Label htmlFor="subcategory" className="text-gray-700 font-medium">
                  Subcategoría *
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => handleInputChange("subcategory", value)}
                >
                  <SelectTrigger
                    id="subcategory"
                    className={errors.subcategory ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona una subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subcategory && (
                  <p className="text-red-500 text-sm">{errors.subcategory}</p>
                )}
              </div>
            )}

            {/* Precio */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-medium">
                Precio (MXN) *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            {/* Descuento */}
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-gray-700 font-medium">
                Descuento (%) - Opcional
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Si aplicas descuento, tu publicación será más visible
              </p>
            </div>

            {/* Cantidad */}
            {formData.category === "producto" && (
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-gray-700 font-medium">
                  Cantidad disponible
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                />
              </div>
            )}

            {/* Condición */}
            {formData.category === "producto" && (
              <div className="space-y-2">
                <Label htmlFor="condition" className="text-gray-700 font-medium">
                  Condición
                </Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleInputChange("condition", value)}
                >
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="como-nuevo">Como Nuevo</SelectItem>
                    <SelectItem value="buen-estado">Buen Estado</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Descripción *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe tu producto o servicio en detalle..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Imágenes */}
            <div className="space-y-2">
              <Label htmlFor="images" className="text-gray-700 font-medium">
                Imágenes - Opcional
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FF5722] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Haz clic para subir imágenes
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG hasta 5MB
                </p>
              </div>
            </div>

            {/* Botón de publicar */}
            <button
              type="submit"
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-3.5 px-6 rounded-full font-medium transition-colors shadow-md mt-6"
            >
              Publicar en Marketplace
            </button>
          </form>
        </div>
      </div>

      {/* Diálogo de éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-[#4CAF50] p-3 rounded-full">
                <Package className="w-12 h-12 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              ¡Publicación Creada!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600">
              Tu publicación ha sido creada exitosamente y ya está visible en el
              marketplace para toda la comunidad UDLAP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button
              onClick={handleSuccessDialogClose}
              className="w-full bg-[#FF5722] hover:bg-[#f4511e] text-white py-3 px-6 rounded-full font-medium transition-colors"
            >
              Ver Marketplace
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
