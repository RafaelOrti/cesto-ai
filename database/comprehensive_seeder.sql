-- =====================================================
-- CESTO AI - Comprehensive Database Seeder
-- =====================================================
-- This script creates comprehensive test data for all tables
-- Password for ALL users: Test1234 (hash: $2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK)

-- Clear existing data (be careful in production!)
TRUNCATE TABLE 
    notifications, messages, inventory_alerts, inventory_movements, 
    inventory, order_items, orders, shopping_list_items, shopping_lists,
    shopping_cart, product_reviews, wishlist, product_subcategories,
    campaign_products, campaigns, products, shipping_methods,
    buyers, suppliers, users, product_categories, payment_methods,
    coupons, admin_analytics, admin_audit_logs, color_themes, 
    system_configs, clients
CASCADE;

-- =====================================================
-- USERS (All roles with comprehensive data)
-- =====================================================

INSERT INTO users (id, email, password_hash, role, first_name, last_name, company_name, phone, address, city, country, postal_code, is_active, email_verified, created_at, updated_at) VALUES
-- ADMIN USERS
('admin-001', 'admin@cesto.ai', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'admin', 'Admin', 'User', 'Cesto AI', '+1-555-0100', '123 Tech Street', 'San Francisco', 'USA', '94105', true, true, NOW(), NOW()),
('admin-002', 'superadmin@cesto.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'admin', 'Super', 'Admin', 'Cesto AI', '+1-555-0101', '456 Admin Ave', 'San Francisco', 'USA', '94105', true, true, NOW(), NOW()),

-- SUPPLIER USERS (Diverse categories)
('supplier-001', 'supplier@dairy.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'Jane', 'Smith', 'Fresh Dairy Co', '+1-555-0200', '321 Farm Road', 'Wisconsin', 'USA', '53703', true, true, NOW(), NOW()),
('supplier-002', 'supplier@meat.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'Mike', 'Johnson', 'Premium Meats Ltd', '+1-555-0201', '654 Butcher Lane', 'Texas', 'USA', '75001', true, true, NOW(), NOW()),
('supplier-003', 'supplier@vegetables.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'Maria', 'Garcia', 'Green Valley Produce', '+1-555-0202', '789 Farm Road', 'California', 'USA', '90210', true, true, NOW(), NOW()),
('supplier-004', 'supplier@bakery.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'Robert', 'Baker', 'Artisan Bakery Co', '+1-555-0203', '456 Bread Street', 'Oregon', 'USA', '97201', true, true, NOW(), NOW()),
('supplier-005', 'supplier@seafood.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'Anna', 'Fisher', 'Ocean Fresh Seafood', '+1-555-0204', '321 Harbor Way', 'Alaska', 'USA', '99501', true, true, NOW(), NOW()),
('supplier-006', 'supplier@beverages.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'supplier', 'David', 'Brewer', 'Mountain Spring Beverages', '+1-555-0205', '789 Spring Road', 'Colorado', 'USA', '80201', true, true, NOW(), NOW()),

-- CLIENT/BUYER USERS (Various business types)
('client-001', 'demo@stockfiller.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'client', 'Demo', 'User', 'Demo Restaurant', '+1-555-0300', '456 Restaurant Ave', 'New York', 'USA', '10001', true, true, NOW(), NOW()),
('client-002', 'buyer@restaurant.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'client', 'John', 'Doe', 'Bella Vista Restaurant', '+1-555-0301', '789 Main Street', 'Los Angeles', 'USA', '90210', true, true, NOW(), NOW()),
('client-003', 'buyer@cafe.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'client', 'Sarah', 'Wilson', 'Urban Cafe Chain', '+1-555-0302', '123 Coffee Street', 'Seattle', 'USA', '98101', true, true, NOW(), NOW()),
('client-004', 'buyer@hotel.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'client', 'Michael', 'Brown', 'Grand Hotel Chain', '+1-555-0303', '456 Hotel Boulevard', 'Las Vegas', 'USA', '89101', true, true, NOW(), NOW()),
('client-005', 'buyer@supermarket.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'client', 'Lisa', 'Davis', 'City Supermarket', '+1-555-0304', '789 Market Street', 'Chicago', 'USA', '60601', true, true, NOW(), NOW()),
('client-006', 'buyer@catering.com', '$2b$12$D0gvCoalJ.KrgMwjdHch2e8yENsKaTvUvUWNgTlrZ5rU6mitrRgKK', 'client', 'James', 'Miller', 'Corporate Catering Services', '+1-555-0305', '321 Business Ave', 'Miami', 'USA', '33101', true, true, NOW(), NOW());

-- =====================================================
-- SUPPLIERS
-- =====================================================

INSERT INTO suppliers (id, user_id, company_name, description, website, logo_url, categories, delivery_terms, payment_terms, minimum_order_amount, delivery_areas, is_verified, is_active, created_at, updated_at) VALUES
('supplier-profile-001', 'supplier-001', 'Fresh Dairy Co', 'Premium dairy products from happy cows. Organic milk, cheese, and yogurt.', 'https://freshdairy.com', 'https://example.com/logos/dairy.png', ARRAY['dairy']::product_category[], 'Next day delivery within 50 miles', 'Net 30 days', 150.00, ARRAY['Los Angeles', 'Orange County', 'San Diego'], true, true, NOW(), NOW()),
('supplier-profile-002', 'supplier-002', 'Premium Meats Ltd', 'High-quality meats from local farms. Beef, pork, and poultry available.', 'https://premiummeats.com', 'https://example.com/logos/meat.png', ARRAY['meat']::product_category[], 'Same day delivery for orders before 2 PM', 'Cash on delivery or Net 15', 200.00, ARRAY['Texas', 'Louisiana', 'Oklahoma'], true, true, NOW(), NOW()),
('supplier-profile-003', 'supplier-003', 'Green Valley Produce', 'Fresh organic vegetables and fruits from local farms.', 'https://greenvalley.com', 'https://example.com/logos/produce.png', ARRAY['produce', 'fruit_vegetables']::product_category[], 'Twice weekly delivery', 'Net 14 days', 100.00, ARRAY['California', 'Nevada'], true, true, NOW(), NOW()),
('supplier-profile-004', 'supplier-004', 'Artisan Bakery Co', 'Handcrafted breads, pastries, and baked goods.', 'https://artisanbakery.com', 'https://example.com/logos/bakery.png', ARRAY['bakery']::product_category[], 'Daily delivery available', 'Cash on delivery', 75.00, ARRAY['Oregon', 'Washington'], true, true, NOW(), NOW()),
('supplier-profile-005', 'supplier-005', 'Ocean Fresh Seafood', 'Fresh and frozen seafood from sustainable sources.', 'https://oceanfresh.com', 'https://example.com/logos/seafood.png', ARRAY['seafood']::product_category[], 'Express shipping nationwide', 'Net 21 days', 300.00, ARRAY['Alaska', 'California', 'Washington'], true, true, NOW(), NOW()),
('supplier-profile-006', 'supplier-006', 'Mountain Spring Beverages', 'Premium beverages including juices, sodas, and specialty drinks.', 'https://mountainspring.com', 'https://example.com/logos/beverages.png', ARRAY['beverages']::product_category[], 'Weekly delivery', 'Net 30 days', 125.00, ARRAY['Colorado', 'Utah', 'Wyoming'], true, true, NOW(), NOW());

-- =====================================================
-- BUYERS
-- =====================================================

INSERT INTO buyers (id, user_id, business_name, business_type, description, categories, preferred_suppliers, created_at, updated_at) VALUES
('buyer-profile-001', 'client-001', 'Demo Restaurant', 'Full Service Restaurant', 'Fine dining restaurant specializing in contemporary cuisine', ARRAY['dairy', 'meat', 'produce', 'beverages']::product_category[], ARRAY['supplier-profile-001', 'supplier-profile-002']::uuid[], NOW(), NOW()),
('buyer-profile-002', 'client-002', 'Bella Vista Restaurant', 'Fine Dining', 'Upscale restaurant featuring Mediterranean cuisine', ARRAY['dairy', 'meat', 'produce', 'beverages', 'seafood']::product_category[], ARRAY['supplier-profile-001', 'supplier-profile-002', 'supplier-profile-005']::uuid[], NOW(), NOW()),
('buyer-profile-003', 'client-003', 'Urban Cafe Chain', 'Cafe', 'Modern cafe chain with multiple locations', ARRAY['bakery', 'beverages', 'dairy']::product_category[], ARRAY['supplier-profile-004', 'supplier-profile-006']::uuid[], NOW(), NOW()),
('buyer-profile-004', 'client-004', 'Grand Hotel Chain', 'Hotel', 'Luxury hotel chain with full-service restaurants', ARRAY['dairy', 'meat', 'produce', 'beverages', 'seafood', 'bakery']::product_category[], ARRAY['supplier-profile-001', 'supplier-profile-002', 'supplier-profile-005']::uuid[], NOW(), NOW()),
('buyer-profile-005', 'client-005', 'City Supermarket', 'Supermarket', 'Large supermarket chain serving local communities', ARRAY['dairy', 'meat', 'produce', 'beverages', 'bakery', 'seafood']::product_category[], ARRAY['supplier-profile-001', 'supplier-profile-002', 'supplier-profile-003', 'supplier-profile-004', 'supplier-profile-006']::uuid[], NOW(), NOW()),
('buyer-profile-006', 'client-006', 'Corporate Catering Services', 'Catering', 'Full-service catering for corporate events', ARRAY['dairy', 'meat', 'produce', 'beverages', 'bakery']::product_category[], ARRAY['supplier-profile-001', 'supplier-profile-002', 'supplier-profile-004']::uuid[], NOW(), NOW());

-- =====================================================
-- CLIENTS (Additional client profiles)
-- =====================================================

INSERT INTO clients (id, user_id, business_name, business_type, description, is_active, created_at, updated_at) VALUES
('client-profile-001', 'client-001', 'Demo Restaurant', 'restaurant', 'Fine dining restaurant specializing in contemporary cuisine', true, NOW(), NOW()),
('client-profile-002', 'client-002', 'Bella Vista Restaurant', 'restaurant', 'Upscale restaurant featuring Mediterranean cuisine', true, NOW(), NOW()),
('client-profile-003', 'client-003', 'Urban Cafe Chain', 'cafe', 'Modern cafe chain with multiple locations', true, NOW(), NOW()),
('client-profile-004', 'client-004', 'Grand Hotel Chain', 'hotel', 'Luxury hotel chain with full-service restaurants', true, NOW(), NOW()),
('client-profile-005', 'client-005', 'City Supermarket', 'supermarket', 'Large supermarket chain serving local communities', true, NOW(), NOW()),
('client-profile-006', 'client-006', 'Corporate Catering Services', 'catering', 'Full-service catering for corporate events', true, NOW(), NOW());

-- =====================================================
-- PRODUCT CATEGORIES
-- =====================================================

INSERT INTO product_categories (id, name, name_swedish, name_spanish, name_english, description, icon, parent_id, is_active, sort_order, created_at, updated_at) VALUES
('cat-001', 'Meat & Poultry', 'Kött & Fjäderfä', 'Carnes y Aves', 'Meat & Poultry', 'Fresh meat and poultry products', 'restaurant', NULL, true, 1, NOW(), NOW()),
('cat-002', 'Dairy & Eggs', 'Mejeri & Ägg', 'Lácteos y Huevos', 'Dairy & Eggs', 'Milk, cheese, yogurt, and eggs', 'local_drink', NULL, true, 2, NOW(), NOW()),
('cat-003', 'Fruits & Vegetables', 'Frukt & Grönsaker', 'Frutas y Verduras', 'Fruits & Vegetables', 'Fresh fruits and vegetables', 'eco', NULL, true, 3, NOW(), NOW()),
('cat-004', 'Bakery & Pastry', 'Bageri & Konditori', 'Panadería y Pastelería', 'Bakery & Pastry', 'Bread, pastries, and baked goods', 'bakery_dining', NULL, true, 4, NOW(), NOW()),
('cat-005', 'Beverages', 'Drycker', 'Bebidas', 'Beverages', 'Drinks and beverages', 'local_bar', NULL, true, 5, NOW(), NOW()),
('cat-006', 'Frozen Foods', 'Frysta Livsmedel', 'Alimentos Congelados', 'Frozen Foods', 'Frozen food products', 'ac_unit', NULL, true, 6, NOW(), NOW()),
('cat-007', 'Pantry Staples', 'Skafferi', 'Despensa', 'Pantry Staples', 'Basic pantry items', 'kitchen', NULL, true, 7, NOW(), NOW()),
('cat-008', 'Seafood', 'Fisk & Skaldjur', 'Mariscos', 'Seafood', 'Fresh and frozen seafood', 'set_meal', NULL, true, 8, NOW(), NOW()),
('cat-009', 'Snacks & Sweets', 'Snacks & Godis', 'Snacks y Dulces', 'Snacks & Sweets', 'Snacks, candies, and sweets', 'cookie', NULL, true, 9, NOW(), NOW()),
('cat-010', 'Organic & Health', 'Ekologisk & Hälsa', 'Orgánico y Salud', 'Organic & Health', 'Organic and health food products', 'health_and_safety', NULL, true, 10, NOW(), NOW());

-- =====================================================
-- PRODUCTS (Comprehensive product catalog)
-- =====================================================

INSERT INTO products (id, supplier_id, name, description, short_description, category, subcategory, price, original_price, unit, sku, ean_code, image_url, image_urls, weight, dimensions, min_order_quantity, max_order_quantity, stock_quantity, lead_time_days, is_active, is_featured, is_on_sale, sale_start_date, sale_end_date, tags, specifications, nutritional_info, allergens, origin_country, brand, model, warranty_period, rating, review_count, view_count, sales_count, created_at, updated_at) VALUES

-- DAIRY PRODUCTS
('prod-001', 'supplier-profile-001', 'Organic Whole Milk', 'Fresh organic whole milk from grass-fed cows', 'Premium organic whole milk', 'dairy', 'milk', 4.99, 5.49, 'gallon', 'DARY-001', '1234567890123', 'https://example.com/images/milk.jpg', ARRAY['https://example.com/images/milk-1.jpg', 'https://example.com/images/milk-2.jpg'], 3.78, '15x15x25 cm', 1, 50, 100, 1, true, true, true, NOW(), NOW() + INTERVAL '30 days', ARRAY['organic', 'grass-fed', 'fresh'], '{"fat_content": "3.25%", "pasteurized": true, "homogenized": true}', '{"calories": 150, "protein": "8g", "calcium": "30%"}', ARRAY['milk'], 'USA', 'Organic Valley', 'Whole Milk', NULL, 4.5, 25, 150, 75, NOW(), NOW()),

('prod-002', 'supplier-profile-001', 'Aged Cheddar Cheese', '12-month aged cheddar cheese, perfect for cooking', 'Premium aged cheddar', 'dairy', 'cheese', 12.99, 14.99, 'pound', 'DARY-002', '1234567890124', 'https://example.com/images/cheddar.jpg', ARRAY['https://example.com/images/cheddar-1.jpg'], 0.45, '20x10x8 cm', 2, 20, 50, 2, true, true, false, NULL, NULL, ARRAY['aged', 'sharp', 'natural'], '{"age_months": 12, "rind": "natural", "texture": "firm"}', '{"calories": 400, "protein": "25g", "calcium": "70%"}', ARRAY['milk'], 'USA', 'Wisconsin Pride', 'Aged Cheddar', NULL, 4.8, 18, 120, 45, NOW(), NOW()),

('prod-003', 'supplier-profile-001', 'Greek Yogurt', 'Creamy Greek yogurt with live cultures', 'Protein-rich Greek yogurt', 'dairy', 'yogurt', 6.99, 7.99, '32oz container', 'DARY-003', '1234567890125', 'https://example.com/images/yogurt.jpg', ARRAY['https://example.com/images/yogurt-1.jpg'], 0.91, '15x15x10 cm', 1, 30, 80, 1, true, false, false, NULL, NULL, ARRAY['greek', 'protein', 'cultures'], '{"protein": "20g", "cultures": "5 strains", "fat_free": true}', '{"calories": 100, "protein": "20g", "probiotics": "10 billion"}', ARRAY['milk'], 'Greece', 'Mediterranean', 'Greek Style', NULL, 4.3, 32, 200, 60, NOW(), NOW()),

-- MEAT PRODUCTS
('prod-004', 'supplier-profile-002', 'Premium Ground Beef', '80/20 ground beef from grass-fed cattle', 'High-quality ground beef', 'meat', 'beef', 8.99, 9.99, 'pound', 'MEAT-001', '1234567890126', 'https://example.com/images/ground-beef.jpg', ARRAY['https://example.com/images/ground-beef-1.jpg'], 0.45, '25x15x5 cm', 5, 100, 75, 1, true, true, false, NULL, NULL, ARRAY['grass-fed', 'premium', 'fresh'], '{"fat_ratio": "80/20", "grade": "Choice", "grind": "medium"}', '{"calories": 250, "protein": "25g", "iron": "15%"}', ARRAY['beef'], 'USA', 'Texas Pride', 'Ground Beef', NULL, 4.7, 28, 180, 95, NOW(), NOW()),

('prod-005', 'supplier-profile-002', 'Chicken Breast', 'Boneless skinless chicken breast', 'Fresh chicken breast', 'meat', 'poultry', 6.99, 7.49, 'pound', 'MEAT-002', '1234567890127', 'https://example.com/images/chicken.jpg', ARRAY['https://example.com/images/chicken-1.jpg'], 0.45, '20x15x8 cm', 3, 50, 60, 1, true, true, true, NOW(), NOW() + INTERVAL '14 days', ARRAY['boneless', 'skinless', 'fresh'], '{"grade": "A", "inspection": "USDA", "antibiotic_free": true}', '{"calories": 165, "protein": "31g", "sodium": "74mg"}', ARRAY['chicken'], 'USA', 'Farm Fresh', 'Chicken Breast', NULL, 4.6, 35, 220, 85, NOW(), NOW()),

('prod-006', 'supplier-profile-002', 'Pork Tenderloin', 'Premium pork tenderloin, trimmed', 'Tender pork tenderloin', 'meat', 'pork', 11.99, 13.99, 'pound', 'MEAT-003', '1234567890128', 'https://example.com/images/pork.jpg', ARRAY['https://example.com/images/pork-1.jpg'], 0.45, '30x8x8 cm', 2, 25, 40, 1, true, false, false, NULL, NULL, ARRAY['premium', 'trimmed', 'tender'], '{"grade": "Choice", "trimmed": true, "portion_controlled": true}', '{"calories": 143, "protein": "26g", "zinc": "20%"}', ARRAY['pork'], 'USA', 'Premium Cuts', 'Pork Tenderloin', NULL, 4.4, 22, 140, 55, NOW(), NOW()),

-- VEGETABLE PRODUCTS
('prod-007', 'supplier-profile-003', 'Organic Spinach', 'Fresh organic baby spinach leaves', 'Organic baby spinach', 'produce', 'leafy_greens', 3.99, 4.49, '5oz bag', 'VEG-001', '1234567890129', 'https://example.com/images/spinach.jpg', ARRAY['https://example.com/images/spinach-1.jpg'], 0.14, '25x15x8 cm', 1, 20, 120, 1, true, true, false, NULL, NULL, ARRAY['organic', 'baby', 'fresh'], '{"organic_certified": true, "washed": true, "triple_washed": true}', '{"calories": 20, "iron": "15%", "vitamin_k": "120%"}', ARRAY[]::text[], 'USA', 'Green Valley', 'Baby Spinach', NULL, 4.2, 45, 300, 110, NOW(), NOW()),

('prod-008', 'supplier-profile-003', 'Heirloom Tomatoes', 'Mixed heirloom tomatoes in various colors', 'Colorful heirloom tomatoes', 'produce', 'tomatoes', 5.99, 6.99, '2lb container', 'VEG-002', '1234567890130', 'https://example.com/images/tomatoes.jpg', ARRAY['https://example.com/images/tomatoes-1.jpg'], 0.91, '20x15x10 cm', 1, 15, 90, 1, true, true, false, NULL, NULL, ARRAY['heirloom', 'mixed', 'organic'], '{"varieties": "5 types", "organic_certified": true, "vine_ripened": true}', '{"calories": 25, "vitamin_c": "25%", "lycopene": "high"}', ARRAY[]::text[], 'USA', 'Heritage', 'Heirloom Mix', NULL, 4.8, 38, 280, 125, NOW(), NOW()),

-- BAKERY PRODUCTS
('prod-009', 'supplier-profile-004', 'Sourdough Bread', 'Artisan sourdough bread with crispy crust', 'Handcrafted sourdough', 'bakery', 'bread', 4.99, 5.99, 'loaf', 'BAKE-001', '1234567890131', 'https://example.com/images/sourdough.jpg', ARRAY['https://example.com/images/sourdough-1.jpg'], 0.68, '25x15x12 cm', 1, 10, 45, 1, true, true, false, NULL, NULL, ARRAY['artisan', 'sourdough', 'handcrafted'], '{"fermentation": "24 hours", "starter": "wild yeast", "hand_shaped": true}', '{"calories": 80, "fiber": "2g", "protein": "3g"}', ARRAY['wheat', 'gluten'], 'USA', 'Artisan Co', 'Sourdough', NULL, 4.9, 67, 450, 200, NOW(), NOW()),

('prod-010', 'supplier-profile-004', 'Croissants', 'Buttery flaky croissants, baked fresh daily', 'Fresh baked croissants', 'bakery', 'pastries', 2.99, 3.49, 'each', 'BAKE-002', '1234567890132', 'https://example.com/images/croissants.jpg', ARRAY['https://example.com/images/croissants-1.jpg'], 0.06, '15x8x5 cm', 6, 24, 80, 1, true, true, false, NULL, NULL, ARRAY['buttery', 'flaky', 'fresh'], '{"butter_content": "high", "laminated": true, "daily_baked": true}', '{"calories": 240, "fat": "14g", "carbs": "26g"}', ARRAY['wheat', 'gluten', 'dairy'], 'France', 'French Style', 'Croissants', NULL, 4.7, 52, 380, 180, NOW(), NOW()),

-- BEVERAGE PRODUCTS
('prod-011', 'supplier-profile-006', 'Fresh Orange Juice', 'Freshly squeezed orange juice, no preservatives', 'Fresh squeezed orange juice', 'beverages', 'juice', 5.99, 6.99, '32oz bottle', 'BEV-001', '1234567890133', 'https://example.com/images/orange-juice.jpg', ARRAY['https://example.com/images/orange-juice-1.jpg'], 0.95, '20x8x8 cm', 1, 20, 70, 1, true, true, false, NULL, NULL, ARRAY['fresh', 'squeezed', 'no_preservatives'], '{"pulp": "some pulp", "pasteurized": false, "fresh_squeezed": true}', '{"calories": 110, "vitamin_c": "120%", "potassium": "10%"}', ARRAY[]::text[], 'USA', 'Fresh Squeezed', 'Orange Juice', NULL, 4.5, 41, 250, 95, NOW(), NOW()),

('prod-012', 'supplier-profile-006', 'Sparkling Water', 'Natural sparkling water with no additives', 'Pure sparkling water', 'beverages', 'water', 1.99, 2.49, '12 pack', 'BEV-002', '1234567890134', 'https://example.com/images/sparkling-water.jpg', ARRAY['https://example.com/images/sparkling-water-1.jpg'], 4.54, '30x20x15 cm', 1, 50, 200, 1, true, false, false, NULL, NULL, ARRAY['sparkling', 'natural', 'pure'], '{"carbonation": "natural", "minerals": "natural", "ph": "7.2"}', '{"calories": 0, "sodium": "0mg", "minerals": "natural"}', ARRAY[]::text[], 'USA', 'Mountain Spring', 'Sparkling', NULL, 4.1, 28, 180, 75, NOW(), NOW()),

-- SEAFOOD PRODUCTS
('prod-013', 'supplier-profile-005', 'Atlantic Salmon', 'Fresh Atlantic salmon fillets', 'Premium salmon fillets', 'seafood', 'fish', 16.99, 18.99, 'pound', 'SEA-001', '1234567890135', 'https://example.com/images/salmon.jpg', ARRAY['https://example.com/images/salmon-1.jpg'], 0.45, '25x15x3 cm', 1, 20, 35, 1, true, true, false, NULL, NULL, ARRAY['atlantic', 'fresh', 'sustainable'], '{"origin": "Atlantic", "sustainable": true, "fresh": true}', '{"calories": 208, "protein": "25g", "omega3": "1.8g"}', ARRAY['fish'], 'Norway', 'Ocean Fresh', 'Atlantic Salmon', NULL, 4.8, 44, 320, 140, NOW(), NOW()),

('prod-014', 'supplier-profile-005', 'Shrimp', 'Large Gulf shrimp, peeled and deveined', 'Premium Gulf shrimp', 'seafood', 'shellfish', 12.99, 14.99, 'pound', 'SEA-002', '1234567890136', 'https://example.com/images/shrimp.jpg', ARRAY['https://example.com/images/shrimp-1.jpg'], 0.45, '20x15x8 cm', 2, 15, 50, 1, true, true, false, NULL, NULL, ARRAY['gulf', 'large', 'peeled'], '{"size": "16/20 count", "peeled": true, "deveined": true}', '{"calories": 99, "protein": "21g", "selenium": "48%"}', ARRAY['shellfish'], 'USA', 'Gulf Coast', 'Large Shrimp', NULL, 4.6, 36, 280, 120, NOW(), NOW());

-- =====================================================
-- PAYMENT METHODS
-- =====================================================

INSERT INTO payment_methods (id, name, type, is_active, processing_fee_percentage, processing_fee_fixed, configuration, created_at) VALUES
('pay-001', 'Credit Card', 'credit_card', true, 2.9, 0.30, '{"supported_cards": ["visa", "mastercard", "amex"], "require_cvv": true}', NOW()),
('pay-002', 'Bank Transfer', 'bank_transfer', true, 0.0, 0.00, '{"processing_days": 3, "require_confirmation": true}', NOW()),
('pay-003', 'PayPal', 'paypal', true, 3.4, 0.00, '{"require_paypal_account": true}', NOW()),
('pay-004', 'Invoice', 'invoice', true, 0.0, 0.00, '{"payment_terms": "Net 30", "require_approval": true}', NOW()),
('pay-005', 'Cash on Delivery', 'cod', true, 0.0, 5.00, '{"require_id": true, "change_limit": 50}', NOW());

-- =====================================================
-- SHIPPING METHODS
-- =====================================================

INSERT INTO shipping_methods (id, supplier_id, name, description, cost, free_shipping_threshold, estimated_days_min, estimated_days_max, is_active, created_at) VALUES
('ship-001', 'supplier-profile-001', 'Standard Delivery', 'Standard delivery within business area', 15.00, 200.00, 1, 3, true, NOW()),
('ship-002', 'supplier-profile-001', 'Express Delivery', 'Next day delivery', 25.00, 500.00, 1, 1, true, NOW()),
('ship-003', 'supplier-profile-002', 'Same Day Delivery', 'Same day delivery for orders before 2 PM', 30.00, 300.00, 0, 1, true, NOW()),
('ship-004', 'supplier-profile-002', 'Standard Shipping', 'Standard shipping nationwide', 20.00, 250.00, 2, 5, true, NOW()),
('ship-005', 'supplier-profile-005', 'Express Shipping', 'Express shipping for fresh seafood', 35.00, 400.00, 1, 2, true, NOW()),
('ship-006', 'supplier-profile-006', 'Weekly Delivery', 'Scheduled weekly delivery', 10.00, 150.00, 3, 7, true, NOW());

-- =====================================================
-- COUPONS
-- =====================================================

INSERT INTO coupons (id, code, name, description, type, value, minimum_order_amount, maximum_discount_amount, usage_limit, usage_count, start_date, end_date, is_active, applicable_products, applicable_categories, created_at) VALUES
('coupon-001', 'WELCOME10', 'Welcome Discount', '10% off for new customers', 'percentage', 10.00, 100.00, 50.00, 1000, 25, NOW(), NOW() + INTERVAL '1 year', true, ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('coupon-002', 'SAVE50', 'Save 50 EUR', '50 EUR off orders over 500 EUR', 'fixed_amount', 50.00, 500.00, 50.00, 100, 5, NOW(), NOW() + INTERVAL '6 months', true, ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('coupon-003', 'SUMMER15', 'Summer Sale', '15% off summer products', 'percentage', 15.00, 150.00, 100.00, 500, 45, NOW(), NOW() + INTERVAL '3 months', true, ARRAY[]::uuid[], ARRAY['cat-003']::uuid[], NOW()),
('coupon-004', 'DAIRY20', 'Dairy Discount', '20% off all dairy products', 'percentage', 20.00, 75.00, 40.00, 200, 18, NOW(), NOW() + INTERVAL '2 months', true, ARRAY[]::uuid[], ARRAY['cat-002']::uuid[], NOW()),
('coupon-005', 'FREESHIP', 'Free Shipping', 'Free shipping on any order', 'fixed_amount', 0.00, 100.00, 30.00, 300, 67, NOW(), NOW() + INTERVAL '4 months', true, ARRAY[]::uuid[], ARRAY[]::uuid[], NOW());

-- =====================================================
-- CAMPAIGNS
-- =====================================================

INSERT INTO campaigns (id, supplier_id, name, description, discount_percentage, discount_amount, start_date, end_date, is_active, created_at, updated_at) VALUES
('campaign-001', 'supplier-profile-001', 'Dairy Summer Sale', 'Special discount on all dairy products for the summer season', 15.00, NULL, NOW(), NOW() + INTERVAL '30 days', true, NOW(), NOW()),
('campaign-002', 'supplier-profile-002', 'Meat Week Special', 'Discounted prices on premium meat products', NULL, 5.00, NOW(), NOW() + INTERVAL '7 days', true, NOW(), NOW()),
('campaign-003', 'supplier-profile-003', 'Organic Vegetable Month', 'Celebrate organic vegetables with special pricing', 20.00, NULL, NOW(), NOW() + INTERVAL '30 days', true, NOW(), NOW()),
('campaign-004', 'supplier-profile-004', 'Artisan Bakery Promotion', 'Fresh baked goods at reduced prices', 10.00, NULL, NOW(), NOW() + INTERVAL '14 days', true, NOW(), NOW()),
('campaign-005', 'supplier-profile-005', 'Seafood Special', 'Premium seafood at wholesale prices', 25.00, NULL, NOW(), NOW() + INTERVAL '21 days', true, NOW(), NOW());

-- =====================================================
-- CAMPAIGN PRODUCTS (Junction table)
-- =====================================================

INSERT INTO campaign_products (campaign_id, product_id) VALUES
('campaign-001', 'prod-001'),
('campaign-001', 'prod-002'),
('campaign-001', 'prod-003'),
('campaign-002', 'prod-004'),
('campaign-002', 'prod-005'),
('campaign-002', 'prod-006'),
('campaign-003', 'prod-007'),
('campaign-003', 'prod-008'),
('campaign-004', 'prod-009'),
('campaign-004', 'prod-010'),
('campaign-005', 'prod-013'),
('campaign-005', 'prod-014');

-- =====================================================
-- SHOPPING LISTS
-- =====================================================

INSERT INTO shopping_lists (id, buyer_id, name, description, is_active, created_at, updated_at) VALUES
('list-001', 'buyer-profile-001', 'Weekly Essentials', 'Regular weekly shopping list for restaurant supplies', true, NOW(), NOW()),
('list-002', 'buyer-profile-001', 'Breakfast Menu', 'Items needed for breakfast service', true, NOW(), NOW()),
('list-003', 'buyer-profile-002', 'Mediterranean Specials', 'Ingredients for Mediterranean dishes', true, NOW(), NOW()),
('list-004', 'buyer-profile-003', 'Cafe Supplies', 'Regular cafe inventory', true, NOW(), NOW()),
('list-005', 'buyer-profile-004', 'Hotel Restaurant', 'Full hotel restaurant inventory', true, NOW(), NOW()),
('list-006', 'buyer-profile-005', 'Supermarket Stock', 'Regular supermarket restocking', true, NOW(), NOW());

-- =====================================================
-- SHOPPING LIST ITEMS
-- =====================================================

INSERT INTO shopping_list_items (id, shopping_list_id, product_id, quantity, notes, added_at) VALUES
('item-001', 'list-001', 'prod-001', 10, 'For daily breakfast service', NOW()),
('item-002', 'list-001', 'prod-002', 5, 'For cooking and cheese plates', NOW()),
('item-003', 'list-001', 'prod-004', 20, 'For burgers and meat dishes', NOW()),
('item-004', 'list-002', 'prod-001', 5, 'Milk for coffee and cereal', NOW()),
('item-005', 'list-002', 'prod-009', 3, 'Fresh bread for toast', NOW()),
('item-006', 'list-002', 'prod-010', 12, 'Croissants for breakfast', NOW()),
('item-007', 'list-003', 'prod-013', 8, 'Salmon for Mediterranean dishes', NOW()),
('item-008', 'list-003', 'prod-007', 6, 'Spinach for salads', NOW()),
('item-009', 'list-003', 'prod-008', 4, 'Tomatoes for fresh salads', NOW()),
('item-010', 'list-004', 'prod-011', 8, 'Fresh juice for cafe', NOW()),
('item-011', 'list-004', 'prod-012', 20, 'Sparkling water for drinks', NOW()),
('item-012', 'list-004', 'prod-009', 6, 'Bread for sandwiches', NOW());

-- =====================================================
-- ORDERS
-- =====================================================

INSERT INTO orders (id, buyer_id, supplier_id, order_number, status, total_amount, delivery_date, delivery_address, notes, created_at, updated_at) VALUES
('order-001', 'buyer-profile-001', 'supplier-profile-001', 'ORD-2024-001', 'confirmed', 149.85, NOW() + INTERVAL '2 days', '456 Restaurant Ave, New York, NY 10001', 'Please deliver before 8 AM', NOW(), NOW()),
('order-002', 'buyer-profile-001', 'supplier-profile-002', 'ORD-2024-002', 'preparing', 89.94, NOW() + INTERVAL '1 day', '456 Restaurant Ave, New York, NY 10001', 'Fresh meat only', NOW(), NOW()),
('order-003', 'buyer-profile-002', 'supplier-profile-005', 'ORD-2024-003', 'shipped', 203.84, NOW() + INTERVAL '3 days', '789 Main Street, Los Angeles, CA 90210', 'Express delivery requested', NOW(), NOW()),
('order-004', 'buyer-profile-003', 'supplier-profile-004', 'ORD-2024-004', 'delivered', 44.91, NOW() - INTERVAL '1 day', '123 Coffee Street, Seattle, WA 98101', 'Delivered successfully', NOW(), NOW()),
('order-005', 'buyer-profile-004', 'supplier-profile-001', 'ORD-2024-005', 'pending', 299.70, NOW() + INTERVAL '5 days', '456 Hotel Boulevard, Las Vegas, NV 89101', 'Large hotel order', NOW(), NOW()),
('order-006', 'buyer-profile-005', 'supplier-profile-003', 'ORD-2024-006', 'confirmed', 95.84, NOW() + INTERVAL '2 days', '789 Market Street, Chicago, IL 60601', 'Organic products only', NOW(), NOW());

-- =====================================================
-- ORDER ITEMS
-- =====================================================

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
('order-item-001', 'order-001', 'prod-001', 15, 4.99, 74.85, NOW()),
('order-item-002', 'order-001', 'prod-002', 5, 12.99, 64.95, NOW()),
('order-item-003', 'order-001', 'prod-003', 10, 6.99, 69.90, NOW()),
('order-item-004', 'order-002', 'prod-004', 10, 8.99, 89.90, NOW()),
('order-item-005', 'order-003', 'prod-013', 12, 16.99, 203.88, NOW()),
('order-item-006', 'order-004', 'prod-009', 9, 4.99, 44.91, NOW()),
('order-item-007', 'order-005', 'prod-001', 30, 4.99, 149.70, NOW()),
('order-item-008', 'order-005', 'prod-002', 10, 12.99, 129.90, NOW()),
('order-item-009', 'order-005', 'prod-003', 20, 6.99, 139.80, NOW()),
('order-item-010', 'order-006', 'prod-007', 12, 3.99, 47.88, NOW()),
('order-item-011', 'order-006', 'prod-008', 8, 5.99, 47.92, NOW());

-- =====================================================
-- INVENTORY
-- =====================================================

INSERT INTO inventory (id, buyer_id, product_id, quantity, unit_cost, last_updated, minimum_stock, maximum_stock, reorder_point, reorder_quantity, status, last_restocked, next_restock_date, expiry_date, location, supplier, batch_number, ai_insights, alert_settings, created_at, updated_at) VALUES
('inv-001', 'buyer-profile-001', 'prod-001', 25, 4.99, NOW(), 10, 50, 15, 25, 'in_stock', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', NOW() + INTERVAL '7 days', 'Cooler A-1', 'Fresh Dairy Co', 'BATCH-001', '{"predicted_demand": 30, "confidence": 0.85, "seasonal_factors": ["summer_demand"], "restock_urgency": "medium"}', '{"low_stock_threshold": 15, "expiry_alert_days": 3}', NOW(), NOW()),
('inv-002', 'buyer-profile-001', 'prod-002', 8, 12.99, NOW(), 5, 20, 8, 15, 'low_stock', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', NOW() + INTERVAL '30 days', 'Cheese Cave B-2', 'Fresh Dairy Co', 'BATCH-002', '{"predicted_demand": 12, "confidence": 0.92, "seasonal_factors": ["holiday_demand"], "restock_urgency": "high"}', '{"low_stock_threshold": 8, "expiry_alert_days": 7}', NOW(), NOW()),
('inv-003', 'buyer-profile-001', 'prod-004', 35, 8.99, NOW(), 15, 60, 20, 30, 'in_stock', NOW() - INTERVAL '1 day', NOW() + INTERVAL '3 days', NOW() + INTERVAL '5 days', 'Freezer C-1', 'Premium Meats Ltd', 'BATCH-003', '{"predicted_demand": 40, "confidence": 0.78, "seasonal_factors": ["bbq_season"], "restock_urgency": "low"}', '{"low_stock_threshold": 20, "expiry_alert_days": 2}', NOW(), NOW()),
('inv-004', 'buyer-profile-002', 'prod-013', 12, 16.99, NOW(), 8, 25, 10, 15, 'in_stock', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', NOW() + INTERVAL '3 days', 'Seafood Section D-1', 'Ocean Fresh Seafood', 'BATCH-004', '{"predicted_demand": 18, "confidence": 0.88, "seasonal_factors": ["summer_demand"], "restock_urgency": "medium"}', '{"low_stock_threshold": 10, "expiry_alert_days": 1}', NOW(), NOW()),
('inv-005', 'buyer-profile-003', 'prod-009', 15, 4.99, NOW(), 8, 30, 12, 20, 'in_stock', NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days', 'Bakery Section E-1', 'Artisan Bakery Co', 'BATCH-005', '{"predicted_demand": 20, "confidence": 0.95, "seasonal_factors": ["weekend_demand"], "restock_urgency": "low"}', '{"low_stock_threshold": 12, "expiry_alert_days": 1}', NOW(), NOW());

-- =====================================================
-- INVENTORY ALERTS
-- =====================================================

INSERT INTO inventory_alerts (id, inventory_id, type, status, priority, message, description, metadata, acknowledged_at, acknowledged_by_user_id, acknowledgment_notes, resolved_at, resolved_by_user_id, resolution_notes, scheduled_for, is_recurring, recurring_pattern, escalation_level, notification_channels, created_at, updated_at) VALUES
('alert-001', 'inv-002', 'low_stock', 'active', 'high', 'Low Stock Alert: Cheddar Cheese', 'Cheddar cheese inventory is below reorder point', '{"threshold_value": 8, "current_value": 8, "percentage_change": -20, "supplier_name": "Fresh Dairy Co", "product_name": "Aged Cheddar Cheese", "category": "dairy"}', NULL, NULL, NULL, NULL, NULL, NULL, NOW() + INTERVAL '1 day', false, NULL, 1, ARRAY['email', 'sms'], NOW(), NOW()),
('alert-002', 'inv-004', 'expiry_warning', 'active', 'medium', 'Expiry Warning: Atlantic Salmon', 'Salmon will expire in 3 days', '{"days_until_expiry": 3, "supplier_name": "Ocean Fresh Seafood", "product_name": "Atlantic Salmon", "category": "seafood", "expiry_date": "2024-10-19"}', NULL, NULL, NULL, NULL, NULL, NULL, NOW() + INTERVAL '6 hours', false, NULL, 1, ARRAY['email'], NOW(), NOW()),
('alert-003', 'inv-001', 'restock_recommendation', 'acknowledged', 'low', 'Restock Recommendation: Organic Milk', 'AI recommends restocking milk inventory', '{"predicted_demand": 30, "confidence": 0.85, "recommended_stock": 45, "supplier_name": "Fresh Dairy Co", "product_name": "Organic Whole Milk"}', NOW() - INTERVAL '2 hours', 'client-001', 'Order placed with supplier', NULL, NULL, NULL, NULL, false, NULL, 1, ARRAY['email'], NOW(), NOW());

-- =====================================================
-- INVENTORY MOVEMENTS
-- =====================================================

INSERT INTO inventory_movements (id, inventory_id, movement_type, quantity_change, previous_quantity, new_quantity, unit_cost, total_cost, reason, reference_type, reference_id, notes, location_from, location_to, batch_number, expiry_date, supplier_name, movement_date, created_by_user_id, created_at, updated_at) VALUES
('movement-001', 'inv-001', 'inbound', 25, 0, 25, 4.99, 124.75, 'Initial stock', 'order', 'order-001', 'Initial inventory setup', NULL, 'Cooler A-1', 'BATCH-001', NOW() + INTERVAL '7 days', 'Fresh Dairy Co', NOW() - INTERVAL '2 days', 'client-001', NOW(), NOW()),
('movement-002', 'inv-001', 'outbound', -5, 25, 20, 4.99, 24.95, 'Daily usage', 'consumption', NULL, 'Used for breakfast service', 'Cooler A-1', NULL, 'BATCH-001', NULL, 'Fresh Dairy Co', NOW() - INTERVAL '1 day', 'client-001', NOW(), NOW()),
('movement-003', 'inv-001', 'inbound', 10, 20, 30, 4.99, 49.90, 'Restock', 'order', 'order-005', 'Restock order received', 'Delivery Dock', 'Cooler A-1', 'BATCH-006', NOW() + INTERVAL '7 days', 'Fresh Dairy Co', NOW() - INTERVAL '4 hours', 'client-001', NOW(), NOW()),
('movement-004', 'inv-002', 'inbound', 15, 0, 15, 12.99, 194.85, 'Initial stock', 'order', 'order-001', 'Initial inventory setup', NULL, 'Cheese Cave B-2', 'BATCH-002', NOW() + INTERVAL '30 days', 'Fresh Dairy Co', NOW() - INTERVAL '5 days', 'client-001', NOW(), NOW()),
('movement-005', 'inv-002', 'outbound', -7, 15, 8, 12.99, 90.93, 'Weekly usage', 'consumption', NULL, 'Used for cooking and cheese plates', 'Cheese Cave B-2', NULL, 'BATCH-002', NULL, 'Fresh Dairy Co', NOW() - INTERVAL '2 days', 'client-001', NOW(), NOW());

-- =====================================================
-- SHOPPING CART
-- =====================================================

INSERT INTO shopping_cart (id, buyer_id, product_id, quantity, added_at, updated_at) VALUES
('cart-001', 'buyer-profile-001', 'prod-003', 3, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('cart-001', 'buyer-profile-001', 'prod-005', 2, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),
('cart-002', 'buyer-profile-003', 'prod-011', 5, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('cart-002', 'buyer-profile-003', 'prod-012', 10, NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '1 hour 30 minutes'),
('cart-003', 'buyer-profile-005', 'prod-007', 8, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('cart-003', 'buyer-profile-005', 'prod-008', 6, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes');

-- =====================================================
-- PRODUCT REVIEWS
-- =====================================================

INSERT INTO product_reviews (id, product_id, buyer_id, rating, title, comment, is_verified_purchase, is_approved, created_at, updated_at) VALUES
('review-001', 'prod-001', 'buyer-profile-001', 5, 'Excellent Quality Milk', 'The organic whole milk is fresh and has great taste. Perfect for our restaurant.', true, true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('review-002', 'prod-001', 'buyer-profile-002', 4, 'Good Quality', 'Good quality milk, slightly expensive but worth it for the organic certification.', true, true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('review-003', 'prod-002', 'buyer-profile-001', 5, 'Perfect Aged Cheddar', 'The aged cheddar has excellent flavor and melts perfectly in our dishes.', true, true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('review-004', 'prod-004', 'buyer-profile-002', 4, 'Quality Ground Beef', 'Good quality ground beef, perfect for our burgers. Consistent quality.', true, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('review-005', 'prod-009', 'buyer-profile-003', 5, 'Amazing Sourdough', 'The sourdough bread is absolutely perfect. Crispy crust and soft interior.', true, true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('review-006', 'prod-013', 'buyer-profile-002', 5, 'Fresh Atlantic Salmon', 'Excellent quality salmon, very fresh and perfect for our Mediterranean dishes.', true, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- =====================================================
-- WISHLIST
-- =====================================================

INSERT INTO wishlist (id, buyer_id, product_id, added_at) VALUES
('wish-001', 'buyer-profile-001', 'prod-006', NOW() - INTERVAL '2 days'),
('wish-001', 'buyer-profile-001', 'prod-014', NOW() - INTERVAL '1 day'),
('wish-002', 'buyer-profile-003', 'prod-009', NOW() - INTERVAL '3 days'),
('wish-002', 'buyer-profile-003', 'prod-010', NOW() - INTERVAL '2 days'),
('wish-003', 'buyer-profile-005', 'prod-007', NOW() - INTERVAL '5 days'),
('wish-003', 'buyer-profile-005', 'prod-008', NOW() - INTERVAL '4 days');

-- =====================================================
-- MESSAGES
-- =====================================================

INSERT INTO messages (id, sender_id, receiver_id, order_id, content, is_read, created_at) VALUES
('msg-001', 'client-001', 'supplier-001', 'order-001', 'Hi, can we confirm the delivery time for tomorrow?', false, NOW() - INTERVAL '2 hours'),
('msg-002', 'supplier-001', 'client-001', 'order-001', 'Yes, delivery is scheduled for 8 AM as requested.', true, NOW() - INTERVAL '1 hour'),
('msg-003', 'client-002', 'supplier-005', 'order-003', 'Thank you for the express delivery! The salmon was perfect.', false, NOW() - INTERVAL '30 minutes'),
('msg-004', 'client-003', 'supplier-004', 'order-004', 'The bread delivery was excellent. We will be ordering more.', true, NOW() - INTERVAL '1 day'),
('msg-005', 'supplier-002', 'client-001', 'order-002', 'Your meat order is being prepared and will be ready for pickup tomorrow.', false, NOW() - INTERVAL '3 hours'),
('msg-006', 'client-005', 'supplier-003', NULL, 'Do you have any seasonal vegetables available this week?', false, NOW() - INTERVAL '1 hour');

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

INSERT INTO notifications (id, user_id, title, message, type, is_read, metadata, created_at) VALUES
('notif-001', 'client-001', 'New Order Confirmed', 'Your order ORD-2024-001 has been confirmed and is being prepared', 'order_update', false, '{"order_id": "order-001", "order_number": "ORD-2024-001"}', NOW() - INTERVAL '2 days'),
('notif-002', 'client-001', 'Inventory Low Alert', 'Your cheddar cheese inventory is running low (8 units remaining)', 'inventory_alert', false, '{"product_id": "prod-002", "current_stock": 8, "threshold": 8}', NOW() - INTERVAL '1 day'),
('notif-003', 'client-002', 'Order Shipped', 'Your order ORD-2024-003 has been shipped and is on its way', 'order_update', false, '{"order_id": "order-003", "order_number": "ORD-2024-003", "tracking_number": "TRK123456"}', NOW() - INTERVAL '1 day'),
('notif-004', 'supplier-001', 'New Order Received', 'You have received a new order from Demo Restaurant', 'order_received', false, '{"order_id": "order-001", "buyer_name": "Demo Restaurant", "total_amount": 149.85}', NOW() - INTERVAL '2 days'),
('notif-005', 'supplier-005', 'Order Delivered', 'Your order to Bella Vista Restaurant has been delivered successfully', 'order_delivered', false, '{"order_id": "order-003", "buyer_name": "Bella Vista Restaurant"}', NOW() - INTERVAL '2 hours'),
('notif-006', 'client-003', 'Product Review', 'Thank you for your 5-star review of our sourdough bread!', 'review_received', true, '{"product_id": "prod-009", "rating": 5, "review_id": "review-005"}', NOW() - INTERVAL '4 days');

-- =====================================================
-- ADMIN ANALYTICS
-- =====================================================

INSERT INTO admin_analytics (id, metric_name, metric_category, metric_value, metric_unit, breakdown_data, metric_date, entity_type, entity_id, additional_metadata, created_at, updated_at) VALUES
('analytics-001', 'total_orders', 'orders', 6, 'count', '{"by_status": {"pending": 1, "confirmed": 2, "preparing": 1, "shipped": 1, "delivered": 1}}', CURRENT_DATE, 'order', NULL, '{"period": "today"}', NOW(), NOW()),
('analytics-002', 'total_revenue', 'financial', 784.08, 'USD', '{"by_supplier": {"Fresh Dairy Co": 299.70, "Premium Meats Ltd": 89.90, "Ocean Fresh Seafood": 203.88, "Artisan Bakery Co": 44.91, "Green Valley Produce": 95.84}}', CURRENT_DATE, 'order', NULL, '{"period": "today"}', NOW(), NOW()),
('analytics-003', 'active_users', 'users', 11, 'count', '{"by_role": {"admin": 2, "supplier": 6, "client": 6}}', CURRENT_DATE, 'user', NULL, '{"period": "today"}', NOW(), NOW()),
('analytics-004', 'total_products', 'products', 14, 'count', '{"by_category": {"dairy": 3, "meat": 3, "produce": 2, "bakery": 2, "beverages": 2, "seafood": 2}}', CURRENT_DATE, 'product', NULL, '{"period": "today"}', NOW(), NOW()),
('analytics-005', 'inventory_alerts', 'inventory', 3, 'count', '{"by_type": {"low_stock": 1, "expiry_warning": 1, "restock_recommendation": 1}}', CURRENT_DATE, 'inventory_alert', NULL, '{"period": "today"}', NOW(), NOW());

-- =====================================================
-- ADMIN AUDIT LOGS
-- =====================================================

INSERT INTO admin_audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at) VALUES
('audit-001', 'admin-001', 'CREATE', 'user', 'client-001', 'Created new user account for Demo Restaurant', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '2 days'),
('audit-002', 'admin-001', 'UPDATE', 'product', 'prod-001', 'Updated product pricing for Organic Whole Milk', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '1 day'),
('audit-003', 'admin-002', 'DELETE', 'coupon', 'coupon-001', 'Deleted expired coupon WELCOME10', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL '3 hours'),
('audit-004', 'admin-001', 'VIEW', 'analytics', NULL, 'Viewed dashboard analytics for today', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '1 hour'),
('audit-005', 'admin-002', 'EXPORT', 'orders', NULL, 'Exported order data for Q3 2024', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL '30 minutes');

-- =====================================================
-- COLOR THEMES
-- =====================================================

INSERT INTO color_themes (id, name, description, primary_color, secondary_color, accent_color, background_color, text_color, is_default, is_active, created_by_user_id, created_at, updated_at) VALUES
('theme-001', 'Default Blue', 'Default blue theme for the platform', '#2196F3', '#1976D2', '#FFC107', '#FFFFFF', '#333333', true, true, 'admin-001', NOW(), NOW()),
('theme-002', 'Green Nature', 'Green theme inspired by nature and organic products', '#4CAF50', '#388E3C', '#FF9800', '#F1F8E9', '#2E7D32', false, true, 'admin-001', NOW(), NOW()),
('theme-003', 'Dark Mode', 'Dark theme for reduced eye strain', '#424242', '#616161', '#FF5722', '#303030', '#FFFFFF', false, true, 'admin-002', NOW(), NOW()),
('theme-004', 'Ocean Blue', 'Ocean-inspired theme for seafood suppliers', '#00BCD4', '#0097A7', '#FF6F00', '#E0F2F1', '#00695C', false, true, 'admin-001', NOW(), NOW());

-- =====================================================
-- SYSTEM CONFIG
-- =====================================================

INSERT INTO system_configs (id, config_key, config_value, description, config_type, is_encrypted, is_public, created_by_user_id, created_at, updated_at) VALUES
('config-001', 'platform_name', 'CESTO AI', 'Name of the platform', 'string', false, true, 'admin-001', NOW(), NOW()),
('config-002', 'max_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', 'number', false, false, 'admin-001', NOW(), NOW()),
('config-003', 'default_currency', 'USD', 'Default currency for the platform', 'string', false, true, 'admin-001', NOW(), NOW()),
('config-004', 'email_notifications_enabled', 'true', 'Enable email notifications globally', 'boolean', false, false, 'admin-001', NOW(), NOW()),
('config-005', 'maintenance_mode', 'false', 'Enable maintenance mode', 'boolean', false, false, 'admin-002', NOW(), NOW()),
('config-006', 'order_auto_approval_threshold', '500', 'Auto-approve orders under this amount', 'number', false, false, 'admin-001', NOW(), NOW());

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count records in each table
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
SELECT 'inventory_alerts', COUNT(*) FROM inventory_alerts
UNION ALL
SELECT 'inventory_movements', COUNT(*) FROM inventory_movements
UNION ALL
SELECT 'shopping_lists', COUNT(*) FROM shopping_lists
UNION ALL
SELECT 'shopping_list_items', COUNT(*) FROM shopping_list_items
UNION ALL
SELECT 'shopping_cart', COUNT(*) FROM shopping_cart
UNION ALL
SELECT 'product_reviews', COUNT(*) FROM product_reviews
UNION ALL
SELECT 'wishlist', COUNT(*) FROM wishlist
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'campaign_products', COUNT(*) FROM campaign_products
UNION ALL
SELECT 'payment_methods', COUNT(*) FROM payment_methods
UNION ALL
SELECT 'shipping_methods', COUNT(*) FROM shipping_methods
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'admin_analytics', COUNT(*) FROM admin_analytics
UNION ALL
SELECT 'admin_audit_logs', COUNT(*) FROM admin_audit_logs
UNION ALL
SELECT 'color_themes', COUNT(*) FROM color_themes
UNION ALL
SELECT 'system_configs', COUNT(*) FROM system_configs
ORDER BY table_name;

-- Show sample data from key tables
SELECT 'Sample Users' as info;
SELECT id, email, role, first_name, last_name, company_name FROM users ORDER BY role, email LIMIT 10;

SELECT 'Sample Products' as info;
SELECT id, name, category, price, stock_quantity FROM products ORDER BY category, name LIMIT 10;

SELECT 'Sample Orders' as info;
SELECT id, order_number, status, total_amount FROM orders ORDER BY created_at DESC LIMIT 5;

SELECT 'Sample Inventory' as info;
SELECT i.id, p.name, i.quantity, i.status FROM inventory i JOIN products p ON i.product_id = p.id LIMIT 5;

