import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  
  // Use custom logger
  app.useLogger(logger);
  
  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // Enable CORS
  const corsOrigins = configService.get('app.cors.origins', [
    'http://localhost:4200',
    'http://localhost:4400',
  ]);
  
  app.enableCors({
    origin: corsOrigins,
    credentials: configService.get('app.cors.credentials', true),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  // Global prefix
  const apiPrefix = configService.get('app.apiPrefix', 'api/v1');
  app.setGlobalPrefix(apiPrefix);
  
  // Swagger documentation
  if (configService.get('app.nodeEnv') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Cesto AI API')
      .setDescription('AI-powered B2B food & beverage platform API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Authentication', 'User authentication endpoints')
      .addTag('Users', 'User management endpoints')
      .addTag('Suppliers', 'Supplier management endpoints')
      .addTag('Buyers', 'Buyer management endpoints')
      .addTag('Products', 'Product management endpoints')
      .addTag('Orders', 'Order management endpoints')
      .addTag('EDI', 'EDI document processing endpoints')
      .addTag('Admin', 'Administrative endpoints')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    
    logger.log('Swagger documentation available at /api/docs');
  }
  
  const port = configService.get('app.port', 3400);
  await app.listen(port);
  
  logger.log(`🚀 Cesto AI Backend running on port ${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error.stack);
  process.exit(1);
});
