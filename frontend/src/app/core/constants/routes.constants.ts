export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  DASHBOARD: '/dashboard',
  SUPPLIERS: '/suppliers',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  SHOPPING_LIST: '/shopping-list',
  INVENTORY: '/inventory',
  ANALYSIS: '/analysis',
  TEAM: '/team',
  TRANSACTIONS: '/transactions',

  // Client routes
  CLIENT_INSIGHTS: '/clients/insights',
  EXPLORE_SUPPLIERS: '/clients/explore-suppliers',
  MY_SUPPLIERS: '/clients/my-suppliers',

  // Supplier routes
  SUPPLIER_DASHBOARD: '/supplier',
  SUPPLIER_EDI: '/supplier/edi',

  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',

  // API routes
  API: {
    AUTH: '/api/v1/auth',
    SUPPLIERS: '/api/v1/suppliers',
    PRODUCTS: '/api/v1/products',
    ORDERS: '/api/v1/orders',
    INVENTORY: '/api/v1/inventory',
    ANALYSIS: '/api/v1/analysis',
    USERS: '/api/v1/users'
  }
};

export const ROUTE_PARAMS = {
  ID: ':id',
  CATEGORY: ':category',
  TYPE: ':type',
  STATUS: ':status'
};

export const QUERY_PARAMS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SEARCH: 'search',
  CATEGORY: 'category',
  SORT: 'sort',
  ORDER: 'order',
  FILTER: 'filter'
};

