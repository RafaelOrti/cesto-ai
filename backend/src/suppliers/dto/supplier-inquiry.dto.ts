import { IsString, IsOptional, IsEmail, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SupplierInquiryDto {
  @ApiProperty({ description: 'Supplier ID' })
  @IsUUID()
  @IsNotEmpty()
  supplierId: string;

  @ApiPropertyOptional({ description: 'Inquiry message' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;

  @ApiPropertyOptional({ description: 'Contact information' })
  @IsOptional()
  contactInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export class SupplierInquiryResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Inquiry ID' })
  inquiryId: string;

  @ApiProperty({ description: 'Response message' })
  message: string;
}

