# Change Log Técnico — Developer 2

## Rol
Developer 2 — Pruebas + backend funcional de HU14

## Actividades realizadas
- Se eligió y configuró Jest con Supertest como framework de pruebas para backend.
- Se implementó la prueba automatizada del endpoint de detalle de producto correspondiente a HU14.
- Se ajustó el endpoint `GET /posts/:id` para devolver el detalle completo del producto.
- Se validó manualmente la respuesta del endpoint con datos de prueba.
- Se ejecutaron pruebas y se obtuvo evidencia visual de su funcionamiento.
- Se realizaron commits y push al repositorio con los cambios correspondientes.

## Endpoint trabajado
- **HU14 — Detalle de producto**
- **Ruta:** `GET /posts/:id`

## Resultado esperado del endpoint
El endpoint devuelve un mensaje de éxito y un objeto `data` con la información del producto, incluyendo:
- id
- seller_id
- category_id
- title
- description
- price
- status
- includes_ticket
- images

## Framework de pruebas
- Jest
- Supertest

## Commit principal
- `Configura pruebas backend y valida HU14 con Jest y Supertest`
- `Ajusta endpoint HU14 en posts`

## Estado final
La HU14 quedó funcional a nivel backend y cuenta con validación manual y prueba automatizada.
