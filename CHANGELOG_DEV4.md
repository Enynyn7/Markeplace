# Change Log Técnico — Developer 4

## Responsable
- Rol: Developer 4
- Bloque: Frontend (alineación Figma + integración de flujos reales)
- Fecha: 2026-05-03

## Resumen Ejecutivo
Se completó la fase de ajuste visual y funcional del frontend para dejar la app alineada al Figma sin romper integración con backend. Esta entrega incluyó:
- Migración de iconografía (emoji -> `Icon.jsx`) en pantallas clave.
- Reestructuración visual de `Marketplace` (búsqueda, filtros y tarjetas) con slider de precio.
- Corrección de bugs de navegación y de pantalla en blanco.
- Habilitación del flujo real de publicación (`POST /posts`).
- Implementación de las pantallas de perfil faltantes: Métodos de pago, Mis publicaciones, Mis compras y Configuración.

## Objetivos Cubiertos
- Ajuste visual integral según Figma (layout, spacing, iconos y navegación inferior).
- Preservar lógica real y conexiones API existentes.
- Evitar mocks en flujos principales cuando existía endpoint real.
- Mantener compatibilidad móvil/desktop.

## Cambios Implementados

### 1) Sistema de iconos y limpieza visual
- Se creó `frontend/src/components/Icon.jsx` como librería local de SVGs reutilizables.
- Se reemplazaron emojis por iconos en múltiples páginas:
  - `Home`, `Dashboard`, `Marketplace`, `Products`, `Tickets`, `Profile`, `Notifications`, `Support`, `Login`, `Register`, `RecoverPassword`, `ResetPassword`.
- Resultado:
  - Consistencia visual.
  - Control de tamaño vía clases (`w-*`, `h-*`).
  - Eliminación de dependencias externas de iconos.

### 2) Navegación y layout principal
- Se integró navegación inferior fija (`BottomNav`) para experiencia mobile-first:
  - Archivo: `frontend/src/components/BottomNav.jsx`
  - Integración en layout: `frontend/src/main.jsx`
- Se ajustó `Navbar` para mantener navegación coherente y retirar accesos no requeridos.
- Se normalizó el espaciado para evitar solape con bottom nav.

### 3) Marketplace: estructura, filtros y estabilidad
- Se añadió componente de filtros dedicado:
  - Archivo: `frontend/src/components/FilterSection.jsx`
- Filtros implementados:
  - Categorías (lista vertical)
  - Slider de rango de precio (`$10` a `$10000`)
  - Botones `Aplicar` y `Limpiar`
- Reordenamiento visual de la página para cumplir flujo solicitado:
  - Barra de búsqueda
  - Bloque de filtros (vertical)
  - Publicaciones
- Corrección de pantalla en blanco al abrir Marketplace:
  - Se cambió `getCategoryName` a función hoisted para evitar referencia antes de inicialización.
- Corrección de publicaciones no visibles:
  - Se ajustó la lógica de precio para no excluir posts sin campo `price`/`amount`.

### 4) Tarjetas de publicaciones y boletos
- Refactor de `TicketCard`:
  - Placeholder visual consistente.
  - Navegación a detalle desde la imagen.
  - Botones normalizados con design system (`btn`): `Comprar` y `Ver detalles`.
- Ajustes de estilos en `index.css` para:
  - Media container de tarjetas.
  - Placeholder icon/text.
  - Tipografía de precio y separaciones.

### 5) Boletos y flujo "Publicar en Marketplace"
- `Tickets` evolucionó a modo gestión/listado cuando no hay `id`:
  - Estadísticas vendidas/pendientes.
  - Estado y tarjetas listadas.
- Botón `Publicar en Marketplace` actualizado para ruta dedicada:
  - `'/marketplace/publicar'`

### 6) Publicación real (sin mock)
- Se creó pantalla de alta de publicación:
  - Archivo: `frontend/src/pages/CreateListing.jsx`
- Integración API real:
  - `POST /posts` con payload válido (`category_id`, `author_user_id`, `title`, `slug`, `content`, `status`, `published_at`).
- Se agregó helper en API:
  - `createPost(data)` en `frontend/src/api.js`

### 7) Nuevas pantallas de Perfil (solicitadas)
Se implementaron las 4 pantallas faltantes y su navegación:

1. `frontend/src/pages/Payments.jsx`
- Métodos de pago reales del usuario.
- Alta y eliminación de método.
- Endpoints:
  - `GET /payment-methods`
  - `POST /payment-methods`
  - `DELETE /payment-methods/:id`

2. `frontend/src/pages/MyListings.jsx`
- Publicaciones propias del usuario (`author_user_id`).
- Eliminación de publicación.
- Endpoints:
  - `GET /posts`
  - `DELETE /posts/:id`

3. `frontend/src/pages/MyPurchases.jsx`
- Compras del usuario con resumen y listado.
- Unión frontend de órdenes + ítems.
- Endpoints:
  - `GET /purchase-orders`
  - `GET /purchase-items`

4. `frontend/src/pages/Settings.jsx`
- Configuración de notificaciones/preferencias.
- Persistencia local (`localStorage`), sin romper backend.

### 8) Rutas y mapeo de botones
- Rutas añadidas en `frontend/src/main.jsx`:
  - `/marketplace/publicar`
  - `/payments`
  - `/transactions`
  - `/listings`
  - `/settings`
- Mapeo solicitado en Inicio/Dashboard:
  - Botón Historial -> Mis compras (`/transactions`)
  - Botón Pagos -> Métodos de pago (`/payments`)
- Menú Perfil actualizado para abrir pantallas correctas.

## API Helpers Nuevos/Ampliados (`frontend/src/api.js`)
- `createPost(data)`
- `deletePost(id)`
- `getPaymentMethods()`
- `createPaymentMethod(data)`
- `deletePaymentMethod(id)`
- `getPurchaseOrders()`
- `getPurchaseItems()`

## Archivos Nuevos
- `frontend/src/components/Icon.jsx`
- `frontend/src/components/BottomNav.jsx`
- `frontend/src/components/FilterSection.jsx`
- `frontend/src/pages/CreateListing.jsx`
- `frontend/src/pages/Payments.jsx`
- `frontend/src/pages/MyListings.jsx`
- `frontend/src/pages/MyPurchases.jsx`
- `frontend/src/pages/Settings.jsx`

## Archivos Modificados Relevantes
- `frontend/src/main.jsx`
- `frontend/src/api.js`
- `frontend/src/index.css`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/TicketCard.jsx`
- `frontend/src/pages/Marketplace.jsx`
- `frontend/src/pages/Tickets.jsx`
- `frontend/src/pages/Profile.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Notifications.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/pages/Products.jsx`
- `frontend/src/pages/Support.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`
- `frontend/src/pages/RecoverPassword.jsx`
- `frontend/src/pages/ResetPassword.jsx`

## Bugs Corregidos en la Iteración
- Pantalla en blanco al entrar a Marketplace por inicialización de función.
- Publicaciones ocultas por filtro de precio sobre datos sin campo `price`.
- Botón "Publicar en Marketplace" redirigiendo a ruta no deseada.
- Iconos sobredimensionados en notificaciones y acciones rápidas de dashboard.
- Botones sin formato en tarjetas y acciones de boletos.

## Estado Final
- Entrega completada con rutas funcionales, pantallas faltantes implementadas y estilos alineados al Figma.
- Validación de errores estáticos en archivos modificados: sin errores de sintaxis reportados.
- Integración con backend mantenida en los flujos que cuentan con endpoint real.
