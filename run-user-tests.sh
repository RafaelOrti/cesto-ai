#!/bin/bash

# Script to test user authentication and roles with the backend

echo "🚀 Starting User Role Authentication Tests"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if axios is installed
if ! node -e "require('axios')" 2>/dev/null; then
    echo "📦 Installing axios..."
    npm install axios
fi

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:3400/api/v1/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running. Please start the backend first."
    echo "   Run: cd backend && npm run start:dev"
    exit 1
fi

# Run database setup if needed
echo "🗄️ Setting up test users in database..."
if [ -f "create-test-users.sql" ]; then
    echo "   Found SQL script for test users"
    echo "   Please run this SQL script in your database:"
    echo "   psql -d your_database -f create-test-users.sql"
    echo ""
fi

# Run the simple authentication test
echo "🧪 Running authentication tests..."
node test-auth-simple.js

echo ""
echo "✅ Tests completed!"
echo ""
echo "📋 Next steps:"
echo "1. If any tests failed, check the backend logs"
echo "2. Verify the database has the test users"
echo "3. Check that JWT_SECRET is set in backend environment"
echo "4. Ensure all required database tables exist"

