import { IsOptional, IsString, IsBoolean, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SupplierSortBy {
  NAME = 'name',
  RATING = 'rating',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

export enum SupplierSortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class SupplierQueryDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by on sale status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  onSale?: boolean;

  @ApiPropertyOptional({ description: 'Filter by free delivery' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  freeDelivery?: boolean;

  @ApiPropertyOptional({ description: 'Filter by co-delivery' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  coDelivery?: boolean;

  @ApiPropertyOptional({ description: 'Filter by recently added' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  recentlyAdded?: boolean;

  @ApiPropertyOptional({ description: 'Filter by popular' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  popular?: boolean;

  @ApiPropertyOptional({ description: 'Minimum rating' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ description: 'Sort by field', enum: SupplierSortBy })
  @IsOptional()
  @IsEnum(SupplierSortBy)
  sortBy?: SupplierSortBy = SupplierSortBy.NAME;

  @ApiPropertyOptional({ description: 'Sort order', enum: SupplierSortOrder })
  @IsOptional()
  @IsEnum(SupplierSortOrder)
  sortOrder?: SupplierSortOrder = SupplierSortOrder.ASC;
}


