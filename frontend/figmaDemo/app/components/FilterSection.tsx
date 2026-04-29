import { Search, ChevronDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { useState } from "react";

export function FilterSection() {
  const [priceRange, setPriceRange] = useState([10, 10000]);
  const [showProducto, setShowProducto] = useState(true);
  const [showServicio, setShowServicio] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg">
      {/* Filtros Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Filtros</h3>
        </div>
      </div>

      {/* Tipo de vendedor */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Categoria</label>
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="producto" 
                checked={showProducto}
                onCheckedChange={(checked) => setShowProducto(checked as boolean)}
              />
              <label htmlFor="producto" className="text-sm cursor-pointer">
                Producto
              </label>
            </div>
            
            {/* Subcategorías de Producto */}
            {showProducto && (
              <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="tecnologia" />
                  <label htmlFor="tecnologia" className="text-sm cursor-pointer text-gray-600">
                    Tecnología
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="ropa" />
                  <label htmlFor="ropa" className="text-sm cursor-pointer text-gray-600">
                    Ropa y Accesorios
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="hogar" />
                  <label htmlFor="hogar" className="text-sm cursor-pointer text-gray-600">
                    Hogar
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="alimentos" />
                  <label htmlFor="alimentos" className="text-sm cursor-pointer text-gray-600">
                    Alimentos
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="obras-artisticas" />
                  <label htmlFor="obras-artisticas" className="text-sm cursor-pointer text-gray-600">
                    Obras Artísticas
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="otros-productos" />
                  <label htmlFor="otros-productos" className="text-sm cursor-pointer text-gray-600">
                    Otros
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="servicio" 
                checked={showServicio}
                onCheckedChange={(checked) => setShowServicio(checked as boolean)}
              />
              <label htmlFor="servicio" className="text-sm cursor-pointer">
                Servicio
              </label>
            </div>

            {/* Subcategorías de Servicio */}
            {showServicio && (
              <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="cursos-talleres" />
                  <label htmlFor="cursos-talleres" className="text-sm cursor-pointer text-gray-600">
                    Cursos y Talleres
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="reparacion" />
                  <label htmlFor="reparacion" className="text-sm cursor-pointer text-gray-600">
                    Reparación
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="consultoria" />
                  <label htmlFor="consultoria" className="text-sm cursor-pointer text-gray-600">
                    Consultoría
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="comisiones" />
                  <label htmlFor="comisiones" className="text-sm cursor-pointer text-gray-600">
                    Comisiones
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="otros-servicios" />
                  <label htmlFor="otros-servicios" className="text-sm cursor-pointer text-gray-600">
                    Otros
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rango de precio */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Rango de Precio</label>
        <div className="px-2 py-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={10}
            max={10000}
            step={10}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Aplicar filtros button */}
      <button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2.5 px-4 rounded-lg transition-colors">
        Aplicar filtros
      </button>
    </div>
  );
}