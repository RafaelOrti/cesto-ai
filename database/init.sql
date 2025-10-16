-- Cesto AI Database Schema
-- Food & Beverage B2B Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'admin');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'disputed');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

-- Product categories enum
CREATE TYPE product_category AS ENUM (
    'meat', 'dairy', 'produce', 'frozen', 'ready_meals', 
    'fruit_vegetables', 'ice_cream', 'sweets', 'cupboard', 
    'alcohol', 'tobacco', 'beverages', 'bakery', 'seafood'
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(500),
    categories product_category[] DEFAULT '{}',
    delivery_terms TEXT,
    payment_terms TEXT,
    minimum_order_amount DECIMAL(10,2),
    delivery_areas TEXT[],
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buyers table
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    description TEXT,
    categories product_category[] DEFAULT '{}',
    preferred_suppliers UUID[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (Enhanced for E-commerce)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category product_category NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    unit VARCHAR(50) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    ean_code VARCHAR(50),
    image_url VARCHAR(500),
    image_urls TEXT[] DEFAULT '{}',
    weight DECIMAL(8,3),
    dimensions VARCHAR(100), -- e.g., "10x15x20 cm"
    min_order_quantity INTEGER DEFAULT 1,
    max_order_quantity INTEGER,
    stock_quantity INTEGER DEFAULT 0,
    lead_time_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false,
    sale_start_date TIMESTAMP,
    sale_end_date TIMESTAMP,
    tags TEXT[] DEFAULT '{}',
    specifications JSONB,
    nutritional_info JSONB,
    allergens TEXT[] DEFAULT '{}',
    origin_country VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    warranty_period INTEGER, -- in months
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign products junction table
CREATE TABLE campaign_products (
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (campaign_id, product_id)
);

-- Shopping lists table
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping list items table
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_date TIMESTAMP,
    delivery_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_stock_threshold INTEGER DEFAULT 10,
    max_stock_threshold INTEGER,
    reorder_point INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table for chat functionality
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX idx_buyers_user_id ON buyers(user_id);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_inventory_buyer_id ON inventory(buyer_id);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buyers_updated_at BEFORE UPDATE ON buyers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data with real password hashes
-- Password for ALL users: Test1234

INSERT INTO users (email, password_hash, role, first_name, last_name, company_name, phone, address, city, country, postal_code) VALUES
('admin@cesto.ai', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'admin', 'Admin', 'User', 'Cesto AI', '+1-555-0100', '123 Tech Street', 'San Francisco', 'USA', '94105'),
('demo@stockfiller.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'buyer', 'Demo', 'User', 'Demo Restaurant', '+1-555-0101', '456 Restaurant Ave', 'New York', 'USA', '10001'),
('buyer@restaurant.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'buyer', 'John', 'Doe', 'Bella Vista Restaurant', '+1-555-0102', '789 Main Street', 'Los Angeles', 'USA', '90210'),
('supplier@dairy.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'Jane', 'Smith', 'Fresh Dairy Co', '+1-555-0103', '321 Farm Road', 'Wisconsin', 'USA', '53703'),
('supplier@meat.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'Mike', 'Johnson', 'Premium Meats Ltd', '+1-555-0104', '654 Butcher Lane', 'Texas', 'USA', '75001');

-- Insert sample suppliers
INSERT INTO suppliers (user_id, company_name, description, categories, delivery_terms, payment_terms, minimum_order_amount, delivery_areas, is_verified) 
SELECT id, 'Fresh Dairy Co', 'Premium dairy products from happy cows. Organic milk, cheese, and yogurt.', ARRAY['dairy']::product_category[], 'Next day delivery within 50 miles', 'Net 30 days', 150.00, ARRAY['Los Angeles', 'Orange County', 'San Diego'], true
FROM users WHERE email = 'supplier@dairy.com';

INSERT INTO suppliers (user_id, company_name, description, categories, delivery_terms, payment_terms, minimum_order_amount, delivery_areas, is_verified)
SELECT id, 'Premium Meats Ltd', 'High-quality meats from local farms. Beef, pork, and poultry available.', ARRAY['meat']::product_category[], 'Same day delivery for orders before 2 PM', 'Cash on delivery or Net 15', 200.00, ARRAY['Texas', 'Louisiana', 'Oklahoma'], true
FROM users WHERE email = 'supplier@meat.com';

-- Insert sample buyers
INSERT INTO buyers (user_id, business_name, business_type, description, categories)
SELECT id, 'Demo Restaurant', 'Full Service Restaurant', 'Fine dining restaurant specializing in contemporary cuisine', ARRAY['dairy', 'meat', 'produce']::product_category[]
FROM users WHERE email = 'demo@stockfiller.com';

INSERT INTO buyers (user_id, business_name, business_type, description, categories)
SELECT id, 'Bella Vista Restaurant', 'Fine Dining', 'Upscale restaurant featuring Mediterranean cuisine', ARRAY['dairy', 'meat', 'produce', 'beverages']::product_category[]
FROM users WHERE email = 'buyer@restaurant.com';

-- Insert sample products
INSERT INTO products (supplier_id, name, description, category, price, unit, sku, ean_code, min_order_quantity, lead_time_days, is_active)
SELECT s.id, 'Organic Whole Milk', 'Fresh organic whole milk from grass-fed cows', 'dairy', 4.99, 'gallon', 'DARY-001', '1234567890123', 1, 1, true
FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'supplier@dairy.com';

INSERT INTO products (supplier_id, name, description, category, price, unit, sku, ean_code, min_order_quantity, lead_time_days, is_active)
SELECT s.id, 'Aged Cheddar Cheese', '12-month aged cheddar cheese, perfect for cooking', 'dairy', 12.99, 'pound', 'DARY-002', '1234567890124', 2, 2, true
FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'supplier@dairy.com';

INSERT INTO products (supplier_id, name, description, category, price, unit, sku, ean_code, min_order_quantity, lead_time_days, is_active)
SELECT s.id, 'Premium Ground Beef', '80/20 ground beef from grass-fed cattle', 'meat', 8.99, 'pound', 'MEAT-001', '1234567890125', 5, 1, true
FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'supplier@meat.com';

INSERT INTO products (supplier_id, name, description, category, price, unit, sku, ean_code, min_order_quantity, lead_time_days, is_active)
SELECT s.id, 'Chicken Breast', 'Boneless skinless chicken breast', 'meat', 6.99, 'pound', 'MEAT-002', '1234567890126', 3, 1, true
FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'supplier@meat.com';

-- Insert sample campaigns
INSERT INTO campaigns (supplier_id, name, description, discount_percentage, start_date, end_date, is_active)
SELECT s.id, 'Dairy Summer Sale', 'Special discount on all dairy products for the summer season', 15.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', true
FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'supplier@dairy.com';

-- Insert sample shopping lists
INSERT INTO shopping_lists (buyer_id, name, description, is_active)
SELECT b.id, 'Weekly Essentials', 'Regular weekly shopping list for restaurant supplies', true
FROM buyers b JOIN users u ON b.user_id = u.id WHERE u.email = 'demo@stockfiller.com';

-- Insert sample shopping list items
INSERT INTO shopping_list_items (shopping_list_id, product_id, quantity, notes)
SELECT sl.id, p.id, 10, 'For daily breakfast service'
FROM shopping_lists sl 
JOIN buyers b ON sl.buyer_id = b.id 
JOIN users u ON b.user_id = u.id 
JOIN products p ON p.sku = 'DARY-001'
WHERE u.email = 'demo@stockfiller.com';

-- Insert sample orders
INSERT INTO orders (buyer_id, supplier_id, order_number, status, total_amount, delivery_date, delivery_address, notes)
SELECT b.id, s.id, 'ORD-2024-001', 'confirmed', 149.85, CURRENT_TIMESTAMP + INTERVAL '2 days', '456 Restaurant Ave, New York, NY 10001', 'Please deliver before 8 AM'
FROM buyers b 
JOIN users ub ON b.user_id = ub.id 
JOIN suppliers s ON 1=1
JOIN users us ON s.user_id = us.id 
WHERE ub.email = 'demo@stockfiller.com' AND us.email = 'supplier@dairy.com';

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT o.id, p.id, 15, 4.99, 74.85
FROM orders o 
JOIN buyers b ON o.buyer_id = b.id 
JOIN users u ON b.user_id = u.id 
JOIN products p ON p.sku = 'DARY-001'
WHERE o.order_number = 'ORD-2024-001' AND u.email = 'demo@stockfiller.com';

INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT o.id, p.id, 5, 12.99, 64.95
FROM orders o 
JOIN buyers b ON o.buyer_id = b.id 
JOIN users u ON b.user_id = u.id 
JOIN products p ON p.sku = 'DARY-002'
WHERE o.order_number = 'ORD-2024-001' AND u.email = 'demo@stockfiller.com';

-- Insert sample inventory
INSERT INTO inventory (buyer_id, product_id, current_stock, min_stock_threshold, max_stock_threshold, reorder_point)
SELECT b.id, p.id, 25, 10, 50, 15
FROM buyers b 
JOIN users u ON b.user_id = u.id 
JOIN products p ON p.sku = 'DARY-001'
WHERE u.email = 'demo@stockfiller.com';

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, order_id, content, is_read)
SELECT 
    (SELECT id FROM users WHERE email = 'demo@stockfiller.com'),
    (SELECT id FROM users WHERE email = 'supplier@dairy.com'),
    (SELECT id FROM orders WHERE order_number = 'ORD-2024-001'),
    'Hi, can we confirm the delivery time for tomorrow?',
    false;

-- Shopping Cart table for E-commerce
CREATE TABLE shopping_cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, product_id)
);

-- Product Reviews table
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist table
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, product_id)
);

-- Product Categories table (for better categorization)
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_swedish VARCHAR(100),
    name_spanish VARCHAR(100),
    name_english VARCHAR(100),
    description TEXT,
    icon VARCHAR(100),
    parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Subcategories junction table
CREATE TABLE product_subcategories (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Payment Methods table
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'credit_card', 'bank_transfer', 'paypal', etc.
    is_active BOOLEAN DEFAULT true,
    processing_fee_percentage DECIMAL(5,2) DEFAULT 0.00,
    processing_fee_fixed DECIMAL(10,2) DEFAULT 0.00,
    configuration JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Methods table
CREATE TABLE shipping_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2) NOT NULL,
    free_shipping_threshold DECIMAL(10,2),
    estimated_days_min INTEGER,
    estimated_days_max INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons/Discount Codes table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2),
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    applicable_products UUID[] DEFAULT '{}',
    applicable_categories UUID[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT id, 'New Order Confirmed', 'Your order ORD-2024-001 has been confirmed and is being prepared', 'order_update', false
FROM users WHERE email = 'demo@stockfiller.com';

INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT id, 'Inventory Low Alert', 'Your milk inventory is running low (25 units remaining)', 'inventory_alert', false
FROM users WHERE email = 'demo@stockfiller.com';

-- Insert sample product categories
INSERT INTO product_categories (name, name_swedish, name_spanish, name_english, description, icon) VALUES
('Meat & Poultry', 'Kött & Fjäderfä', 'Carnes y Aves', 'Meat & Poultry', 'Fresh meat and poultry products', 'restaurant'),
('Dairy & Eggs', 'Mejeri & Ägg', 'Lácteos y Huevos', 'Dairy & Eggs', 'Milk, cheese, yogurt, and eggs', 'local_drink'),
('Fruits & Vegetables', 'Frukt & Grönsaker', 'Frutas y Verduras', 'Fruits & Vegetables', 'Fresh fruits and vegetables', 'eco'),
('Bakery & Pastry', 'Bageri & Konditori', 'Panadería y Pastelería', 'Bakery & Pastry', 'Bread, pastries, and baked goods', 'bakery_dining'),
('Beverages', 'Drycker', 'Bebidas', 'Beverages', 'Drinks and beverages', 'local_bar'),
('Frozen Foods', 'Frysta Livsmedel', 'Alimentos Congelados', 'Frozen Foods', 'Frozen food products', 'ac_unit'),
('Pantry Staples', 'Skafferi', 'Despensa', 'Pantry Staples', 'Basic pantry items', 'kitchen'),
('Seafood', 'Fisk & Skaldjur', 'Mariscos', 'Seafood', 'Fresh and frozen seafood', 'set_meal'),
('Snacks & Sweets', 'Snacks & Godis', 'Snacks y Dulces', 'Snacks & Sweets', 'Snacks, candies, and sweets', 'cookie'),
('Organic & Health', 'Ekologisk & Hälsa', 'Orgánico y Salud', 'Organic & Health', 'Organic and health food products', 'health_and_safety');

-- Insert sample payment methods
INSERT INTO payment_methods (name, type, is_active, processing_fee_percentage) VALUES
('Credit Card', 'credit_card', true, 2.9),
('Bank Transfer', 'bank_transfer', true, 0.0),
('PayPal', 'paypal', true, 3.4),
('Invoice', 'invoice', true, 0.0),
('Cash on Delivery', 'cod', true, 0.0);

-- Insert sample shipping methods
INSERT INTO shipping_methods (supplier_id, name, description, cost, free_shipping_threshold, estimated_days_min, estimated_days_max)
SELECT s.id, 'Standard Delivery', 'Standard delivery within business area', 15.00, 200.00, 1, 3
FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'supplier@dairy.com';

INSERT INTO shipping_methods (supplier_id, name, description, cost, free_shipping_threshold, estimated_days_min, estimated_days_max)
SELECT s.id, 'Express Delivery', 'Next day delivery', 25.00, 500.00, 1, 1
FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'supplier@dairy.com';

-- Insert sample coupons
INSERT INTO coupons (code, name, description, type, value, minimum_order_amount, usage_limit, start_date, end_date) VALUES
('WELCOME10', 'Welcome Discount', '10% off for new customers', 'percentage', 10.00, 100.00, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year'),
('SAVE50', 'Save 50 EUR', '50 EUR off orders over 500 EUR', 'fixed_amount', 50.00, 500.00, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '6 months'),
('SUMMER15', 'Summer Sale', '15% off summer products', 'percentage', 15.00, 150.00, 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 months');
