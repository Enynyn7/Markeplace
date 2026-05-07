/**
 * Módulo centralizado para comunicación con el backend API.
 * Usa la variable de entorno VITE_API_URL para determinar la URL base.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function parseApiError(res) {
  const error = await res.json().catch(() => ({}));
  return new Error(error.message || error.error || `Error ${res.status}`);
}

/**
 * HU5 — Obtener detalle de un boleto por ID
 * Endpoint: GET /tickets/:id
 */
export async function getTicketDetail(id) {
  const res = await fetch(`${API_URL}/tickets/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error ${res.status}`);
  }
  return res.json();
}

/**
 * HU5 — Obtener lista de todos los boletos
 * Endpoint: GET /tickets
 */
export async function getTickets(userId) {
  const url = userId ? `${API_URL}/tickets?user_id=${userId}` : `${API_URL}/tickets`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * HU14 — Obtener detalle de un producto/post por ID
 * Endpoint: GET /posts/:id
 */
export async function getPostDetail(id) {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

/**
 * HU14 — Obtener lista de productos/posts
 * Endpoint: GET /posts
 */
export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Crear publicación en marketplace
 * Endpoint: POST /posts
 */
export async function createPost(data) {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

export async function createPostImage(data) {
  const res = await fetch(`${API_URL}/post-images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

/**
 * HU22 — Obtener preguntas frecuentes
 * Endpoint: GET /faqs
 */
export async function getFAQs() {
  const res = await fetch(`${API_URL}/faqs`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * HU22 — Enviar solicitud de soporte
 * Endpoint: POST /support-requests
 */
export async function submitSupportRequest(data) {
  const res = await fetch(`${API_URL}/support-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Usuarios
 * Endpoint: GET /users
 */
export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Cuentas Financieras
 * Endpoint: GET /financial-accounts
 */
export async function getFinancialAccounts(userId) {
  const url = userId ? `${API_URL}/financial-accounts?user_id=${userId}` : `${API_URL}/financial-accounts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
/**
 * Categorías
 * Endpoint: GET /categories
 */
export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Movimientos Financieros
 */
export async function getFinancialMovements(accountId, userId) {
  const params = new URLSearchParams();
  if (accountId) params.set('account_id', accountId);
  if (userId) params.set('user_id', userId);
  const url = params.toString() ? `${API_URL}/financial-movements?${params}` : `${API_URL}/financial-movements`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Perfiles
 */
export async function getProfile(userId) {
  const res = await fetch(`${API_URL}/profiles?user_id=${userId}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function updateProfile(id, data) {
  const res = await fetch(`${API_URL}/profiles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Notificaciones
 */
export async function getNotifications(userId) {
  const res = await fetch(`${API_URL}/notifications?user_id=${userId}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Métodos de pago
 */
export async function getPaymentMethods(userId) {
  const url = userId ? `${API_URL}/payment-methods?user_id=${userId}` : `${API_URL}/payment-methods`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createPaymentMethod(data) {
  const res = await fetch(`${API_URL}/payment-methods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

export async function deletePaymentMethod(id) {
  const res = await fetch(`${API_URL}/payment-methods/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

/**
 * Compras
 */
export async function getPurchaseOrders(userId) {
  const url = userId ? `${API_URL}/purchase-orders?user_id=${userId}` : `${API_URL}/purchase-orders`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getPurchaseItems(purchaseOrderId) {
  const url = purchaseOrderId ? `${API_URL}/purchase-items?purchase_order_id=${purchaseOrderId}` : `${API_URL}/purchase-items`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createPurchaseOrder(data) {
  const res = await fetch(`${API_URL}/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

export async function updatePurchaseOrder(id, data) {
  const res = await fetch(`${API_URL}/purchase-orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

export async function createPurchaseItem(data) {
  const res = await fetch(`${API_URL}/purchase-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_URL}/notifications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_read: true }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/**
 * Recuperación de contraseña
 */
export async function recoverPassword(email) {
  const res = await fetch(`${API_URL}/auth/recover-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function resetPassword(email, code, newPassword) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getAvailableTickets(userId) {
  return apiFetch(`/tickets/available?user_id=${encodeURIComponent(userId)}`);
}

export async function createTicket(ticketData) {
  return apiFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData)
  });
}
