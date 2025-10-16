import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingMethod } from '../entities/shipping-method.entity';

@Injectable()
export class ShippingMethodService {
  constructor(
    @InjectRepository(ShippingMethod)
    private shippingMethodRepository: Repository<ShippingMethod>,
  ) {}

  async getShippingMethodsBySupplier(supplierId: string) {
    return this.shippingMethodRepository.find({
      where: { supplierId, isActive: true },
      order: { cost: 'ASC' },
    });
  }

  async getShippingMethodById(id: string) {
    return this.shippingMethodRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async calculateShippingCost(
    supplierId: string,
    orderAmount: number,
    shippingMethodId?: string,
  ) {
    let shippingMethods = await this.getShippingMethodsBySupplier(supplierId);

    if (shippingMethodId) {
      const selectedMethod = shippingMethods.find(m => m.id === shippingMethodId);
      if (selectedMethod) {
        shippingMethods = [selectedMethod];
      }
    }

    const options = shippingMethods.map((method) => {
      let cost = method.cost;

      // Apply free shipping threshold
      if (method.freeShippingThreshold && orderAmount >= method.freeShippingThreshold) {
        cost = 0;
      }

      return {
        id: method.id,
        name: method.name,
        description: method.description,
        cost,
        estimatedDaysMin: method.estimatedDaysMin,
        estimatedDaysMax: method.estimatedDaysMax,
        isFreeShipping: cost === 0,
        freeShippingThreshold: method.freeShippingThreshold,
      };
    });

    // Sort by cost
    options.sort((a, b) => a.cost - b.cost);

    return {
      options,
      cheapest: options[0],
      fastest: options.reduce((fastest, current) => {
        return current.estimatedDaysMin < fastest.estimatedDaysMin ? current : fastest;
      }),
    };
  }

  async createShippingMethod(shippingMethodData: any) {
    const shippingMethod = this.shippingMethodRepository.create(shippingMethodData);
    return this.shippingMethodRepository.save(shippingMethod);
  }

  async updateShippingMethod(id: string, shippingMethodData: any) {
    return this.shippingMethodRepository.update(id, shippingMethodData);
  }

  async deleteShippingMethod(id: string) {
    return this.shippingMethodRepository.update(id, { isActive: false });
  }
}
