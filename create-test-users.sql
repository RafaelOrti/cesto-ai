-- Create test users for each role level
-- This script creates users with different roles to test authentication

-- Clear existing test users (optional)
DELETE FROM users WHERE email LIKE '%@cesto.com';

-- Insert test users
INSERT INTO users (id, email, "passwordHash", role, "firstName", "lastName", "companyName", phone, address, city, country, "postalCode", "isActive", "emailVerified", "createdAt", "updatedAt") VALUES
-- Admin user
('11111111-1111-1111-1111-111111111111', 'admin@cesto.com', '$2b$10$rQZ8K9vL2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9u', 'admin', 'Admin', 'User', 'Cesto Admin', '+1234567890', '123 Admin St', 'Admin City', 'Admin Country', '12345', true, true, NOW(), NOW()),

-- Client user
('22222222-2222-2222-2222-222222222222', 'client@cesto.com', '$2b$10$rQZ8K9vL2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9u', 'client', 'Client', 'User', 'Client Company', '+1234567891', '456 Client Ave', 'Client City', 'Client Country', '23456', true, true, NOW(), NOW()),

-- Buyer user
('33333333-3333-3333-3333-333333333333', 'buyer@cesto.com', '$2b$10$rQZ8K9vL2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9u', 'buyer', 'Buyer', 'User', 'Buyer Company', '+1234567892', '789 Buyer Blvd', 'Buyer City', 'Buyer Country', '34567', true, true, NOW(), NOW()),

-- Supplier user
('44444444-4444-4444-4444-444444444444', 'supplier@cesto.com', '$2b$10$rQZ8K9vL2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9u', 'supplier', 'Supplier', 'User', 'Supplier Company', '+1234567893', '321 Supplier St', 'Supplier City', 'Supplier Country', '45678', true, true, NOW(), NOW());

-- Create related entities for each user
-- Client entity
INSERT INTO clients (id, "userId", "businessName", "businessType", "createdAt", "updatedAt") VALUES
('cl111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Client Company', 'Restaurant', NOW(), NOW());

-- Buyer entity
INSERT INTO buyers (id, "userId", "businessName", "businessType", categories, "createdAt", "updatedAt") VALUES
('by111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Buyer Company', 'Restaurant', '["food", "beverages"]', NOW(), NOW());

-- Supplier entity
INSERT INTO suppliers (id, "userId", "companyName", description, categories, "createdAt", "updatedAt") VALUES
('sp111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Supplier Company', 'Food supplier', '["food", "beverages"]', NOW(), NOW());

-- Note: Password hash is for 'Test123!' - change as needed

