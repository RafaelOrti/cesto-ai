-- Script para crear usuarios adicionales con diferentes roles
-- Contraseña para todos: "password123" (hash generado con bcrypt)

-- 1. Usuario ADMIN
INSERT INTO users (
    id,
    email,
    "passwordHash",
    "firstName",
    "lastName",
    "companyName",
    phone,
    address,
    city,
    "postalCode",
    country,
    role,
    "isActive",
    "emailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'admin@cesto.com',
    '$2b$10$b0RMBb5xji7FZ25gUBLw/eheeT5D9n8/5UiNM2g6.Ido7VAmBvk3q', -- password123
    'María',
    'García',
    'CESTO Admin',
    '+34 600 000 001',
    'Calle Admin 1',
    'Madrid',
    '28001',
    'España',
    'admin',
    true,
    true,
    NOW(),
    NOW()
);

-- 2. Usuario SUPPLIER
INSERT INTO users (
    id,
    email,
    "passwordHash",
    "firstName",
    "lastName",
    "companyName",
    phone,
    address,
    city,
    "postalCode",
    country,
    role,
    "isActive",
    "emailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'supplier@cesto.com',
    '$2b$10$b0RMBb5xji7FZ25gUBLw/eheeT5D9n8/5UiNM2g6.Ido7VAmBvk3q', -- password123
    'Carlos',
    'López',
    'Frutas Frescas S.L.',
    '+34 600 000 002',
    'Calle Proveedor 2',
    'Valencia',
    '46001',
    'España',
    'supplier',
    true,
    true,
    NOW(),
    NOW()
);

-- 3. Usuario BUYER
INSERT INTO users (
    id,
    email,
    "passwordHash",
    "firstName",
    "lastName",
    "companyName",
    phone,
    address,
    city,
    "postalCode",
    country,
    role,
    "isActive",
    "emailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'buyer@cesto.com',
    '$2b$10$b0RMBb5xji7FZ25gUBLw/eheeT5D9n8/5UiNM2g6.Ido7VAmBvk3q', -- password123
    'Ana',
    'Martín',
    'Supermercado El Buen Precio',
    '+34 600 000 003',
    'Calle Comprador 3',
    'Barcelona',
    '08001',
    'España',
    'buyer',
    true,
    true,
    NOW(),
    NOW()
);

-- 4. Usuario CLIENT adicional
INSERT INTO users (
    id,
    email,
    "passwordHash",
    "firstName",
    "lastName",
    "companyName",
    phone,
    address,
    city,
    "postalCode",
    country,
    role,
    "isActive",
    "emailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'client2@cesto.com',
    '$2b$10$b0RMBb5xji7FZ25gUBLw/eheeT5D9n8/5UiNM2g6.Ido7VAmBvk3q', -- password123
    'Pedro',
    'Sánchez',
    'Restaurante La Cocina',
    '+34 600 000 004',
    'Calle Cliente 4',
    'Sevilla',
    '41001',
    'España',
    'client',
    true,
    true,
    NOW(),
    NOW()
);

-- Crear perfil de supplier para el usuario supplier
INSERT INTO suppliers (
    id,
    "userId",
    "companyName",
    description,
    categories,
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'supplier@cesto.com'),
    'Frutas Frescas S.L.',
    'Proveedor especializado en frutas y verduras frescas de la huerta valenciana',
    ARRAY[]::suppliers_categories_enum[],
    true,
    NOW(),
    NOW()
);

-- Crear perfil de buyer para el usuario buyer
INSERT INTO buyers (
    id,
    "userId",
    "businessType",
    "businessName",
    "preferredSuppliers",
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'buyer@cesto.com'),
    'supermarket',
    'Supermercado El Buen Precio',
    ARRAY[]::uuid[],
    true,
    NOW(),
    NOW()
);

-- Crear perfil de client para el usuario client2
INSERT INTO clients (
    id,
    "userId",
    "businessName",
    "businessType",
    description,
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'client2@cesto.com'),
    'Restaurante La Cocina',
    'restaurant',
    'Restaurante familiar especializado en cocina tradicional',
    true,
    NOW(),
    NOW()
);

-- Verificar que se crearon correctamente
SELECT 
    u.id,
    u.email,
    u."firstName",
    u."lastName",
    u."companyName",
    u.role,
    u."isActive",
    s."companyName" as supplier_company,
    b."businessName" as buyer_business,
    c."businessName" as client_business
FROM users u
LEFT JOIN suppliers s ON u.id = s."userId"
LEFT JOIN buyers b ON u.id = b."userId"
LEFT JOIN clients c ON u.id = c."userId"
WHERE u.email IN ('admin@cesto.com', 'supplier@cesto.com', 'buyer@cesto.com', 'client2@cesto.com')
ORDER BY u.role, u.email;
