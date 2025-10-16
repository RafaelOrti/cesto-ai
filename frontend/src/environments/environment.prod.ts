export const environment = {
  production: true,
  apiUrl: 'https://api.cesto.com/api/v1',
  aiServicesUrl: 'https://ai.cesto.com',
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
    level: 'error',
    enableConsole: false
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100
  },
  cache: {
    ttl: 600000, // 10 minutes
    maxSize: 200
  }
};