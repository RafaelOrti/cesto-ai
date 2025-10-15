# Cesto AI - Food & Beverage B2B Platform

A comprehensive AI-driven digital platform connecting buyers and suppliers in the food & beverage industry, eliminating manual processes and optimizing supply chain operations.

## 🚀 Features

### Core Functionality
- **Centralized Platform**: All suppliers and buyers in one place
- **AI-Driven Analytics**: Demand forecasting, inventory optimization, price recommendations
- **Role-Based Access**: Separate dashboards for buyers, suppliers, and admins
- **Real-Time Communication**: Built-in messaging and notifications
- **Inventory Management**: Automated stock tracking and low-stock alerts
- **Order Management**: Complete order lifecycle from creation to delivery
- **Document Automation**: AI-powered PO generation and invoice processing

### Technology Stack
- **Frontend**: Angular 17 with Angular Material
- **Backend**: NestJS with TypeScript
- **AI Services**: FastAPI with Python
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with role-based access control
- **Real-time**: WebSocket support for live updates

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular       │    │   NestJS        │    │   FastAPI       │
│   Frontend      │◄──►│   Backend       │◄──►│   AI Services   │
│   (Port 4200)   │    │   (Port 3000)   │    │   (Port 8001)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   + Redis       │
                    │   (Port 5432)   │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cesto-ai
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000/api/v1
   - AI Services: http://localhost:8001
   - Database: localhost:5432

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start database services**
   ```bash
   # PostgreSQL
   sudo systemctl start postgresql
   
   # Redis
   sudo systemctl start redis
   ```

4. **Run database migrations**
   ```bash
   cd backend
   npm run migration:run
   ```

5. **Start all services**
   ```bash
   npm run dev
   ```

## 📱 User Roles & Features

### Buyer Dashboard
- **Suppliers**: Manage current suppliers and discover new ones
- **Products**: Browse catalogs, campaigns, and sale items
- **Orders**: Track past orders, upcoming deliveries, and POs
- **Inventory**: Real-time stock management with AI-powered alerts
- **Shopping List**: Save items for future purchase
- **Analysis**: Sales forecasting and performance insights

### Supplier Dashboard
- **Products**: Manage product catalog and pricing
- **Campaigns**: Create and manage promotional offers
- **Orders**: Process incoming orders and track fulfillment
- **Inventory**: Monitor stock levels and availability
- **Invoices**: Generate and manage billing
- **Analytics**: Sales performance and demand insights

### Admin Panel
- **User Management**: Create and manage user accounts
- **System Configuration**: Platform settings and integrations
- **Analytics**: Global platform metrics and monitoring
- **Compliance**: Audit logs and regulatory compliance

## 🤖 AI Features

### Demand Forecasting
- Predict future product demand using historical data
- Seasonal pattern recognition
- Confidence scoring for predictions

### Inventory Optimization
- AI-powered reorder point calculations
- Cost optimization recommendations
- Stock level optimization based on demand patterns

### Price Recommendations
- Market analysis and competitive pricing
- Dynamic pricing suggestions
- Profit optimization insights

## 🔧 Development

### Project Structure
```
cesto-ai/
├── frontend/                 # Angular application
│   ├── src/app/
│   │   ├── components/      # UI components
│   │   ├── services/        # API services
│   │   ├── guards/          # Route guards
│   │   └── interceptors/    # HTTP interceptors
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── users/          # User management
│   │   ├── suppliers/      # Supplier logic
│   │   ├── products/       # Product management
│   │   └── orders/         # Order processing
├── ai-services/             # FastAPI AI services
│   ├── main.py             # AI API endpoints
│   └── models.py           # Pydantic models
└── database/               # Database schema
    └── init.sql           # Initial database setup
```

### Running in Development Mode

1. **Backend**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm start
   ```

3. **AI Services**
   ```bash
   cd ai-services
   python -m uvicorn main:app --reload --port 8001
   ```

### Database Management

```bash
# Create migration
cd backend
npm run migration:generate -- --name=AddNewFeature

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🔐 Authentication

The platform uses JWT-based authentication with role-based access control:

- **Buyer**: Can access buyer-specific features and data
- **Supplier**: Can access supplier-specific features and data
- **Admin**: Full platform access and management capabilities

### Sample API Usage

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@cesto.ai", "password": "password123"}'

# Get user profile
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer <jwt-token>"
```

## 📊 API Documentation

### Backend API
- Swagger UI: http://localhost:3000/api/docs
- OpenAPI Spec: http://localhost:3000/api/docs-json

### AI Services API
- FastAPI Docs: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test

# AI services tests
cd ai-services
python -m pytest
```

## 🚀 Deployment

### Production Build

```bash
# Build all services
npm run build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/cesto_ai
REDIS_URL=redis://host:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# AI Services
AI_MODEL_CACHE_TTL=3600
```

## 📈 Monitoring & Analytics

- **Application Metrics**: Built-in performance monitoring
- **AI Model Performance**: Track prediction accuracy and model drift
- **User Analytics**: Usage patterns and feature adoption
- **Business Metrics**: Order volume, revenue, and growth tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team at dev@cesto.ai
- Check the documentation at [docs.cesto.ai](https://docs.cesto.ai)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core platform architecture
- ✅ User authentication and roles
- ✅ Basic CRUD operations
- ✅ AI demand forecasting

### Phase 2 (Q2 2024)
- 🔄 Advanced inventory optimization
- 🔄 Real-time notifications
- 🔄 Mobile application
- 🔄 EDI integrations

### Phase 3 (Q3 2024)
- 📋 Advanced analytics dashboard
- 📋 Multi-language support
- 📋 API marketplace
- 📋 Advanced AI features

---

**Built with ❤️ by the Cesto AI Team**
