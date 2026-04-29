import { MoreHorizontal, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface TicketCardProps {
  id: number;
  title: string;
  sellerName: string;
  sellerImage: string;
  price: number;
  available: number;
  expirationDate: string;
  includesTicket: boolean;
  category: string;
  subcategory: string;
  images?: string[];
}

export function TicketCard({
  id,
  title,
  sellerName,
  sellerImage,
  price,
  available,
  expirationDate,
  includesTicket,
  category,
  subcategory,
  images = [],
}: TicketCardProps) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBuy = () => {
    if (confirm(`¿Deseas comprar "${title}"?\nPrecio: $${price}`)) {
      alert("Procesando compra...");
    }
  };

  const handleDetails = () => {
    navigate(`/app/products/${id}`);
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden">
      {/* Galería de imágenes */}
      {images && images.length > 0 && (
        <div className="relative w-full h-64 bg-gray-100">
          <img
            src={images[currentImageIndex]}
            alt={`${title} - imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navegación de imágenes */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Indicadores de imágenes */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {/* Header con título y opciones */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-base pr-2 flex-1">{title}</h3>
          <button 
            onClick={() => alert("Opciones adicionales")}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Vendedor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={sellerImage}
              alt={sellerName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600">{sellerName}</p>
        </div>

        {/* Tags de categoría */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
            {category}
          </span>
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {subcategory}
          </span>
        </div>

        {/* Información del producto */}
        <div className="space-y-1 mb-3">
          <p className="text-sm text-gray-600">
            Disponible hasta: <span className="font-medium">{expirationDate}</span>
          </p>
          <p className="text-sm text-gray-600">
            Disponibles: <span className="font-medium">{available}</span>
          </p>
        </div>

        {/* Incluye boleto UDLAP */}
        {includesTicket && (
          <div className="flex items-center gap-1 text-sm text-green-600 mb-3 bg-green-50 px-2 py-1.5 rounded">
            <Ticket className="w-4 h-4" />
            <span>Incluye 1 boleto del Sorteo UDLAP</span>
          </div>
        )}

        {/* Precio */}
        <p className="font-bold text-xl text-[#FF5722] mb-3">${price}</p>

        {/* Botones */}
        <div className="flex gap-2">
          <button 
            onClick={handleBuy}
            className="flex-1 bg-[#FF5722] hover:bg-[#f4511e] text-white py-2 px-4 rounded-lg transition-colors"
          >
            Comprar
          </button>
          <button 
            onClick={handleDetails}
            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}