import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { EdiModule } from './edi/edi.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig, redisConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
      inject: [],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    SharedModule,
    AuthModule,
    EdiModule,
    SuppliersModule,
    AdminModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}