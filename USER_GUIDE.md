# 👥 Cesto AI - User Guide & Test Accounts

## 🔐 Quick Login Guide

### Default Passwords
- **Most Users**: `password123`
- **Super Admin**: `admin123`
- **Test Users**: `test123`, `guest123`, `demo123`

### 🌐 Application URLs
- **Frontend**: http://localhost:4400
- **Backend API**: http://localhost:3400
- **AI Services**: http://localhost:8001

---

## 🔑 Admin Users
**Full system access and configuration**

| Email | Password | Company | Features |
|-------|----------|---------|----------|
| `admin@cesto.com` | `password123` | Cesto AI | System Administration |
| `admin@cesto.ai` | `password123` | Cesto AI | Platform Configuration |
| `superadmin@cesto.com` | `admin123` | Cesto AI | Super Admin Access |
| `admin@stockfiller.com` | `password123` | Stockfiller | Demo Admin |

### Admin Capabilities
- ✅ User management and role assignment
- ✅ System analytics and reporting
- ✅ Platform configuration and settings
- ✅ Full access to all modules

---

## 🏭 Supplier Users
**Suppliers who can manage products, campaigns, and orders**

### Food Category Suppliers
| Email | Password | Company | Specialization |
|-------|----------|---------|----------------|
| `supplier@dairy.com` | `password123` | Nordic Dairy Co. | Dairy Products |
| `supplier@meat.com` | `password123` | Premium Meat Supply | Meat & Poultry |
| `supplier@vegetables.com` | `password123` | Fresh Vegetables AB | Fresh Produce |
| `supplier@beverages.com` | `password123` | Swedish Beverages Ltd. | Drinks & Beverages |
| `supplier@bakery.com` | `password123` | Artisan Bakery Co. | Bakery Products |
| `supplier@seafood.com` | `password123` | Nordic Seafood AB | Seafood & Fish |
| `supplier@frozen.com` | `password123` | Frozen Foods Sweden | Frozen Products |
| `supplier@organic.com` | `password123` | Organic Farms Sweden | Organic Products |

### General Suppliers
| Email | Password | Company | Specialization |
|-------|----------|---------|----------------|
| `supplier@cesto.com` | `password123` | General Food Supply | General Food Products |
| `supplier@wholesale.com` | `password123` | Wholesale Food Group | Bulk & Wholesale |

### Supplier Capabilities
- ✅ Product catalog management
- ✅ Campaign creation and management
- ✅ Order processing and fulfillment
- ✅ Inventory management
- ✅ Customer communication and support
- ✅ Analytics and reporting

---

## 🛒 Client/Buyer Users
**Clients who can browse products, place orders, and manage their business**

### 🍽️ Restaurants & Food Service
| Email | Password | Company | Business Type |
|-------|----------|---------|---------------|
| `client@cesto.com` | `password123` | Main Street Restaurant | Full-Service Restaurant |
| `buyer@restaurant.com` | `password123` | Fine Dining Restaurant | Fine Dining |
| `cliente@restaurante.com` | `password123` | Restaurante Español | Spanish Restaurant |
| `restaurant@bistro.com` | `password123` | Urban Bistro | Casual Bistro |
| `cafe@urban.com` | `password123` | Urban Cafe Chain | Cafe Chain |
| `hotel@kitchen.com` | `password123` | Grand Hotel Stockholm | Hotel Kitchen |

### 🛍️ Retail & Supermarkets
| Email | Password | Company | Business Type |
|-------|----------|---------|---------------|
| `client2@cesto.com` | `password123` | City Supermarket | Local Supermarket |
| `buyer@cesto.com` | `password123` | Retail Chain | Retail Chain |
| `supermarket@chain.com` | `password123` | Nordic Supermarket Chain | Large Supermarket Chain |
| `grocery@store.com` | `password123` | Local Grocery Store | Independent Grocery |
| `retail@food.com` | `password123` | Food Retail Group | Food Retailer |
| `market@fresh.com` | `password123` | Fresh Market Chain | Fresh Market Chain |

### 🏢 Corporate & Catering
| Email | Password | Company | Business Type |
|-------|----------|---------|---------------|
| `catering@corporate.com` | `password123` | Corporate Catering Services | Corporate Catering |
| `events@catering.com` | `password123` | Event Catering Company | Event Catering |
| `corporate@cafe.com` | `password123` | Corporate Cafe Services | Corporate Cafeteria |
| `office@catering.com` | `password123` | Office Catering Solutions | Office Catering |

### Client Capabilities
- ✅ Product browsing and search
- ✅ Shopping cart and wishlist management
- ✅ Order placement and tracking
- ✅ Supplier discovery and evaluation
- ✅ Business analytics and reporting
- ✅ Inventory management
- ✅ Price comparison and analysis

---

## 🎯 Demo & Test Users
**Special users for testing and demonstration purposes**

| Email | Password | Company | Purpose |
|-------|----------|---------|---------|
| `demo@stockfiller.com` | `password123` | Stockfiller Demo | Main Demo Account |
| `test@cesto.com` | `test123` | Test Company | Testing Purposes |
| `guest@cesto.com` | `guest123` | Guest Account | Guest Access |
| `demo@client.com` | `demo123` | Demo Client Account | Client Demo |

---

## 🚀 Getting Started

### 1. Login Process
1. Navigate to http://localhost:4400
2. Click "Login" or "Sign In"
3. Enter any email and password from the tables above
4. Click "Login"

### 2. Role-Based Experience
- **Admin**: Access to admin panel, user management, system settings
- **Supplier**: Product management, order processing, customer analytics
- **Client**: Product browsing, order placement, supplier discovery

### 3. Key Features to Test

#### For Suppliers:
- 📦 Product catalog management
- 📊 Sales analytics dashboard
- 📋 Order management
- 🎯 Campaign creation
- 📈 Performance metrics

#### For Clients:
- 🔍 Product search and filtering
- 🛒 Shopping cart and checkout
- 📦 Order tracking
- 🏪 Supplier marketplace
- 📊 Business insights

#### For Admins:
- 👥 User management
- ⚙️ System configuration
- 📊 Platform analytics
- 🔧 System maintenance

---

## 🔧 Troubleshooting

### Common Issues

#### Login Problems
- **Issue**: "Invalid credentials"
- **Solution**: Double-check email and password from the tables above
- **Note**: All passwords are case-sensitive

#### Database Connection
- **Issue**: "Database connection failed"
- **Solution**: Ensure PostgreSQL is running:
  ```bash
  docker-compose up -d postgres
  ```

#### User Not Found
- **Issue**: User doesn't exist in database
- **Solution**: Run the user creation script:
  ```bash
  cd database
  ./create_users.sh
  ```

### Reset Users
If you need to recreate all test users:
```bash
cd database
./create_users.sh
```

---

## 📞 Support

For technical support or questions:
- 📧 Email: support@cesto.com
- 📝 Issues: Create an issue in the repository
- 📚 Documentation: Check `/api/docs` for API documentation

---

**Happy Testing! 🎉**
