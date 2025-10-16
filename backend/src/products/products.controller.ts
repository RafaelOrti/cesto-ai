import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService, ProductFilters } from './products.service';
import { ProductCategory } from './enums/product-category.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Get all products
   * GET /api/v1/products
   */
  @Get()
  async getProducts(
    @Request() req,
    @Query('category') category?: ProductCategory,
    @Query('subcategory') subcategory?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('isOnSale') isOnSale?: boolean,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('supplierIds') supplierIds?: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    const buyerId = req.user?.id;
    
    const filters: ProductFilters = {
      category,
      subcategory,
      minPrice,
      maxPrice,
      isOnSale,
      search,
      tags: tags ? tags.split(',') : undefined,
      supplierIds: supplierIds ? supplierIds.split(',') : undefined,
    };

    return this.productsService.getProducts(filters, page, pageSize, buyerId);
  }

  /**
   * Get products on sale
   * GET /api/v1/products/on-sale
   */
  @Get('on-sale')
  async getProductsOnSale(
    @Request() req,
    @Query('category') category?: ProductCategory,
    @Query('subcategory') subcategory?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('supplierIds') supplierIds?: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    const buyerId = req.user?.id;
    
    const filters: ProductFilters = {
      category,
      subcategory,
      minPrice,
      maxPrice,
      search,
      tags: tags ? tags.split(',') : undefined,
      supplierIds: supplierIds ? supplierIds.split(',') : undefined,
    };

    return this.productsService.getProductsOnSale(filters, page, pageSize, buyerId);
  }

  /**
   * Get products by category
   * GET /api/v1/products/category/:category
   */
  @Get('category/:category')
  async getProductsByCategory(
    @Request() req,
    @Param('category') category: ProductCategory,
    @Query('subcategory') subcategory?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('supplierIds') supplierIds?: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    const buyerId = req.user?.id;
    
    const filters: ProductFilters = {
      subcategory,
      minPrice,
      maxPrice,
      search,
      tags: tags ? tags.split(',') : undefined,
      supplierIds: supplierIds ? supplierIds.split(',') : undefined,
    };

    return this.productsService.getProductsByCategory(category, filters, page, pageSize, buyerId);
  }

  /**
   * Get product by ID
   * GET /api/v1/products/:id
   */
  @Get(':id')
  async getProductById(@Request() req, @Param('id') id: string) {
    const buyerId = req.user?.id;
    return this.productsService.getProductById(id, buyerId);
  }

  /**
   * Get product categories
   * GET /api/v1/products/categories
   */
  @Get('categories')
  async getCategories(@Request() req) {
    const buyerId = req.user?.id;
    return this.productsService.getCategories();
  }

  /**
   * Get subcategories for a category
   * GET /api/v1/products/categories/:category/subcategories
   */
  @Get('categories/:category/subcategories')
  async getSubcategories(@Param('category') category: ProductCategory) {
    return this.productsService.getSubcategories(category);
  }

  /**
   * Get popular products
   * GET /api/v1/products/popular
   */
  @Get('popular')
  async getPopularProducts(
    @Request() req,
    @Query('limit') limit = 10,
  ) {
    const buyerId = req.user?.id;
    return this.productsService.getPopularProducts(limit, buyerId);
  }

  /**
   * Get recently added products
   * GET /api/v1/products/recent
   */
  @Get('recent')
  async getRecentProducts(
    @Request() req,
    @Query('limit') limit = 10,
  ) {
    const buyerId = req.user?.id;
    return this.productsService.getRecentProducts(limit, buyerId);
  }

  /**
   * Search products
   * GET /api/v1/products/search
   */
  @Get('search')
  async searchProducts(
    @Request() req,
    @Query('q') searchTerm: string,
    @Query('category') category?: ProductCategory,
    @Query('subcategory') subcategory?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('tags') tags?: string,
    @Query('supplierIds') supplierIds?: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    const buyerId = req.user?.id;
    
    const filters: ProductFilters = {
      category,
      subcategory,
      minPrice,
      maxPrice,
      tags: tags ? tags.split(',') : undefined,
      supplierIds: supplierIds ? supplierIds.split(',') : undefined,
    };

    return this.productsService.searchProducts(searchTerm, filters, page, pageSize, buyerId);
  }

  /**
   * Get product statistics
   * GET /api/v1/products/stats
   */
  @Get('stats')
  async getProductStats(@Request() req) {
    const buyerId = req.user?.id;
    return this.productsService.getProductStats(buyerId);
  }
}
