import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsArray } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
import { ProductCategory } from '../../products/enums/product-category.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  categories?: ProductCategory[];
}
