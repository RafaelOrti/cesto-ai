# Database Seeder - Credenciales de Prueba

Este archivo contiene las credenciales de prueba para el sistema CESTO AI.

## 🔐 Usuarios de Prueba

### Usuario Administrador
- **Email:** `admin@cesto.ai`
- **Contraseña:** `Test1234`
- **Rol:** Admin
- **Empresa:** Cesto AI

### Usuario Cliente (Buyer) - Demo
- **Email:** `demo@stockfiller.com`
- **Contraseña:** `Test1234`
- **Rol:** Buyer (Cliente)
- **Empresa:** Demo Restaurant

### Usuario Cliente (Buyer) - Restaurante
- **Email:** `buyer@restaurant.com`
- **Contraseña:** `Test1234`
- **Rol:** Buyer (Cliente)
- **Empresa:** Bella Vista Restaurant

### Usuario Proveedor (Supplier) - Lácteos
- **Email:** `supplier@dairy.com`
- **Contraseña:** `Test1234`
- **Rol:** Supplier (Proveedor)
- **Empresa:** Fresh Dairy Co

### Usuario Proveedor (Supplier) - Carnes
- **Email:** `supplier@meat.com`
- **Contraseña:** `Test1234`
- **Rol:** Supplier (Proveedor)
- **Empresa:** Premium Meats Ltd

## 📦 Datos de Prueba Incluidos

### Productos
- **Leche Orgánica Entera** - $4.99/galón
- **Queso Cheddar Añejo** - $12.99/libra
- **Carne Molida Premium** - $8.99/libra
- **Pechuga de Pollo** - $6.99/libra

### Órdenes
- Orden de ejemplo: ORD-2024-001 (confirmada)
- Total: $149.85
- Incluye leche y queso

### Inventario
- Stock de leche: 25 unidades
- Umbral mínimo: 10 unidades
- Punto de reorden: 15 unidades

### Campañas
- **Dairy Summer Sale** - 15% de descuento en productos lácteos

### Mensajes y Notificaciones
- Mensaje de ejemplo entre cliente y proveedor
- Notificaciones de confirmación de orden
- Alertas de inventario bajo

## 🚀 Cómo Usar

1. Ejecuta el contenedor de PostgreSQL con Docker Compose
2. El script `init.sql` se ejecutará automáticamente
3. Usa cualquiera de las credenciales de arriba para hacer login

## 🔒 Seguridad

**IMPORTANTE:** Estas son credenciales de prueba únicamente para desarrollo. 
Nunca uses estas contraseñas en producción.

## 📝 Notas

- Todas las contraseñas cumplen con los requisitos de seguridad del sistema
- Los usuarios están configurados como activos por defecto
- Los proveedores están marcados como verificados
- Los datos incluyen relaciones completas entre todas las tablas
