#!/bin/bash

# CESTO AI Database Seeder Script
# Este script ejecuta el seeder para poblar la base de datos con datos de prueba

echo "🚀 Iniciando CESTO AI Database Seeder..."
echo "========================================"

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor inicia Docker primero."
    exit 1
fi

# Verificar si docker compose está disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado."
    exit 1
fi

echo "📦 Deteniendo contenedores existentes..."
docker compose down

echo "🗑️  Eliminando volúmenes de base de datos para limpiar datos anteriores..."
docker volume rm cesto_postgres_data 2>/dev/null || true
docker volume rm cesto_redis_data 2>/dev/null || true

echo "🔨 Construyendo y ejecutando contenedores..."
docker compose up --build -d postgres redis

echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 10

# Verificar que PostgreSQL esté listo
echo "🔍 Verificando conexión a PostgreSQL..."
until docker compose exec postgres pg_isready -U cesto_user -d cesto_ai; do
    echo "⏳ Esperando PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL está listo!"

echo "📊 Verificando que el seeder se ejecutó correctamente..."
# Verificar que los usuarios fueron creados
USER_COUNT=$(docker compose exec -T postgres psql -U cesto_user -d cesto_ai -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')

if [ "$USER_COUNT" -gt "0" ]; then
    echo "✅ Seeder ejecutado exitosamente!"
    echo "📈 Usuarios creados: $USER_COUNT"
    
    echo ""
    echo "🎯 Credenciales de Prueba:"
    echo "========================="
    echo "🔐 Contraseña para TODOS los usuarios: Test1234"
    echo ""
    echo "👤 Admin:        admin@cesto.ai"
    echo "👤 Cliente Demo: demo@stockfiller.com"
    echo "👤 Cliente:      buyer@restaurant.com"
    echo "👤 Proveedor:    supplier@dairy.com"
    echo "👤 Proveedor:    supplier@meat.com"
    echo ""
    echo "🚀 Para iniciar la aplicación completa:"
    echo "   docker-compose up"
    echo ""
    echo "🌐 URLs de acceso:"
    echo "   Frontend: http://localhost:4400"
    echo "   Backend:  http://localhost:3400"
    echo "   AI Services: http://localhost:8001"
    
else
    echo "❌ Error: El seeder no se ejecutó correctamente."
    echo "🔍 Revisando logs de PostgreSQL..."
    docker compose logs postgres
    exit 1
fi

echo ""
echo "🎉 ¡Seeder completado exitosamente!"
