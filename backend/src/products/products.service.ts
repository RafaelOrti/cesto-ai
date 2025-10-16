import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './enums/product-category.enum';
import { SupplierApproval, ApprovalStatus } from '../suppliers/entities/supplier-approval.entity';

export interface ProductFilters {
  category?: ProductCategory;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  isOnSale?: boolean;
  isActive?: boolean;
  search?: string;
  tags?: string[];
  supplierIds?: string[];
  approvedSuppliersOnly?: boolean;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(SupplierApproval)
    private supplierApprovalRepository: Repository<SupplierApproval>,
  ) {}

  /**
   * Get all products with filters and pagination
   */
  async getProducts(
    filters: ProductFilters = {},
    page = 1,
    pageSize = 20,
    buyerId?: string,
  ): Promise<PaginatedProducts> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.isActive = :isActive', { isActive: true });

    // Apply filters
    if (filters.category) {
      query.andWhere('product.category = :category', { category: filters.category });
    }

    if (filters.subcategory) {
      query.andWhere('product.subcategory = :subcategory', { subcategory: filters.subcategory });
    }

    if (filters.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.isOnSale !== undefined) {
      query.andWhere('product.isOnSale = :isOnSale', { isOnSale: filters.isOnSale });
    }

    if (filters.search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.brand ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      query.andWhere('product.tags && :tags', { tags: filters.tags });
    }

    if (filters.supplierIds && filters.supplierIds.length > 0) {
      query.andWhere('product.supplierId IN (:...supplierIds)', { supplierIds: filters.supplierIds });
    }

    // Filter by approved suppliers if buyerId is provided
    if (buyerId && filters.approvedSuppliersOnly !== false) {
      const approvedSupplierIds = await this.getApprovedSupplierIds(buyerId);
      if (approvedSupplierIds.length > 0) {
        query.andWhere('product.supplierId IN (:...approvedSupplierIds)', { approvedSupplierIds });
      } else {
        // No approved suppliers, return empty result
        return {
          products: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        };
      }
    }

    // Get total count
    const total = await query.getCount();

    // Apply pagination
    const products = await query
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get products on sale
   */
  async getProductsOnSale(
    filters: Omit<ProductFilters, 'isOnSale'> = {},
    page = 1,
    pageSize = 20,
    buyerId?: string,
  ): Promise<PaginatedProducts> {
    return this.getProducts(
      { ...filters, isOnSale: true },
      page,
      pageSize,
      buyerId,
    );
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: ProductCategory,
    filters: Omit<ProductFilters, 'category'> = {},
    page = 1,
    pageSize = 20,
    buyerId?: string,
  ): Promise<PaginatedProducts> {
    return this.getProducts(
      { ...filters, category },
      page,
      pageSize,
      buyerId,
    );
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string, buyerId?: string): Promise<Product> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.id = :id', { id })
      .andWhere('product.isActive = :isActive', { isActive: true });

    // Check if supplier is approved for buyer
    if (buyerId) {
      const approvedSupplierIds = await this.getApprovedSupplierIds(buyerId);
      query.andWhere('product.supplierId IN (:...approvedSupplierIds)', { approvedSupplierIds });
    }

    const product = await query.getOne();

    if (!product) {
      throw new Error('Product not found or supplier not approved');
    }

    return product;
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<{ category: ProductCategory; count: number }[]> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('product.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('product.isActive = :isActive', { isActive: true })
      .groupBy('product.category')
      .getRawMany();

    return result.map(item => ({
      category: item.category,
      count: parseInt(item.count),
    }));
  }

  /**
   * Get subcategories for a category
   */
  async getSubcategories(category: ProductCategory): Promise<{ subcategory: string; count: number }[]> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('product.subcategory', 'subcategory')
      .addSelect('COUNT(*)', 'count')
      .where('product.category = :category', { category })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .andWhere('product.subcategory IS NOT NULL')
      .groupBy('product.subcategory')
      .getRawMany();

    return result.map(item => ({
      subcategory: item.subcategory,
      count: parseInt(item.count),
    }));
  }

  /**
   * Get popular products
   */
  async getPopularProducts(
    limit = 10,
    buyerId?: string,
  ): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.salesCount', 'DESC')
      .addOrderBy('product.rating', 'DESC')
      .limit(limit);

    // Filter by approved suppliers if buyerId is provided
    if (buyerId) {
      const approvedSupplierIds = await this.getApprovedSupplierIds(buyerId);
      if (approvedSupplierIds.length > 0) {
        query.andWhere('product.supplierId IN (:...approvedSupplierIds)', { approvedSupplierIds });
      } else {
        return [];
      }
    }

    return query.getMany();
  }

  /**
   * Get recently added products
   */
  async getRecentProducts(
    limit = 10,
    buyerId?: string,
  ): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.createdAt', 'DESC')
      .limit(limit);

    // Filter by approved suppliers if buyerId is provided
    if (buyerId) {
      const approvedSupplierIds = await this.getApprovedSupplierIds(buyerId);
      if (approvedSupplierIds.length > 0) {
        query.andWhere('product.supplierId IN (:...approvedSupplierIds)', { approvedSupplierIds });
      } else {
        return [];
      }
    }

    return query.getMany();
  }

  /**
   * Search products
   */
  async searchProducts(
    searchTerm: string,
    filters: Omit<ProductFilters, 'search'> = {},
    page = 1,
    pageSize = 20,
    buyerId?: string,
  ): Promise<PaginatedProducts> {
    return this.getProducts(
      { ...filters, search: searchTerm },
      page,
      pageSize,
      buyerId,
    );
  }

  /**
   * Get approved supplier IDs for a buyer
   */
  private async getApprovedSupplierIds(buyerId: string): Promise<string[]> {
    const approvals = await this.supplierApprovalRepository.find({
      where: {
        buyerId,
        status: ApprovalStatus.APPROVED,
      },
      select: ['supplierId'],
    });

    return approvals.map(approval => approval.supplierId);
  }

  /**
   * Get product statistics
   */
  async getProductStats(buyerId?: string): Promise<{
    totalProducts: number;
    productsOnSale: number;
    averagePrice: number;
    categoriesCount: number;
    topCategories: { category: ProductCategory; count: number }[];
  }> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });

    // Filter by approved suppliers if buyerId is provided
    if (buyerId) {
      const approvedSupplierIds = await this.getApprovedSupplierIds(buyerId);
      if (approvedSupplierIds.length > 0) {
        query.andWhere('product.supplierId IN (:...approvedSupplierIds)', { approvedSupplierIds });
      } else {
        return {
          totalProducts: 0,
          productsOnSale: 0,
          averagePrice: 0,
          categoriesCount: 0,
          topCategories: [],
        };
      }
    }

    const [totalProducts, productsOnSale, averagePrice, categoriesCount, topCategories] = await Promise.all([
      query.getCount(),
      query.clone().andWhere('product.isOnSale = :isOnSale', { isOnSale: true }).getCount(),
      query.clone().select('AVG(product.price)', 'avg').getRawOne().then(result => parseFloat(result.avg) || 0),
      query.clone().select('COUNT(DISTINCT product.category)', 'count').getRawOne().then(result => parseInt(result.count) || 0),
      this.getCategories(),
    ]);

    return {
      totalProducts,
      productsOnSale,
      averagePrice,
      categoriesCount,
      topCategories: topCategories.slice(0, 5),
    };
  }
}
