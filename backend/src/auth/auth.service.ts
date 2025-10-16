import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Buyer } from '../buyers/entities/buyer.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly JWT_EXPIRES_IN = '24h';
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Check rate limiting
    await this.checkRateLimit(email);

    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      relations: ['supplier', 'buyer'],
    });

    if (!user) {
      await this.recordFailedAttempt(email);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.recordFailedAttempt(email);
      return null;
    }

    // Clear failed attempts on successful login
    await this.clearFailedAttempts(email);

    const { passwordHash, ...result } = user;
    return result;
  }

  private async checkRateLimit(email: string): Promise<void> {
    const key = `login_attempts:${email.toLowerCase()}`;
    const attempts = await this.redis.get(key);
    
    if (attempts && parseInt(attempts) >= this.MAX_LOGIN_ATTEMPTS) {
      const lockoutKey = `login_lockout:${email.toLowerCase()}`;
      const lockoutTime = await this.redis.get(lockoutKey);
      
      if (lockoutTime) {
        const remainingTime = parseInt(lockoutTime) - Date.now();
        if (remainingTime > 0) {
          throw new BadRequestException(
            `Account locked due to multiple failed attempts. Please try again in ${Math.ceil(remainingTime / 60000)} minutes.`
          );
        }
      }
    }
  }

  private async recordFailedAttempt(email: string): Promise<void> {
    const key = `login_attempts:${email.toLowerCase()}`;
    const attempts = await this.redis.incr(key);
    
    if (attempts === 1) {
      await this.redis.expire(key, this.LOCKOUT_DURATION / 1000);
    }
    
    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockoutKey = `login_lockout:${email.toLowerCase()}`;
      await this.redis.setex(lockoutKey, this.LOCKOUT_DURATION / 1000, Date.now().toString());
    }
  }

  private async clearFailedAttempts(email: string): Promise<void> {
    const key = `login_attempts:${email.toLowerCase()}`;
    const lockoutKey = `login_lockout:${email.toLowerCase()}`;
    await Promise.all([
      this.redis.del(key),
      this.redis.del(lockoutKey)
    ]);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Please contact support.');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      companyName: user.companyName,
      iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store refresh token in Redis
    await this.redis.setex(
      `refresh_token:${user.id}`,
      this.parseExpirationTime(this.REFRESH_TOKEN_EXPIRES_IN),
      refreshToken
    );

    // Update last login
    await this.usersRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.parseExpirationTime(this.JWT_EXPIRES_IN),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        supplier: user.supplier,
        buyer: user.buyer,
        lastLoginAt: user.lastLoginAt,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check for existing user
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate password strength
    this.validatePasswordStrength(registerDto.password);

    // Hash password with higher cost factor for better security
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const user = this.usersRepository.create({
      email: registerDto.email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      firstName: registerDto.firstName.trim(),
      lastName: registerDto.lastName.trim(),
      companyName: registerDto.companyName.trim(),
      role: registerDto.role || UserRole.BUYER,
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
    });

    const savedUser = await this.usersRepository.save(user);

    // Create role-specific profile
    if (registerDto.role === UserRole.SUPPLIER) {
      const supplier = this.suppliersRepository.create({
        userId: savedUser.id,
        companyName: registerDto.companyName.trim(),
        description: registerDto.description?.trim(),
        categories: registerDto.categories || [],
        createdAt: new Date(),
      });
      await this.suppliersRepository.save(supplier);
    } else if (registerDto.role === UserRole.BUYER) {
      const buyer = this.buyersRepository.create({
        userId: savedUser.id,
        businessName: registerDto.companyName.trim(),
        businessType: registerDto.businessType?.trim(),
        categories: registerDto.categories || [],
        createdAt: new Date(),
      });
      await this.buyersRepository.save(buyer);
    }

    // Generate tokens
    const payload = { 
      email: savedUser.email, 
      sub: savedUser.id, 
      role: savedUser.role,
      companyName: savedUser.companyName,
      iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(
      { sub: savedUser.id, type: 'refresh' },
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store refresh token in Redis
    await this.redis.setex(
      `refresh_token:${savedUser.id}`,
      this.parseExpirationTime(this.REFRESH_TOKEN_EXPIRES_IN),
      refreshToken
    );

    const { passwordHash, ...result } = savedUser;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.parseExpirationTime(this.JWT_EXPIRES_IN),
      user: result,
    };
  }

  private validatePasswordStrength(password: string): void {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new BadRequestException(`Password must be at least ${minLength} characters long`);
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    }

    // Check for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /user/i,
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      throw new BadRequestException('Password contains common patterns and is not secure');
    }
  }

  private parseExpirationTime(timeString: string): number {
    const timeUnits: { [key: string]: number } = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // Default to 1 hour

    const value = parseInt(match[1]);
    const unit = match[2];
    return value * timeUnits[unit];
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['supplier', 'buyer'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const storedToken = await this.redis.get(`refresh_token:${payload.sub}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
        relations: ['supplier', 'buyer'],
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        companyName: user.companyName,
        iat: Math.floor(Date.now() / 1000),
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.JWT_EXPIRES_IN,
      });

      return {
        access_token: accessToken,
        expires_in: this.parseExpirationTime(this.JWT_EXPIRES_IN),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    // Remove refresh token from Redis
    if (refreshToken) {
      await this.redis.del(`refresh_token:${userId}`);
    }

    // Add token to blacklist (optional, for immediate token invalidation)
    // This would require implementing a token blacklist mechanism

    return { message: 'Logged out successfully' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    this.validatePasswordStrength(newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.usersRepository.update(userId, {
      passwordHash: hashedPassword,
    });

    // Invalidate all refresh tokens for security
    await this.redis.del(`refresh_token:${userId}`);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' }
    );

    // Store reset token in Redis with 1 hour expiry
    await this.redis.setex(
      `password_reset:${user.id}`,
      3600,
      resetToken
    );

    // TODO: Send email with reset link
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(resetToken);
      
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      const storedToken = await this.redis.get(`password_reset:${payload.sub}`);
      if (!storedToken || storedToken !== resetToken) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      this.validatePasswordStrength(newPassword);

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.usersRepository.update(user.id, {
        passwordHash: hashedPassword,
      });

      // Remove reset token and invalidate all refresh tokens
      await Promise.all([
        this.redis.del(`password_reset:${user.id}`),
        this.redis.del(`refresh_token:${user.id}`),
      ]);

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}
