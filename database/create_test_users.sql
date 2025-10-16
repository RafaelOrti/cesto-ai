-- =====================================================
-- Cesto AI - Test Users Creation Script
-- =====================================================
-- This script creates all test users organized by role type
-- Run this script after initial database setup

-- =====================================================
-- ADMIN USERS
-- =====================================================
-- Full system access and configuration

INSERT INTO users (id, email, password, role, first_name, last_name, company_name, phone, is_active, created_at, updated_at) VALUES
('admin-001', 'admin@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin', 'System', 'Administrator', 'Cesto AI', '+46 123 456 789', true, NOW(), NOW()),
('admin-002', 'admin@cesto.ai', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin', 'Admin', 'User', 'Cesto AI', '+46 123 456 790', true, NOW(), NOW()),
('admin-003', 'superadmin@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin', 'Super', 'Admin', 'Cesto AI', '+46 123 456 791', true, NOW(), NOW()),
('admin-004', 'admin@stockfiller.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'admin', 'Stockfiller', 'Admin', 'Stockfiller', '+46 123 456 792', true, NOW(), NOW());

-- =====================================================
-- SUPPLIER USERS
-- =====================================================
-- Suppliers who can manage products, campaigns, and orders

INSERT INTO users (id, email, password, role, first_name, last_name, company_name, phone, is_active, created_at, updated_at) VALUES
-- General Suppliers
('supplier-001', 'supplier@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'General', 'Supplier', 'General Food Supply', '+46 123 456 800', true, NOW(), NOW()),

-- Dairy Suppliers
('supplier-002', 'supplier@dairy.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Dairy', 'Supplier', 'Nordic Dairy Co.', '+46 123 456 801', true, NOW(), NOW()),

-- Meat Suppliers
('supplier-003', 'supplier@meat.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Meat', 'Supplier', 'Premium Meat Supply', '+46 123 456 802', true, NOW(), NOW()),

-- Vegetable Suppliers
('supplier-004', 'supplier@vegetables.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Vegetable', 'Supplier', 'Fresh Vegetables AB', '+46 123 456 803', true, NOW(), NOW()),

-- Beverage Suppliers
('supplier-005', 'supplier@beverages.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Beverage', 'Supplier', 'Swedish Beverages Ltd.', '+46 123 456 804', true, NOW(), NOW()),

-- Bakery Suppliers
('supplier-006', 'supplier@bakery.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Bakery', 'Supplier', 'Artisan Bakery Co.', '+46 123 456 805', true, NOW(), NOW()),

-- Seafood Suppliers
('supplier-007', 'supplier@seafood.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Seafood', 'Supplier', 'Nordic Seafood AB', '+46 123 456 806', true, NOW(), NOW()),

-- Frozen Food Suppliers
('supplier-008', 'supplier@frozen.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Frozen', 'Supplier', 'Frozen Foods Sweden', '+46 123 456 807', true, NOW(), NOW()),

-- Organic Suppliers
('supplier-009', 'supplier@organic.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Organic', 'Supplier', 'Organic Farms Sweden', '+46 123 456 808', true, NOW(), NOW()),

-- Wholesale Suppliers
('supplier-010', 'supplier@wholesale.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'supplier', 'Wholesale', 'Supplier', 'Wholesale Food Group', '+46 123 456 809', true, NOW(), NOW());

-- =====================================================
-- CLIENT/BUYER USERS
-- =====================================================
-- Clients who can browse products, place orders, and manage their business

-- Restaurants & Food Service
INSERT INTO users (id, email, password, role, first_name, last_name, company_name, phone, is_active, created_at, updated_at) VALUES
('client-001', 'client@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Restaurant', 'Owner', 'Main Street Restaurant', '+46 123 456 900', true, NOW(), NOW()),
('client-002', 'buyer@restaurant.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Restaurant', 'Buyer', 'Fine Dining Restaurant', '+46 123 456 901', true, NOW(), NOW()),
('client-003', 'cliente@restaurante.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Restaurante', 'Español', 'Restaurante Español', '+46 123 456 902', true, NOW(), NOW()),
('client-004', 'restaurant@bistro.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Bistro', 'Manager', 'Urban Bistro', '+46 123 456 903', true, NOW(), NOW()),
('client-005', 'cafe@urban.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Cafe', 'Owner', 'Urban Cafe Chain', '+46 123 456 904', true, NOW(), NOW()),
('client-006', 'hotel@kitchen.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Hotel', 'Chef', 'Grand Hotel Stockholm', '+46 123 456 905', true, NOW(), NOW()),

-- Retail & Supermarkets
('client-007', 'client2@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Retail', 'Manager', 'City Supermarket', '+46 123 456 906', true, NOW(), NOW()),
('client-008', 'buyer@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Buyer', 'Manager', 'Retail Chain', '+46 123 456 907', true, NOW(), NOW()),
('client-009', 'supermarket@chain.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Supermarket', 'Chain', 'Nordic Supermarket Chain', '+46 123 456 908', true, NOW(), NOW()),
('client-010', 'grocery@store.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Grocery', 'Store', 'Local Grocery Store', '+46 123 456 909', true, NOW(), NOW()),
('client-011', 'retail@food.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Food', 'Retail', 'Food Retail Group', '+46 123 456 910', true, NOW(), NOW()),
('client-012', 'market@fresh.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Fresh', 'Market', 'Fresh Market Chain', '+46 123 456 911', true, NOW(), NOW()),

-- Corporate & Catering
('client-013', 'catering@corporate.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Corporate', 'Catering', 'Corporate Catering Services', '+46 123 456 912', true, NOW(), NOW()),
('client-014', 'events@catering.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Event', 'Catering', 'Event Catering Company', '+46 123 456 913', true, NOW(), NOW()),
('client-015', 'corporate@cafe.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Corporate', 'Cafe', 'Corporate Cafe Services', '+46 123 456 914', true, NOW(), NOW()),
('client-016', 'office@catering.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Office', 'Catering', 'Office Catering Solutions', '+46 123 456 915', true, NOW(), NOW()),

-- Demo & Test Users
('client-017', 'demo@stockfiller.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Demo', 'User', 'Stockfiller Demo', '+46 123 456 916', true, NOW(), NOW()),
('client-018', 'test@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Test', 'User', 'Test Company', '+46 123 456 917', true, NOW(), NOW()),
('client-019', 'guest@cesto.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Guest', 'User', 'Guest Account', '+46 123 456 918', true, NOW(), NOW()),
('client-020', 'demo@client.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'client', 'Demo', 'Client', 'Demo Client Account', '+46 123 456 919', true, NOW(), NOW());

-- =====================================================
-- UPDATE SEQUENCES
-- =====================================================
-- Update sequences to avoid conflicts with future inserts

SELECT setval('users_id_seq', (SELECT MAX(CAST(SUBSTRING(id FROM '[0-9]+') AS INTEGER)) FROM users WHERE id ~ '^[a-z]+-[0-9]+$'));

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify user creation

-- Count users by role
SELECT 
    role,
    COUNT(*) as user_count
FROM users 
WHERE email LIKE '%@cesto.com' 
   OR email LIKE '%@cesto.ai' 
   OR email LIKE '%@stockfiller.com'
   OR email LIKE '%@dairy.com'
   OR email LIKE '%@meat.com'
   OR email LIKE '%@vegetables.com'
   OR email LIKE '%@beverages.com'
   OR email LIKE '%@bakery.com'
   OR email LIKE '%@seafood.com'
   OR email LIKE '%@frozen.com'
   OR email LIKE '%@organic.com'
   OR email LIKE '%@wholesale.com'
   OR email LIKE '%@restaurant.com'
   OR email LIKE '%@bistro.com'
   OR email LIKE '%@urban.com'
   OR email LIKE '%@kitchen.com'
   OR email LIKE '%@chain.com'
   OR email LIKE '%@store.com'
   OR email LIKE '%@food.com'
   OR email LIKE '%@fresh.com'
   OR email LIKE '%@corporate.com'
   OR email LIKE '%@catering.com'
   OR email LIKE '%@cafe.com'
   OR email LIKE '%@office.com'
   OR email LIKE '%@test.com'
   OR email LIKE '%@guest.com'
GROUP BY role
ORDER BY role;

-- Show all admin users
SELECT id, email, role, first_name, last_name, company_name, is_active
FROM users 
WHERE role = 'admin'
ORDER BY email;

-- Show all supplier users
SELECT id, email, role, first_name, last_name, company_name, is_active
FROM users 
WHERE role = 'supplier'
ORDER BY email;

-- Show all client users
SELECT id, email, role, first_name, last_name, company_name, is_active
FROM users 
WHERE role = 'client'
ORDER BY email;
