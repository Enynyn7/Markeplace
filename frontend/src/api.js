/**
 * Módulo centralizado para comunicación con el backend API.
 * Usa la variable de entorno VITE_API_URL para determinar la URL base.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
export async function getTickets() {
  const res = await fetch(`${API_URL}/tickets`);
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
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error ${res.status}`);
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
export async function getFinancialAccounts() {
  const res = await fetch(`${API_URL}/financial-accounts`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
