#!/bin/bash

echo "🚀 Starting Cesto AI Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please review and update the .env file with your configuration."
fi

# Start services
echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U cesto_user -d cesto_ai > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

# Check Backend
if curl -s http://localhost:3400/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend API is ready"
else
    echo "⏳ Backend API is starting..."
fi

# Check AI Services
if curl -s http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ AI Services are ready"
else
    echo "⏳ AI Services are starting..."
fi

echo ""
echo "🎉 Cesto AI Platform is starting up!"
echo ""
echo "📱 Access points:"
echo "   Frontend:    http://localhost:4400"
echo "   Backend API: http://localhost:3400/api/v1"
echo "   AI Services: http://localhost:8001"
echo "   Database:    localhost:5432"
echo ""
echo "📚 Documentation:"
echo "   Backend API Docs: http://localhost:3400/api/docs"
echo "   AI Services Docs: http://localhost:8001/docs"
echo ""
echo "🔧 To stop the services: docker-compose down"
echo "📊 To view logs: docker-compose logs -f"
echo ""
echo "Happy coding! 🚀"
