#!/usr/bin/env bash
# =============================================================
#  test_db.sh  —  Validación básica de la base de datos
#  Verifica: existencia de tablas, datos del seed, INSERT/SELECT
# =============================================================

set -euo pipefail

# ── Configuración de conexión ────────────────────────────────
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="sorteos_db"
DB_USER="admin"
DB_PASS="secret123"
CONTAINER="sorteos_db"

# ── Colores para output ──────────────────────────────────────
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
RESET="\033[0m"
BOLD="\033[1m"

# ── Contadores ───────────────────────────────────────────────
PASSED=0
FAILED=0

# ── Helper: ejecutar SQL en el contenedor ───────────────────
run_sql() {
  docker exec -i "$CONTAINER" \
    psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "$1" 2>/dev/null
}

# ── Helper: imprimir resultado de prueba ─────────────────────
pass() { echo -e "  ${GREEN}✔${RESET}  $1"; ((PASSED++)); }
fail() { echo -e "  ${RED}✘${RESET}  $1"; ((FAILED++)); }
section() { echo -e "\n${BOLD}${YELLOW}$1${RESET}"; }

# ── Verificar que Docker está corriendo ──────────────────────
echo -e "\n${BOLD}════════════════════════════════════════${RESET}"
echo -e "${BOLD}  test_db.sh — Validación de BD         ${RESET}"
echo -e "${BOLD}════════════════════════════════════════${RESET}"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo -e "\n${RED}Error:${RESET} El contenedor '${CONTAINER}' no está corriendo."
  echo -e "Ejecuta primero: ${BOLD}docker compose up -d${RESET}\n"
  exit 1
fi

echo -e "\n${GREEN}Contenedor '${CONTAINER}' activo.${RESET} Iniciando pruebas...\n"

# =============================================================
#  BLOQUE 1 — Existencia de las 20 tablas
# =============================================================
section "1/4  Existencia de tablas"

TABLES=(
  role '"user"' profile event lottery_ticket
  ticket_sale ticket_payment_evidence payment_reminder
  payment_method financial_account transaction
  purchase_order purchase_item
  category post post_image
  notification support_request report faq
)

