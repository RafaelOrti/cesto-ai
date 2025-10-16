import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Buyer } from '../buyers/entities/buyer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Supplier, Buyer]),
    UsersModule,
    PassportModule,
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('redis.url') || `redis://${configService.get('redis.host')}:${configService.get('redis.port')}`,
        options: {
          password: configService.get('redis.password'),
          db: configService.get('redis.db'),
          retryDelayOnFailover: configService.get('redis.retryDelayOnFailover'),
          maxRetriesPerRequest: configService.get('redis.maxRetriesPerRequest'),
          lazyConnect: configService.get('redis.lazyConnect'),
          keepAlive: configService.get('redis.keepAlive'),
          connectTimeout: configService.get('redis.connectTimeout'),
          commandTimeout: configService.get('redis.commandTimeout'),
        },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
