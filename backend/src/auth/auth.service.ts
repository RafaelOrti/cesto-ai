import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Buyer } from '../buyers/entities/buyer.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['supplier', 'buyer'],
    });

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      companyName: user.companyName,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        supplier: user.supplier,
        buyer: user.buyer,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      email: registerDto.email,
      passwordHash: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      companyName: registerDto.companyName,
      role: registerDto.role || UserRole.BUYER,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create role-specific profile
    if (registerDto.role === UserRole.SUPPLIER) {
      const supplier = this.suppliersRepository.create({
        userId: savedUser.id,
        companyName: registerDto.companyName || '',
        description: registerDto.description,
        categories: registerDto.categories || [],
      });
      await this.suppliersRepository.save(supplier);
    } else if (registerDto.role === UserRole.BUYER) {
      const buyer = this.buyersRepository.create({
        userId: savedUser.id,
        businessName: registerDto.companyName || '',
        businessType: registerDto.businessType,
        categories: registerDto.categories || [],
      });
      await this.buyersRepository.save(buyer);
    }

    const { passwordHash, ...result } = savedUser;
    
    const payload = { 
      email: savedUser.email, 
      sub: savedUser.id, 
      role: savedUser.role,
      companyName: savedUser.companyName,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
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
}
