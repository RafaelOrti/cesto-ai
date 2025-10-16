export const APP_CONSTANTS = {
  JWT_EXPIRES_IN: '24h',
  BCRYPT_ROUNDS: 12,
  PAGINATION_DEFAULT_LIMIT: 10,
  PAGINATION_MAX_LIMIT: 100,
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  SUPPORTED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  BUYER: 'buyer',
  SUPPLIER: 'supplier',
} as const;

export const EDI_DOCUMENT_TYPES = {
  PURCHASE_ORDER: 'purchase_order',
  INVOICE: 'invoice',
  PRODUCT_CATALOG: 'product_catalog',
  ACKNOWLEDGMENT: 'acknowledgment',
} as const;

export const EDI_DOCUMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  ERROR: 'error',
  SENT: 'sent',
  RECEIVED: 'received',
} as const;

export const PRODUCT_CATEGORIES = {
  BEVERAGES: 'beverages',
  FOOD: 'food',
  SNACKS: 'snacks',
  DAIRY: 'dairy',
  MEAT: 'meat',
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  BAKERY: 'bakery',
  FROZEN: 'frozen',
  OTHER: 'other',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const INVENTORY_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
} as const;


