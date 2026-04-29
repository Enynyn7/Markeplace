#!/bin/bash

# test-api.sh
# Script para probar las rutas POST (push) a la base de datos de la API del Marketplace UDLAP

BASE_URL="http://localhost:3000"

echo "========================================="
echo " Iniciando pruebas de la API (Marketplace)"
echo " Base URL: $BASE_URL"
echo "========================================="
echo ""

echo "--- 1. Creando un Usuario ---"
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": 1,
    "email": "prueba_script@udlap.mx",
    "password_hash": "hash_seguro",
    "status": "active"
  }'
echo -e "\n\n"
sleep 1

echo "--- 2. Obteniendo lista de Usuarios ---"
curl -s -X GET "$BASE_URL/users"
echo -e "\n\n"
sleep 1

echo "--- 3. Creando un Perfil (Asignado al user_id: 7) ---"
curl -s -X POST "$BASE_URL/profiles" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 7,
    "phone": "2229876543",
    "student_id": "180999",
    "bio": "Perfil creado automáticamente desde script de pruebas"
  }'
echo -e "\n\n"
sleep 1

echo "--- 4. Creando Cuenta Financiera (Asignada al user_id: 7) ---"
curl -s -X POST "$BASE_URL/financial-accounts" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 7,
    "account_type": "stripe",
    "currency": "MXN",
    "balance": 500.00
  }'
echo -e "\n\n"
sleep 1

echo "--- 5. Creando Categoría ---"
curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Deportes",
    "slug": "deportes",
    "description": "Artículos deportivos y ropa de entrenamiento"
  }'
echo -e "\n\n"

echo "========================================="
echo " Pruebas finalizadas."
echo "========================================="
