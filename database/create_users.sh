#!/bin/bash

# =====================================================
# Cesto AI - Test Users Creation Script
# =====================================================
# This script creates all test users in the database
# Make sure the database is running before executing

echo "🚀 Creating test users for Cesto AI..."

# Check if database is running
echo "📋 Checking database connection..."

# Set database connection parameters
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-cesto_ai}
DB_USER=${DB_USER:-cesto_user}

# Test database connection
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
    echo "❌ Database is not running or not accessible"
    echo "Please start the database first:"
    echo "  docker-compose up -d postgres"
    echo "  or"
    echo "  npm run db:start"
    exit 1
fi

echo "✅ Database connection successful"

# Execute the SQL script
echo "👥 Creating test users..."

if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f create_test_users.sql; then
    echo "✅ Test users created successfully!"
    echo ""
    echo "📊 User Summary:"
    echo "  🔑 Admin Users: 4"
    echo "  🏭 Supplier Users: 10"
    echo "  🛒 Client Users: 20"
    echo "  🎯 Demo Users: 4"
    echo ""
    echo "🔐 Default passwords:"
    echo "  - Most users: password123"
    echo "  - Super admin: admin123"
    echo "  - Test users: test123, guest123, demo123"
    echo ""
    echo "🌐 You can now login with any of these users at:"
    echo "  http://localhost:4400"
else
    echo "❌ Error creating test users"
    echo "Please check the database logs and try again"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Happy testing!"
