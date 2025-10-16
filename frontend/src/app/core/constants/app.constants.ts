export const APP_CONSTANTS = {
  // API Endpoints
  API_ENDPOINTS: {
    SUPPLIERS: '/suppliers',
    PRODUCTS: '/products',
    ORDERS: '/orders',
    INVENTORY: '/inventory',
    ANALYSIS: '/analysis',
    AUTH: '/auth',
    USERS: '/users'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  },

  // Cache
  CACHE: {
    TTL: 300000, // 5 minutes
    MAX_SIZE: 100,
    KEYS: {
      SUPPLIERS: 'suppliers',
      PRODUCTS: 'products',
      USER: 'user',
      TOKEN: 'token'
    }
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    LANGUAGE: 'language',
    THEME: 'theme'
  },

  // Supplier Categories
  SUPPLIER_CATEGORIES: {
    DAIRY: 'dairy',
    FRUITS_VEGETABLES: 'fruits-vegetables',
    DELI: 'deli',
    HEALTH_BEAUTY: 'health-beauty',
    FROZEN: 'frozen',
    FRESH_MEAT: 'fresh-meat',
    PACKAGED: 'packaged'
  },

  // Supplier Features
  SUPPLIER_FEATURES: {
    FREE_DELIVERY: 'freeDelivery',
    CO_DELIVERY: 'coDelivery',
    ON_SALE: 'onSale',
    RECENTLY_ADDED: 'recentlyAdded',
    POPULAR: 'popular'
  },

  // Recommendation Types
  RECOMMENDATION_TYPES: {
    RECENTLY_ADDED: 'recently_added',
    POPULAR: 'popular',
    ALL: 'all'
  },

  // Languages
  LANGUAGES: {
    EN: 'en',
    SV: 'sv',
    ES: 'es'
  },

  // Themes
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },

  // User Roles
  USER_ROLES: {
    BUYER: 'buyer',
    SUPPLIER: 'supplier',
    ADMIN: 'admin'
  },

  // Status Codes
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },

  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 1000,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  // UI
  UI: {
    DEBOUNCE_TIME: 300,
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    DIALOG_WIDTH: '400px',
    DIALOG_HEIGHT: 'auto'
  }
};

