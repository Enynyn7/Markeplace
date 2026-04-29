import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ChevronRight, Ticket, AlertTriangle, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // En una app real, cargarías los datos del producto por ID
  // Por ahora, usamos datos de ejemplo
  const product = {
    id: 1,
    title: "iPhone 13 Pro Max 128GB - Como nuevo",
    sellerName: "Ana Martínez Soto",
    sellerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    price: 8500,
    available: 1,
    expirationDate: "15 Marzo 2026",
    includesTicket: true,
    category: "Producto",
    subcategory: "Tecnología",
    description: "iPhone 13 Pro Max en excelente estado, prácticamente como nuevo. Incluye:\n\n• Cargador original Apple\n• Cable USB-C a Lightning\n• Caja original con todos los accesorios\n• Protector de pantalla instalado\n• Funda de silicona\n\nEl teléfono ha sido cuidado con mucho esmero, sin golpes ni rayones. Batería en perfecto estado con 95% de salud. Desbloqueado para cualquier compañía.\n\n¡Excelente oportunidad para conseguir un iPhone premium a buen precio!",
    images: [
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=800&h=600&fit=crop",
    ],
    publishedDate: "5 Marzo 2026",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const confirmReport = () => {
    // Lógica para enviar el reporte
    setShowReportModal(false);
    alert("Gracias por tu reporte. Lo revisaremos pronto.");
  };

  const handleBuy = () => {
    setShowBuyModal(true);
  };

  const confirmBuy = () => {
    setShowBuyModal(false);
    // Aquí iría la lógica de compra
    navigate("/app/payments");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-transparent hover:bg-[#f4511e] rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Detalles del producto</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Galería de imágenes */}
        <div className="relative w-full h-80 bg-gray-200">
          <img
            src={product.images[currentImageIndex]}
            alt={`${product.title} - imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navegación de imágenes */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Contador de imágenes */}
              <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>

              {/* Indicadores de imágenes */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/60 hover:bg-white/80 w-2"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-4">
          {/* Tags de categoría */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
              {product.category}
            </span>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
              {product.subcategory}
            </span>
          </div>

          {/* Título y precio */}
          <div>
            <h2 className="font-bold text-2xl mb-2">{product.title}</h2>
            <p className="font-bold text-3xl text-[#FF5722]">
              ${product.price.toLocaleString()}
            </p>
          </div>

          {/* Incluye boleto UDLAP */}
          {product.includesTicket && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Incluye 1 boleto del Sorteo UDLAP
                </p>
                <p className="text-xs text-green-600">
                  Este producto incluye un boleto oficial del sorteo institucional
                </p>
              </div>
            </div>
          )}

          {/* Botón de comprar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-md mx-auto">
          <button
            onClick={handleBuy}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            Comprar ahora
          </button>
        </div>

          {/* Información del vendedor */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Vendido por:</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={product.sellerImage}
                  alt={product.sellerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{product.sellerName}</p>
                <p className="text-sm text-gray-500">Miembro de la comunidad UDLAP</p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Disponibles:</span>
              <span className="font-semibold">{product.available} unidad(es)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expira:</span>
              <span className="font-semibold">{product.expirationDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Publicado:</span>
              <span className="font-semibold">{product.publishedDate}</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-bold text-lg mb-3">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Botón de reportar */}
          <button
            onClick={handleReport}
            className="w-full flex items-center justify-center gap-2 py-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Reportar publicación</span>
          </button>
        </div>
      </div>

      {/* Modal de Reportar */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg">Reportar publicación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas reportar esta publicación? 
              Nuestro equipo revisará el contenido y tomará las medidas necesarias.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReport}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Sí, reportar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Comprar */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4">Confirmar compra</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm line-clamp-2 mb-1">
                    {product.title}
                  </p>
                  <p className="text-gray-600 text-sm">Cantidad: 1</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${product.price.toLocaleString()}</span>
                </div>
                {product.includesTicket && (
                  <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                    <Ticket className="w-4 h-4" />
                    <span>+ 1 Boleto del Sorteo UDLAP</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-[#FF5722]">${product.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBuy}
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