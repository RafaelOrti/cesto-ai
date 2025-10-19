#!/bin/bash

# =====================================================
# CESTO AI - Comprehensive Database Seeder Runner
# =====================================================

echo "🚀 Starting CESTO AI Comprehensive Database Seeder..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database connection parameters
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-cesto_ai}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

echo -e "${BLUE}📊 Database Configuration:${NC}"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Check if PostgreSQL is running
echo -e "${YELLOW}🔍 Checking PostgreSQL connection...${NC}"
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running or not accessible${NC}"
    echo "Please ensure PostgreSQL is running and accessible"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL connection successful${NC}"

# Check if database exists
echo -e "${YELLOW}🔍 Checking if database exists...${NC}"
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}❌ Database '$DB_NAME' does not exist${NC}"
    echo "Please create the database first or check your connection parameters"
    exit 1
fi
echo -e "${GREEN}✅ Database '$DB_NAME' exists${NC}"

# Backup existing data (optional)
read -p "Do you want to backup existing data before running seeder? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    echo -e "${YELLOW}💾 Creating backup: $BACKUP_FILE${NC}"
    PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_FILE
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup created successfully${NC}"
    else
        echo -e "${RED}❌ Backup failed${NC}"
        exit 1
    fi
fi

# Confirm before running seeder
echo -e "${YELLOW}⚠️  WARNING: This will clear existing data and insert new test data${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}ℹ️  Seeder cancelled by user${NC}"
    exit 0
fi

# Run the comprehensive seeder
echo -e "${YELLOW}🌱 Running comprehensive seeder...${NC}"
echo "This may take a few minutes..."

if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f comprehensive_seeder.sql; then
    echo -e "${GREEN}✅ Comprehensive seeder completed successfully!${NC}"
else
    echo -e "${RED}❌ Seeder failed${NC}"
    exit 1
fi

# Verify the data
echo -e "${YELLOW}🔍 Verifying seeded data...${NC}"
echo ""

# Show table counts
echo -e "${BLUE}📊 Table Record Counts:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'buyers', COUNT(*) FROM buyers
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'inventory', COUNT(*) FROM inventory
UNION ALL
SELECT 'shopping_lists', COUNT(*) FROM shopping_lists
UNION ALL
SELECT 'shopping_list_items', COUNT(*) FROM shopping_list_items
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'payment_methods', COUNT(*) FROM payment_methods
UNION ALL
SELECT 'shipping_methods', COUNT(*) FROM shipping_methods
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
ORDER BY table_name;
"

echo ""
echo -e "${BLUE}👥 Sample Users:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT role, email, first_name, last_name, company_name FROM users ORDER BY role, email;
"

echo ""
echo -e "${BLUE}📦 Sample Products:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT category, name, price, stock_quantity FROM products ORDER BY category, name LIMIT 10;
"

echo ""
echo -e "${BLUE}📋 Sample Orders:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT order_number, status, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT 5;
"

echo ""
echo -e "${GREEN}🎉 Comprehensive seeder completed successfully!${NC}"
echo ""
echo -e "${BLUE}🔐 Test Credentials (Password: Test1234):${NC}"
echo "Admin: admin@cesto.ai"
echo "Supplier: supplier@dairy.com"
echo "Client: demo@stockfiller.com"
echo ""
echo -e "${BLUE}📚 API Documentation: http://localhost:3400/api/docs${NC}"
echo -e "${BLUE}🌐 Backend URL: http://localhost:3400/api/v1${NC}"
echo ""
echo -e "${YELLOW}💡 You can now test the API with the seeded data!${NC}"

