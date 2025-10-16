import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3400,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:4200',
      'http://localhost:4400',
    ],
    credentials: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  },
  pagination: {
    defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT, 10) || 10,
    maxLimit: parseInt(process.env.PAGINATION_MAX_LIMIT, 10) || 100,
  },
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    supportedImageTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
    supportedDocumentTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  ai: {
    modelCacheTtl: parseInt(process.env.AI_MODEL_CACHE_TTL, 10) || 3600,
    predictionConfidenceThreshold: parseFloat(process.env.AI_PREDICTION_CONFIDENCE_THRESHOLD) || 0.7,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/cesto.log',
  },
}));