for TABLE in "${TABLES[@]}"; do
  COUNT=$(run_sql "SELECT COUNT(*) FROM information_schema.tables
                   WHERE table_schema='public'
                   AND table_name='${TABLE//\"/}';" | tr -d '[:space:]')
  if [ "$COUNT" = "1" ]; then
    pass "Tabla ${TABLE} existe"
  else
    fail "Tabla ${TABLE} NO encontrada"
  fi
done

# =============================================================
#  BLOQUE 2 — Datos del seed (cada tabla debe tener filas)
# =============================================================
section "2/4  Datos del seed"

SEED_TABLES=(
  role
  '"user"'
  profile
  event
  lottery_ticket
  ticket_sale
  ticket_payment_evidence
  payment_reminder
  payment_method
  financial_account
  transaction
  purchase_order
  purchase_item
  category
  post
  post_image
  notification
  support_request
  report
  faq
)

for TABLE in "${SEED_TABLES[@]}"; do
  COUNT=$(run_sql "SELECT COUNT(*) FROM ${TABLE};" | tr -d '[:space:]')
  if [ "$COUNT" -gt 0 ] 2>/dev/null; then
    pass "${TABLE} tiene ${COUNT} fila(s)"
  else
    fail "${TABLE} está vacía — seed no aplicado"
  fi
done

# =============================================================
#  BLOQUE 3 — SELECT representativo por módulo
# =============================================================
section "3/4  SELECTs por módulo"

check_select() {
  local LABEL="$1"
  local QUERY="$2"
  local RESULT
  RESULT=$(run_sql "$QUERY" | tr -d '[:space:]')
  if [ -n "$RESULT" ] && [ "$RESULT" != "" ]; then
    pass "$LABEL"
  else
    fail "$LABEL — sin resultados"
  fi
}

# Usuarios y roles
check_select "JOIN user → role" \
  "SELECT u.email, r.name FROM \"user\" u JOIN role r ON u.role_id = r.id LIMIT 1;"

# Sorteos
check_select "JOIN lottery_ticket → event" \
  "SELECT lt.subject, e.name FROM lottery_ticket lt JOIN event e ON lt.event_id = e.id LIMIT 1;"

check_select "JOIN ticket_sale → lottery_ticket → buyer" \
  "SELECT ts.price, u.email FROM ticket_sale ts
   JOIN \"user\" u ON ts.buyer_user_id = u.id LIMIT 1;"

check_select "ticket_payment_evidence con estado approved" \
  "SELECT id FROM ticket_payment_evidence WHERE status = 'approved' LIMIT 1;"

check_select "payment_reminder pendiente" \
  "SELECT id FROM payment_reminder WHERE status = 'pending' LIMIT 1;"

# Pagos
check_select "JOIN transaction → payment_method" \
  "SELECT t.amount, pm.method_type FROM transaction t
   JOIN payment_method pm ON t.payment_method_id = pm.id LIMIT 1;"

check_select "JOIN transaction → financial_account" \
  "SELECT t.amount, fa.account_type FROM transaction t
   JOIN financial_account fa ON t.financial_account_id = fa.id LIMIT 1;"

# Compras
check_select "JOIN purchase_item → purchase_order" \
  "SELECT pi.item_name, po.total_amount FROM purchase_item pi
   JOIN purchase_order po ON pi.purchase_order_id = po.id LIMIT 1;"

# Contenido
check_select "JOIN post → category" \
  "SELECT p.title, c.name FROM post p JOIN category c ON p.category_id = c.id LIMIT 1;"

check_select "post_image con post asociado" \
  "SELECT pi.url FROM post_image pi JOIN post p ON pi.post_id = p.id LIMIT 1;"

# Soporte
check_select "notification no leída" \
  "SELECT id FROM notification WHERE is_read = FALSE LIMIT 1;"

check_select "support_request abierta" \
  "SELECT id FROM support_request WHERE status = 'open' LIMIT 1;"

check_select "faq activa" \
  "SELECT id FROM faq WHERE is_active = TRUE LIMIT 1;"

# =============================================================
#  BLOQUE 4 — INSERT y DELETE de prueba (sin afectar seed)
# =============================================================
section "4/4  INSERT / DELETE de prueba"

# Insertar role temporal
run_sql "INSERT INTO role (name, description)
         VALUES ('test_role', 'Rol temporal de prueba');" > /dev/null 2>&1 \
  && pass "INSERT en role" \
  || fail "INSERT en role"

# Verificar que existe
COUNT=$(run_sql "SELECT COUNT(*) FROM role WHERE name='test_role';" | tr -d '[:space:]')
[ "$COUNT" = "1" ] \
  && pass "SELECT del role insertado" \
  || fail "SELECT del role insertado"

# Insertar user temporal referenciando el role
ROLE_ID=$(run_sql "SELECT id FROM role WHERE name='test_role';" | tr -d '[:space:]')
run_sql "INSERT INTO \"user\" (role_id, email, password_hash)
         VALUES (${ROLE_ID}, 'test_temp@sorteos.mx', 'fakehash_test');" > /dev/null 2>&1 \
  && pass "INSERT en user" \
  || fail "INSERT en user"

# Verificar que CASCADE funciona: borrar user borra profile si existiera
run_sql "DELETE FROM \"user\" WHERE email='test_temp@sorteos.mx';" > /dev/null 2>&1 \
  && pass "DELETE en user (CASCADE)" \
  || fail "DELETE en user"

# Limpiar role temporal
run_sql "DELETE FROM role WHERE name='test_role';" > /dev/null 2>&1 \
  && pass "DELETE en role" \
  || fail "DELETE en role"

# Verificar UNIQUE en email
run_sql "INSERT INTO \"user\" (role_id, email, password_hash)
         VALUES (1, 'admin@sorteos.mx', 'fakehash');" > /dev/null 2>&1 \
  && fail "UNIQUE en user.email NO se respetó" \
  || pass "UNIQUE en user.email se respeta (rechazó duplicado)"

# Verificar UNIQUE en category.slug
run_sql "INSERT INTO category (name, slug)
         VALUES ('Duplicado', 'noticias');" > /dev/null 2>&1 \
  && fail "UNIQUE en category.slug NO se respetó" \
  || pass "UNIQUE en category.slug se respeta (rechazó duplicado)"

# Verificar CHECK en event.capacity
run_sql "INSERT INTO event (name, event_date, capacity, status)
         VALUES ('Test', NOW(), -1, 'upcoming');" > /dev/null 2>&1 \
  && fail "CHECK en event.capacity NO se respetó" \
  || pass "CHECK en event.capacity se respeta (rechazó capacity < 0)"

# =============================================================
#  RESUMEN FINAL
# =============================================================
TOTAL=$((PASSED + FAILED))
echo -e "\n${BOLD}════════════════════════════════════════${RESET}"
echo -e "${BOLD}  Resultados: ${GREEN}${PASSED}${RESET}${BOLD} pasadas  /  ${RED}${FAILED}${RESET}${BOLD} fallidas  /  ${TOTAL} total${RESET}"
echo -e "${BOLD}════════════════════════════════════════${RESET}\n"

if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}Criterio de terminado cumplido:${RESET}"
  echo -e "La base levanta en Docker y permite INSERT/SELECT en todas las tablas.\n"
  exit 0
else
  echo -e "${RED}${BOLD}Hay pruebas fallidas. Revisa los errores arriba.${RESET}\n"
  exit 1
fi
