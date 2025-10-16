# Cesto AI - B2B Food & Beverage Platform

A comprehensive AI-powered B2B platform for food and beverage businesses, featuring demand forecasting, inventory optimization, and automated EDI processing.

## 🏗️ Architecture

The application follows a microservices architecture with three main components:

- **Backend API** (NestJS + TypeScript) - Port 3400
- **Frontend** (Angular + Material Design) - Port 4400  
- **AI Services** (FastAPI + Python) - Port 8001

## 👥 Test Users

The application comes with pre-configured test users organized by role type:

### 🔑 Admin Users
**Full system access and configuration**
- **Email**: `admin@cesto.com` | **Password**: `password123`
- **Email**: `admin@cesto.ai` | **Password**: `password123`
- **Email**: `superadmin@cesto.com` | **Password**: `admin123`
- **Email**: `admin@stockfiller.com` | **Password**: `password123`

### 🏭 Supplier Users
**Suppliers who can manage products, campaigns, and orders**
- **Email**: `supplier@cesto.com` | **Password**: `password123`
- **Email**: `supplier@dairy.com` | **Password**: `password123`
- **Email**: `supplier@meat.com` | **Password**: `password123`
- **Email**: `supplier@vegetables.com` | **Password**: `password123`
- **Email**: `supplier@beverages.com` | **Password**: `password123`
- **Email**: `supplier@bakery.com` | **Password**: `password123`
- **Email**: `supplier@seafood.com` | **Password**: `password123`
- **Email**: `supplier@frozen.com` | **Password**: `password123`
- **Email**: `supplier@organic.com` | **Password**: `password123`
- **Email**: `supplier@wholesale.com` | **Password**: `password123`

### 🛒 Client/Buyer Users
**Clients who can browse products, place orders, and manage their business**

#### Restaurants & Food Service
- **Email**: `client@cesto.com` | **Password**: `password123`
- **Email**: `buyer@restaurant.com` | **Password**: `password123`
- **Email**: `cliente@restaurante.com` | **Password**: `password123`
- **Email**: `restaurant@bistro.com` | **Password**: `password123`
- **Email**: `cafe@urban.com` | **Password**: `password123`
- **Email**: `hotel@kitchen.com` | **Password**: `password123`

#### Retail & Supermarkets
- **Email**: `client2@cesto.com` | **Password**: `password123`
- **Email**: `buyer@cesto.com` | **Password**: `password123`
- **Email**: `supermarket@chain.com` | **Password**: `password123`
- **Email**: `grocery@store.com` | **Password**: `password123`
- **Email**: `retail@food.com` | **Password**: `password123`
- **Email**: `market@fresh.com` | **Password**: `password123`

#### Corporate & Catering
- **Email**: `catering@corporate.com` | **Password**: `password123`
- **Email**: `events@catering.com` | **Password**: `password123`
- **Email**: `corporate@cafe.com` | **Password**: `password123`
- **Email**: `office@catering.com` | **Password**: `password123`

### 🎯 Demo & Test Users
**Special users for testing and demonstration purposes**
- **Email**: `demo@stockfiller.com` | **Password**: `password123`
- **Email**: `test@cesto.com` | **Password**: `test123`
- **Email**: `guest@cesto.com` | **Password**: `guest123`
- **Email**: `demo@client.com` | **Password**: `demo123`

## 🔐 User Roles & Permissions

### Administrator (`admin`)
- Full system access and configuration
- User management and role assignment
- System analytics and reporting
- Platform configuration and settings

### Supplier (`supplier`)
- Product catalog management
- Campaign creation and management
- Order processing and fulfillment
- Inventory management
- Customer communication and support

### Client/Buyer (`client`, `buyer`)
- Product browsing and search
- Shopping cart and wishlist management
- Order placement and tracking
- Supplier discovery and evaluation
- Business analytics and reporting

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for AI services development)

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd CESTO

# Copy environment file
cp env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Local Development

#### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### AI Services Setup
```bash
cd ai-services
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## 📁 Project Structure

```
CESTO/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── shared/         # Shared modules, decorators, filters
│   │   ├── config/         # Configuration files
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── suppliers/      # Supplier management
│   │   ├── edi/            # EDI processing
│   │   └── admin/          # Admin panel
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Core services and interfaces
│   │   │   ├── components/ # UI components
│   │   │   └── services/   # API services
├── ai-services/            # FastAPI AI services
│   ├── config/            # Configuration
│   ├── core/              # Core utilities
│   ├── services/          # AI and ML services
│   └── models/            # Pydantic models
└── database/              # Database initialization
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://cesto_user:cesto_password@localhost:5432/cesto_ai
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=cesto_user
DB_PASSWORD=cesto_password
DB_NAME=cesto_ai

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=development
PORT=3400

# AI Services
GROQ_API_KEY=your-groq-api-key
AI_MODEL_CACHE_TTL=3600
AI_PREDICTION_CONFIDENCE_THRESHOLD=0.7

# CORS
CORS_ORIGINS=http://localhost:4200,http://localhost:4400

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/cesto.log
```

## 🎯 Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Buyer, Supplier)
- Password reset and change functionality
- Secure session management

### 🤖 AI-Powered Services
- **Demand Forecasting**: ML-based predictions using Random Forest
- **Inventory Optimization**: Smart stock level recommendations
- **Price Recommendations**: Market analysis and competitive pricing
- **Business Insights**: AI-powered analytics using Groq LLM

### 📊 EDI Processing
- Automated purchase order generation
- Document validation and error handling
- Support for multiple formats (XML, JSON, CSV)
- Real-time processing status tracking

### 📈 Analytics & Reporting
- Real-time dashboards
- Supplier performance metrics
- Inventory analytics
- Order tracking and management

### 🛡️ Security Features
- Input validation and sanitization
- Rate limiting and throttling
- CORS configuration
- Error handling and logging
- SQL injection protection

## 🏗️ Technical Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis for session and data caching
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston with structured logging

### Frontend (Angular)
- **Framework**: Angular 17 with TypeScript
- **UI Library**: Angular Material
- **State Management**: RxJS Observables
- **HTTP Client**: Angular HttpClient with interceptors
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router with guards

### AI Services (FastAPI)
- **Framework**: FastAPI with Python 3.11
- **ML Libraries**: scikit-learn, pandas, numpy
- **AI Integration**: Groq API for LLM insights
- **Database**: SQLAlchemy ORM
- **Caching**: Redis for model and result caching
- **Logging**: Structured logging with Python logging

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx (production)

## 📚 API Documentation

### Backend API
- **Base URL**: `http://localhost:3400/api/v1`
- **Documentation**: `http://localhost:3400/api/docs`
- **Health Check**: `http://localhost:3400/health`

### AI Services API
- **Base URL**: `http://localhost:8001`
- **Documentation**: `http://localhost:8001/docs`
- **Health Check**: `http://localhost:8001/health`

## 🔄 Development Workflow

### Code Quality
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Code linting with Prettier formatting
- **Testing**: Jest for backend, Karma/Jasmine for frontend
- **Git Hooks**: Pre-commit hooks for code quality

### Best Practices
- **Error Handling**: Global exception filters and custom exceptions
- **Logging**: Structured logging with correlation IDs
- **Validation**: Input validation at API boundaries
- **Security**: Authentication guards and role-based authorization
- **Performance**: Database query optimization and caching

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Serve dist/ folder with nginx or similar

# AI Services
cd ai-services
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring & Observability

- **Health Checks**: Built-in health endpoints for all services
- **Logging**: Structured JSON logs with correlation IDs
- **Error Tracking**: Global error handling with detailed stack traces
- **Performance**: Request timing and database query monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation at `/api/docs`

---

**Built with ❤️ by the Cesto AI Team**