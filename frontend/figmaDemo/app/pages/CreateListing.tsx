import { useNavigate, useParams } from "react-router";
import { ChevronLeft, X, Upload, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface Category {
  name: string;
  subcategories: string[];
}

export function CreateListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    subcategory: "",
    description: "",
    includesTicket: false,
    images: [] as string[],
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Load existing listing data if editing
  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch the listing data by ID
      // For demo purposes, loading sample data
      setFormData({
        title: "iPhone 13 Pro Max 128GB - Como nuevo",
        price: "8500",
        category: "Producto",
        subcategory: "Tecnología",
        description: "iPhone en excelente estado, incluye cargador original y caja.",
        includesTicket: true,
        images: [
          "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=600&fit=crop",
        ],
      });
    }
  }, [isEditing]);

  const categories: Category[] = [
    {
      name: "Producto",
      subcategories: [
        "Tecnología",
        "Ropa y Accesorios",
        "Hogar",
        "Alimentos",
        "Obras Artísticas",
        "Otros",
      ],
    },
    {
      name: "Servicio",
      subcategories: [
        "Cursos y Talleres",
        "Reparación",
        "Consultoría",
        "Comisiones",
        "Otros",
      ],
    },
  ];

  const selectedCategory = categories.find((c) => c.name === formData.category);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload to a server and get URLs
      // For now, we'll use placeholder URLs
      const newImages = Array.from(files).map((_, index) => {
        return `https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop&index=${
          formData.images.length + index
        }`;
      });
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages].slice(0, 5), // Max 5 images
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    navigate("/app/listings");
  };

  const handleSaveDraft = () => {
    // Save as draft logic here
    navigate("/app/listings");
  };

  const handlePublish = () => {
    // Validate form
    if (
      !formData.title ||
      !formData.price ||
      !formData.category ||
      !formData.subcategory ||
      !formData.description
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    // Publish logic here
    navigate("/app/listings");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="w-10 h-10 bg-transparent hover:bg-[#f4511e] rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">
            {isEditing ? "Editar Publicación" : "Nueva Publicación"}
          </h1>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        <form className="space-y-4">
          {/* Images Upload */}
          <div className="bg-white rounded-lg p-4">
            <label className="block mb-2 font-medium">
              Imágenes <span className="text-gray-500 text-sm">(Máx. 5)</span>
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#FF5722] hover:bg-orange-50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Sube fotos claras de tu producto o servicio
            </p>
          </div>

          {/* Title */}
          <div className="bg-white rounded-lg p-4">
            <label htmlFor="title" className="block mb-2 font-medium">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Ej: iPhone 13 Pro Max 128GB"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100 caracteres
            </p>
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg p-4">
            <label htmlFor="category" className="block mb-2 font-medium">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subcategory: "",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] mb-3"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <>
                <label htmlFor="subcategory" className="block mb-2 font-medium">
                  Subcategoría <span className="text-red-500">*</span>
                </label>
                <select
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                >
                  <option value="">Selecciona una subcategoría</option>
                  {selectedCategory.subcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* Price */}
          <div className="bg-white rounded-lg p-4">
            <label htmlFor="price" className="block mb-2 font-medium">
              Precio (MXN) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-4">
            <label htmlFor="description" className="block mb-2 font-medium">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Describe tu producto o servicio con detalle..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] resize-none"
              rows={5}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 caracteres
            </p>
          </div>

          {/* Includes Ticket */}
          <div className="bg-white rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includesTicket}
                onChange={(e) =>
                  setFormData({ ...formData, includesTicket: e.target.checked })
                }
                className="w-5 h-5 mt-0.5 text-[#FF5722] border-gray-300 rounded focus:ring-[#FF5722]"
              />
              <div>
                <div className="font-medium">Incluye boleto del sorteo UDLAP</div>
                <p className="text-sm text-gray-600">
                  Marca esta opción si tu publicación incluye un boleto del
                  sorteo institucional
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handlePublish}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Publicar
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Guardar borrador
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">¿Cancelar publicación?</h3>
            <p className="text-gray-600 mb-6">
              Se perderán todos los cambios que hayas realizado. Esta acción no
              se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4">Confirmar publicación</h3>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-600">Título:</p>
                <p className="font-medium">{formData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Categoría:</p>
                <p className="font-medium">
                  {formData.category} • {formData.subcategory}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Precio:</p>
                <p className="font-medium text-[#FF5722]">
                  ${parseFloat(formData.price || "0").toLocaleString()}
                </p>
              </div>
              {formData.includesTicket && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    ✓ Incluye boleto del sorteo UDLAP
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Revisar
              </button>
              <button
                onClick={confirmPublish}
                className="flex-1 px-4 py-2 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}