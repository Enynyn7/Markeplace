# Change Log Técnico - Developer 1 (Sprint 2)

**Objetivo del bloque de trabajo:**
Integrar el backend y la base de datos (PostgreSQL) dentro del entorno Docker. Además, sustituir los endpoints simulados (mocks) por consultas SQL reales para cumplir con los requerimientos de la HU5 (Detalle de boletos) y la HU22 (Soporte y FAQs).

**Cambios realizados:**
1. Modificación del archivo `docker-compose.yml` para levantar un contenedor de PostgreSQL 16.
2. Configuración de volúmenes en Docker para ejecutar automáticamente los scripts `01_schema.sql` y `02_seed.sql` al iniciar la base de datos.
3. Se enlazó el contenedor del backend con el de la base de datos usando un `healthcheck` para asegurar el orden de arranque.
4. Implementación de consulta `SELECT` simple en la ruta de FAQs para traer la información real (HU22).
5. Implementación de consulta avanzada con múltiples `JOIN` en la ruta de Tickets para unificar datos del boleto, la venta, el comprador y la evidencia de pago (HU5).

**Archivos o módulos modificados:**
* `docker-compose.yml` (Raíz del proyecto)
* `src/routes/faqs.js` (Sustitución de mocks por SQL)
* `src/routes/tickets.js` (Sustitución de mocks por SQL)

**Evidencia generada:**
*(Nota: Adjuntar aquí las capturas de pantalla)*
* Captura de Docker Desktop mostrando los contenedores `db` y `backend` corriendo en verde.
* Captura de la terminal mostrando el mensaje de conexión exitosa a PostgreSQL.
* Capturas de las respuestas JSON exitosas en el navegador/Postman para las rutas `/faqs` y `/tickets/2`.

**Impedimentos encontrados:**
* Docker no reflejaba los cambios en el código de Node.js de forma inmediata debido a contenedores "dormidos" o en caché.
* **Solución:** Se utilizó el comando `docker compose down` para limpiar el entorno y `docker compose up --build` para forzar la reconstrucción de la imagen del backend con el código fresco.

**Siguiente paso:**
El backend queda completamente listo y probado para las HU5 y HU22. El siguiente paso es notificar al Developer 3 (Frontend) para que comience a consumir estas rutas y renderizar las vistas correspondientes.