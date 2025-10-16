import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async getAllPaymentMethods() {
    return this.paymentMethodRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getPaymentMethodById(id: string) {
    return this.paymentMethodRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async getPaymentMethodByType(type: string) {
    return this.paymentMethodRepository.findOne({
      where: { type, isActive: true },
    });
  }

  async createPaymentMethod(paymentMethodData: any) {
    const paymentMethod = this.paymentMethodRepository.create(paymentMethodData);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async updatePaymentMethod(id: string, paymentMethodData: any) {
    return this.paymentMethodRepository.update(id, paymentMethodData);
  }

  async deletePaymentMethod(id: string) {
    return this.paymentMethodRepository.update(id, { isActive: false });
  }

  async calculateProcessingFee(paymentMethodId: string, amount: number) {
    const paymentMethod = await this.getPaymentMethodById(paymentMethodId);
    
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    const percentageFee = (amount * paymentMethod.processingFeePercentage) / 100;
    const totalFee = percentageFee + paymentMethod.processingFeeFixed;

    return {
      processingFee: totalFee,
      netAmount: amount - totalFee,
      feeBreakdown: {
        percentageFee,
        fixedFee: paymentMethod.processingFeeFixed,
        percentage: paymentMethod.processingFeePercentage,
      },
    };
  }
}
