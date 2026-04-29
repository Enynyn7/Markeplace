import { Search, ChevronDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { FilterSection } from "../components/FilterSection";
import { TicketCard } from "../components/TicketCard";

export function Marketplace() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const tickets = [
    {
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
      description: "iPhone 13 Pro Max en excelente estado, prácticamente como nuevo. Incluye cargador original Apple, cable USB-C a Lightning, caja original con todos los accesorios, protector de pantalla instalado y funda de silicona.",
      images: [
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 2,
      title: "Clases particulares de Cálculo Diferencial",
      sellerName: "Carlos Ramírez",
      sellerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      price: 200,
      available: 10,
      expirationDate: "30 Junio 2026",
      includesTicket: false,
      category: "Servicio",
      subcategory: "Cursos y Talleres",
      description: "Clases personalizadas de Cálculo Diferencial. Estudiante de Ingeniería con experiencia dando clases. Incluye material de estudio y ejercicios resueltos.",
      images: [
        "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 3,
      title: "Sudadera UDLAP original talla M",
      sellerName: "María González",
      sellerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      price: 350,
      available: 2,
      expirationDate: "20 Marzo 2026",
      includesTicket: true,
      category: "Producto",
      subcategory: "Ropa y Accesorios",
      description: "Sudadera oficial UDLAP talla M en excelente estado. Perfecta para el clima de Puebla. Color azul marino con logo bordado.",
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 4,
      title: "Reparación de laptops y mantenimiento",
      sellerName: "Luis Hernández",
      sellerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      price: 450,
      available: 5,
      expirationDate: "10 Abril 2026",
      includesTicket: false,
      category: "Servicio",
      subcategory: "Reparación",
      description: "Servicio profesional de reparación de laptops. Limpieza, cambio de pasta térmica, instalación de SSD, diagnóstico completo. Garantía de 30 días.",
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 5,
      title: "Pintura al óleo 'Atardecer en Cholula'",
      sellerName: "Sofía Ramírez",
      sellerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
      price: 1200,
      available: 1,
      expirationDate: "25 Marzo 2026",
      includesTicket: true,
      category: "Producto",
      subcategory: "Obras Artísticas",
      description: "Pintura al óleo original representando un atardecer en Cholula con la pirámide y el Popocatépetl. Medidas: 60x80 cm. Incluye marco de madera.",
      images: [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 6,
      title: "Brownies artesanales - 6 piezas",
      sellerName: "Andrea Torres",
      sellerImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
      price: 150,
      available: 20,
      expirationDate: "8 Marzo 2026",
      includesTicket: false,
      category: "Producto",
      subcategory: "Alimentos",
      description: "Brownies artesanales hechos con chocolate belga. Caja de 6 piezas. Opciones: tradicionales, con nuez, y veganos. Pedidos con 24h de anticipación.",
      images: [
        "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-6">
        <h1 className="text-2xl font-semibold text-center">Marketplace Universitario</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar servicios/productos/usuarios"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterSection />
        </div>

        {/* Ticket Cards */}
        <div className="mb-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} />
          ))}
        </div>
      </div>
    </div>
  );
}