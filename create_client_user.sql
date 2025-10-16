-- Script para crear un usuario cliente con hash de contraseña
-- Contraseña: "password123" (hash generado con bcrypt)

-- Insertar usuario cliente
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
    'client@cesto.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
    'Juan',
    'Pérez',
    'Empresa Cliente S.A.',
    '+34 600 123 456',
    'Calle Mayor 123',
    'Madrid',
    '28001',
    'España',
    'client',
    true,
    true,
    NOW(),
    NOW()
);

-- Insertar perfil de comprador asociado
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
    (SELECT id FROM users WHERE email = 'client@cesto.com'),
    'restaurant',
    'Restaurante El Buen Sabor',
    ARRAY[]::uuid[],
    true,
    NOW(),
    NOW()
);

-- Verificar que se creó correctamente
SELECT 
    u.id,
    u.email,
    u."firstName",
    u."lastName",
    u."companyName",
    u.role,
    u."isActive",
    b."businessType",
    b."businessName"
FROM users u
LEFT JOIN buyers b ON u.id = b."userId"
WHERE u.email = 'client@cesto.com';