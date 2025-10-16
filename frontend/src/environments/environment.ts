export const environment = {
  production: false,
  apiUrl: 'http://localhost:3400/api/v1',
  aiServicesUrl: 'http://localhost:8001',
  appName: 'CESTO',
  version: '1.0.0',
  features: {
    suppliers: true,
    products: true,
    orders: true,
    inventory: true,
    analysis: true,
    edi: true,
    ai: true
  },
  logging: {
    level: 'debug',
    enableConsole: true
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100
  },
  cache: {
    ttl: 300000, // 5 minutes
    maxSize: 100
  }
};