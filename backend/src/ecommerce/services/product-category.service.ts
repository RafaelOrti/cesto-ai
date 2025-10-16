import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../entities/product-category.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async getAllCategories() {
    return this.productCategoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async getCategoryById(id: string) {
    return this.productCategoryRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async getCategoryTree() {
    const categories = await this.productCategoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    // Build tree structure
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach((category) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    return rootCategories;
  }

  async getSubcategories(parentId: string) {
    return this.productCategoryRepository.find({
      where: { parentId, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async createCategory(categoryData: any) {
    const category = this.productCategoryRepository.create(categoryData);
    return this.productCategoryRepository.save(category);
  }

  async updateCategory(id: string, categoryData: any) {
    return this.productCategoryRepository.update(id, categoryData);
  }

  async deleteCategory(id: string) {
    return this.productCategoryRepository.update(id, { isActive: false });
  }

  async getCategoryStats() {
    const categories = await this.productCategoryRepository.find({
      where: { isActive: true },
    });

    return {
      totalCategories: categories.length,
      rootCategories: categories.filter(c => !c.parentId).length,
      subcategories: categories.filter(c => c.parentId).length,
    };
  }
}
