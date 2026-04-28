#!/bin/bash

# Lista de endpoints según tus routers
endpoints=(
  "categories"
  "faqs"
  "financial-accounts"
  "financial-movements"
  "notifications"
  "payment-methods"
  "payment-reminders"
  "post-images"
  "posts"
  "profiles"
  "purchase-items"
  "purchase-orders"
  "reports"
  "roles"
  "support-requests"
  "ticket-payment-evidences"
  "ticket-sales"
  "tickets"
  "transactions"
  "users"
)

# Iterar sobre cada endpoint y hacer curl
for endpoint in "${endpoints[@]}"; do
  echo "Consultando: http://localhost:3000/$endpoint"
  curl -s "http://localhost:3000/$endpoint" | jq .   # usa jq para formatear JSON
  echo "-----------------------------------------"
done
