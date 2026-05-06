const { Pool } = require('pg');

// Configuracion usando variables de entorno.
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'marketplace_db',
  password: process.env.DB_PASSWORD || 'tu_password',
  port: process.env.DB_PORT || 5432,
});

const ready = pool.query(`
  ALTER TABLE IF EXISTS post
    ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

  UPDATE category
     SET name = 'Producto',
         slug = 'producto',
         description = 'Articulos fisicos publicados en el marketplace',
         updated_at = NOW()
   WHERE id = 1;

  UPDATE category
     SET name = 'Servicio',
         slug = 'servicio',
         description = 'Servicios ofrecidos por la comunidad',
         updated_at = NOW()
   WHERE id = 2;

  UPDATE category
     SET name = 'Boleto',
         slug = 'boleto',
         description = 'Boletos o publicaciones relacionadas con sorteos',
         updated_at = NOW()
   WHERE id = 3;

  UPDATE category
     SET name = 'Otro',
         slug = 'otro',
         description = 'Publicaciones que no encajan en otra categoria',
         updated_at = NOW()
   WHERE id = 4;

  INSERT INTO category (id, name, slug, description)
  SELECT 1, 'Producto', 'producto', 'Articulos fisicos publicados en el marketplace'
  WHERE NOT EXISTS (SELECT 1 FROM category WHERE id = 1);

  INSERT INTO category (id, name, slug, description)
  SELECT 2, 'Servicio', 'servicio', 'Servicios ofrecidos por la comunidad'
  WHERE NOT EXISTS (SELECT 1 FROM category WHERE id = 2);

  INSERT INTO category (id, name, slug, description)
  SELECT 3, 'Boleto', 'boleto', 'Boletos o publicaciones relacionadas con sorteos'
  WHERE NOT EXISTS (SELECT 1 FROM category WHERE id = 3);

  INSERT INTO category (id, name, slug, description)
  SELECT 4, 'Otro', 'otro', 'Publicaciones que no encajan en otra categoria'
  WHERE NOT EXISTS (SELECT 1 FROM category WHERE id = 4);

  INSERT INTO financial_account (user_id, account_type, currency, balance)
  SELECT u.id, 'standard', 'MXN', 0.00
    FROM "user" u
   WHERE NOT EXISTS (
     SELECT 1
       FROM financial_account fa
      WHERE fa.user_id = u.id
   );
`).catch((err) => {
  console.error('No se pudo verificar la compatibilidad del esquema:', err.message);
  throw err;
});

pool.on('connect', () => {
  console.log('Conexion a la base de datos PostgreSQL lista');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
  pool,
  ready,
};
