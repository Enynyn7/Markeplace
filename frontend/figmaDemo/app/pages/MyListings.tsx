import { useNavigate } from "react-router";
import { ChevronLeft, Plus, Eye, FileText } from "lucide-react";
import { useState } from "react";

interface Listing {
  id: number;
  title: string;
  price: number;
  category: string;
  subcategory: string;
  status: "published" | "draft";
  createdAt: string;
  images: string[];
  includesTicket: boolean;
}

export function MyListings() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<number | null>(null);

  const listings: Listing[] = [
    {
      id: 1,
      title: "iPhone 13 Pro Max 128GB - Como nuevo",
      price: 8500,
      category: "Producto",
      subcategory: "Tecnología",
      status: "published",
      createdAt: "5 Marzo 2026",
      images: [
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=600&fit=crop",
      ],
      includesTicket: true,
    },
    {
      id: 2,
      title: "Clases de programación Python nivel básico",
      price: 250,
      category: "Servicio",
      subcategory: "Cursos y Talleres",
      status: "draft",
      createdAt: "7 Marzo 2026",
      images: [
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
      ],
      includesTicket: false,
    },
  ];

  const handleDeleteClick = (id: number) => {
    setListingToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Delete logic here
    console.log("Deleting listing:", listingToDelete);
    setShowDeleteModal(false);
    setListingToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/app/profile")}
            className="w-10 h-10 bg-transparent hover:bg-[#f4511e] rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Mis Publicaciones</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Create New Button */}
        <button
          onClick={() => navigate("/app/listings/create")}
          className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-4 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Crear nueva publicación</span>
        </button>

        {/* Listings */}
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="flex gap-3 p-3">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {listing.title}
                    </h3>
                    {listing.status === "published" ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                        <Eye className="w-3 h-3" />
                        Publicada
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                        <FileText className="w-3 h-3" />
                        Borrador
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mb-1">
                    {listing.category} • {listing.subcategory}
                  </p>
                  <p className="font-bold text-[#FF5722] mb-1">
                    ${listing.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Creada: {listing.createdAt}</span>
                    {listing.includesTicket && (
                      <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                        + Boleto
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => navigate(`/app/listings/edit/${listing.id}`)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(listing.id)}
                  className="flex-1 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-l border-gray-100"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {listings.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              No tienes publicaciones
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Crea tu primera publicación para empezar a vender
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Eliminar publicación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}