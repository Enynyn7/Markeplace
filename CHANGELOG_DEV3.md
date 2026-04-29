# Change Log Técnico - Sprint 2 (Developer 3)

## Responsable
- **Rol:** Developer 3
- **Bloque:** Frontend
- **Fecha:** Sprint 2

## Resumen Ejecutivo
Se implementó y estructuró completamente el frontend del **Marketplace UDLAP** usando **React + Vite**, integrándolo con éxito al entorno Docker. Se adaptó el 100% de la UI basándose en el diseño proporcionado de **Figma** y se conectaron las interfaces a los endpoints del backend existente, cumpliendo con todas las validaciones de *Definition of Done*.

## Actividades Completadas
✅ **18. Revisión de la estructura:** Arquitectura definida para React SPA (Single Page Application).
✅ **19. Dockerfile del frontend:** Configuración Multi-stage. La primera etapa compila con `node:20-alpine` y la segunda expone estáticos en `nginx:alpine` (puerto 8080).
✅ **20. Integración en `docker-compose.yml`:** Frontend agregado como servicio que depende del backend. Redirige peticiones del puerto 8080.
✅ **21. Variables de Entorno:** Archivo `.env` y configuración Nginx implementada (`VITE_API_URL` apuntando a `http://localhost:3000`).
✅ **22. Detalle de Boletos (HU5):** Consumo del endpoint `GET /tickets/:id` en `/boletos/:id`.
✅ **23. Detalle de Producto (HU14):** Consumo del endpoint `GET /posts/:id` en `/productos/:id`.
✅ **24. Soporte y FAQ (HU22):** Consumo de `GET /faqs` y envío con `POST /support-requests`.
✅ **25. Validación de Datos:** Implementación de loaders, estados vacíos y manejo de errores (e.g., fallback en caso de "Failed to fetch").
✅ **26. Evidencia Visual:** Generación de capturas y tests de integración.
✅ **27. Change Log Técnico:** Este documento.

## Extras Implementados (Basados en Figma)
- **PreLogin y Login:** Vistas de acceso replicadas con layouts independientes (sin Navbar).
- **Dashboard Financiero (`/dashboard`):** Implementado con consumos dinámicos del endpoint `GET /financial-accounts`, combinando el balance de la base de datos con el mockup.
- **Marketplace General (`/marketplace`):** Catálogo general usando `GET /posts` con un componente reutilizable `TicketCard`.
- **Estilos Globales:** Se reescribió `index.css` integrando los tokens del Figma (colores UDLAP `#FF5722` y `#4CAF50`).

## Endpoints Integrados

| Feature | Ruta Frontend | Endpoint Backend | Método |
|---|---|---|---|
| Autenticación | `/` y `/login` | N/A (Mocked local) | N/A |
| Dashboard | `/dashboard` | `/financial-accounts` | GET |
| Catálogo | `/marketplace` | `/posts` | GET |
| Detalle Producto | `/productos/:id` | `/posts/:id` | GET |
| Boletos | `/boletos/:id` | `/tickets/:id` | GET |
| Preguntas Frec. | `/soporte` | `/faqs` | GET |
| Formulario Ayuda| `/soporte` | `/support-requests` | POST |

## Detalles de Infraestructura (Docker)
- **Frontend Container:** `marketplace_frontend` (Puerto local 8080).
- **Compilación:** Se requiere levantar todo con `docker compose up -d --build` para que Vite empaquete los assets y los pase a Nginx.

## Pruebas de Integración (Status: ✅ Completado)
1. **Docker Down/Up:** Se comprobó que el contenedor se compila exitosamente bajo Node 20.
2. **Backend Match:** La información financiera del Dashboard mapea correctamente la estructura de base de datos vs. el mockup.
3. **Manejo de Errores:** En el escenario donde la base de datos se encuentra vacía, la interfaz responde mostrando estados elegantes y nativos en lugar de romperse.

## Siguientes Pasos
- Conexión del Backend `/users` al login nativo para persistir sesiones.
- Sincronizar endpoints restantes del Marketplace con el CRUD completo a cargo de otros desarrolladores.
