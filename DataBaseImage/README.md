# Base de Datos — Plataforma de Sorteos

Documentación técnica de la capa de datos del proyecto. Incluye el esquema relacional, datos de prueba, configuración de Docker y scripts de validación.

---

## Estructura del directorio

```
db/
├── docker-compose.yml       # Configuración del contenedor PostgreSQL
├── sql/
│   ├── 01_schema.sql        # DDL: creación de tablas, constraints e índices
│   └── 02_seed.sql          # DML: datos de prueba para desarrollo
├── test_db.sh               # Script de validación de la base de datos
└── README.md                # Este archivo
```

---

## Requisitos previos

| Herramienta   | Versión mínima | Verificar con         |
|---------------|----------------|-----------------------|
| Docker        | 24.x           | `docker --version`    |
| Docker Compose| 2.x            | `docker compose version` |

---

## Levantar la base de datos

```bash
# 1. Clonar el repositorio y entrar al directorio de BD
cd db/

# 2. Levantar el contenedor en segundo plano
docker compose up -d

# 3. Verificar que el contenedor esté corriendo y sano
docker compose ps

# 4. Ver logs de inicialización (schema + seed)
docker compose logs db
```

Al primer arranque, Docker ejecuta automáticamente `01_schema.sql` y `02_seed.sql` en ese orden. Las ejecuciones siguientes omiten este paso porque los datos ya persisten en el volumen.

---

## Credenciales de conexión (solo desarrollo)

| Parámetro | Valor        |
|-----------|--------------|
| Host      | `localhost`  |
| Puerto    | `5432`       |
| Base      | `sorteos_db` |
| Usuario   | `admin`      |
| Contraseña| `secret123`  |

> **Nunca usar estas credenciales en producción.** Para producción, manejar los secretos con variables de entorno o un gestor de secretos.

### Cadena de conexión

```
postgresql://admin:secret123@localhost:5432/sorteos_db
```

---

## Conectarse manualmente con psql

```bash
# Desde fuera del contenedor
docker exec -it sorteos_db psql -U admin -d sorteos_db

# Comandos útiles dentro de psql
\dt                  -- listar todas las tablas
\d nombre_tabla      -- describir estructura de una tabla
\di                  -- listar índices
\q                   -- salir
```

---

## Esquema — resumen de tablas

El esquema contiene **20 tablas** organizadas en 6 módulos:

### Usuarios y roles
| Tabla     | Descripción                                 |
|-----------|---------------------------------------------|
| `role`    | Roles del sistema (admin, staff, buyer, auditor) |
| `user`    | Cuentas de acceso                           |
| `profile` | Datos personales del usuario (1:1 con user) |

### Sorteos
| Tabla                     | Descripción                              |
|---------------------------|------------------------------------------|
| `event`                   | Eventos o sorteos disponibles            |
| `lottery_ticket`          | Boletos pertenecientes a un evento       |
| `ticket_sale`             | Registro de venta de un boleto           |
| `ticket_payment_evidence` | Comprobantes de pago subidos por el comprador |
| `payment_reminder`        | Recordatorios de pago pendiente          |

### Pagos
| Tabla               | Descripción                              |
|---------------------|------------------------------------------|
| `payment_method`    | Métodos de pago registrados por el usuario |
| `financial_account` | Cuentas financieras del usuario          |
| `transaction`       | Registro de cada movimiento de dinero    |

### Compras
| Tabla            | Descripción                        |
|------------------|------------------------------------|
| `purchase_order` | Órdenes de compra                  |
| `purchase_item`  | Ítems individuales de una orden    |

### Contenido
| Tabla        | Descripción                          |
|--------------|--------------------------------------|
| `category`   | Categorías de posts                  |
| `post`       | Publicaciones del blog               |
| `post_image` | Imágenes asociadas a un post         |

### Soporte y comunidad
| Tabla             | Descripción                              |
|-------------------|------------------------------------------|
| `notification`    | Notificaciones enviadas a usuarios       |
| `support_request` | Tickets de soporte al cliente            |
| `report`          | Reportes internos y de auditoría         |
| `faq`             | Preguntas frecuentes con autor de origen |

---

## Decisiones de diseño

**`ON DELETE CASCADE` en relaciones de usuario:** Al eliminar un usuario se eliminan en cascada su perfil, boletos, ventas, transacciones, notificaciones, etc. Esto mantiene integridad referencial sin dejar registros huérfanos.

**`ON DELETE SET NULL` en transacciones:** Si se elimina un método de pago o cuenta financiera, el historial de transacciones se conserva con el campo FK en `NULL`. El registro financiero nunca se borra.

**`ON DELETE SET NULL` en FAQ.user_id:** Las preguntas que derivaron en FAQs se conservan aunque el usuario que las originó sea eliminado. El contenido persiste, solo se pierde la referencia al autor.

**`ON DELETE RESTRICT` en categorías de posts:** No se puede borrar una categoría si tiene posts asociados. Esto obliga a reasignar los posts antes de eliminar la categoría.

**`SERIAL` para IDs:** Se usan enteros autoincrement por simplicidad. Para una API pública se recomienda migrar a `UUID` para evitar enumeración de recursos.

**Índices:** Se crearon índices en todas las FKs de uso frecuente y en los campos `slug` de `post` y `category` para acelerar búsquedas por URL.

---

## Resetear la base de datos

```bash
# Bajar el contenedor Y borrar el volumen de datos
docker compose down -v

# Volver a levantar (corre schema + seed de nuevo)
docker compose up -d
```

---

## Ejecutar pruebas de validación

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x test_db.sh

# Correr las pruebas
./test_db.sh
```

El script verifica que todas las tablas existen, tienen datos del seed, y que INSERT/SELECT funcionan correctamente. Ver sección de resultados esperados en el mismo script.

---

## Equipo

Proyecto desarrollado para la materia de **Ingeniería de Software**.
