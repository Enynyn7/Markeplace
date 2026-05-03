import { useState, useEffect } from 'react'

export default function FilterSection({ categories = [], onApply = () => {}, initialCategory = '', initialMin = '', initialMax = '' }) {
  const PRICE_MIN = 10
  const PRICE_MAX = 10000
  const staticCategories = [
    'Producto',
    'Tecnologia',
    'Ropa y Accesorios',
    'Hogar',
    'Alimentos',
    'Obras Artisticas',
    'Otros',
    'Servicio'
  ]
  const apiCategoryNames = categories
    .map((cat) => (typeof cat === 'string' ? cat : cat?.name))
    .filter(Boolean)
  const mergedCategories = Array.from(new Set([...staticCategories, ...apiCategoryNames]))

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sliderPrice, setSliderPrice] = useState(Number(initialMax) || PRICE_MAX)

  useEffect(() => {
    setSelectedCategory(initialCategory)
    setSliderPrice(Number(initialMax) || PRICE_MAX)
  }, [initialCategory, initialMin, initialMax])

  const handleApply = () => {
    onApply({ category: selectedCategory, minPrice: PRICE_MIN, maxPrice: sliderPrice })
  }

  const handleClear = () => {
    setSelectedCategory('')
    setSliderPrice(PRICE_MAX)
    onApply({ category: '', minPrice: PRICE_MIN, maxPrice: PRICE_MAX })
  }

  return (
    <div className="bg-white p-4 rounded-lg filter-panel">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Filtros</h3>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Categoría</label>
        <div className="filter-categories">
          <label className="filter-category-item">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
            />
            <span>Todas las categorías</span>
          </label>
          {mergedCategories.map((catName) => (
            <label key={catName} className="filter-category-item">
              <input
                type="radio"
                name="category"
                value={catName}
                checked={String(selectedCategory).toLowerCase() === String(catName).toLowerCase()}
                onChange={() => setSelectedCategory(String(catName))}
              />
              <span>{catName}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Rango de precio</label>
        <div className="filter-price-range">
          <span>${PRICE_MIN}</span>
          <span>${PRICE_MAX}</span>
        </div>
        <div className="filter-slider-wrap">
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={sliderPrice}
            onChange={(e) => setSliderPrice(Number(e.target.value))}
            className="filter-slider"
          />
          <div className="filter-slider-value">Hasta ${sliderPrice.toLocaleString('es-MX')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button onClick={handleApply} className="btn btn--green btn--block">Aplicar</button>
        <button onClick={handleClear} className="btn btn--outline btn--block">Limpiar</button>
      </div>
    </div>
  )
}
