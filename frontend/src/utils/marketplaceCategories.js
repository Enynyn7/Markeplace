// Get categories from API (normalized)
export function getMarketplaceCategories(categories = []) {
  return Array.isArray(categories) ? categories : []
}

// Find category by ID
export function findCategoryById(categories = [], categoryId) {
  const id = Number(categoryId)
  return categories.find((cat) => Number(cat?.id) === id) || null
}