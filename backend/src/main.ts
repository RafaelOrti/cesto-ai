import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Cookie parser
  app.use(cookieParser());
  
  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  const port = configService.get('PORT') || 3400;
  await app.listen(port);
  
  console.log(`🚀 Cesto AI Backend running on port ${port}`);
}

bootstrap();
