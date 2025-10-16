import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignType, CampaignStatus } from '../entities/campaign.entity';

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  /**
   * Create personalized offers, packs, discounts
   * Based on comments: "HAY QUE DAR LA POSIBILIDAD DE PODER CREAR OFERTAS PERSONALIZADAS, PACKS, DESCUENTOS..."
   */
  async createCampaign(
    supplierId: string,
    campaignData: {
      name: string;
      type: string;
      discount_percentage?: number;
      discount_amount?: number;
      min_order_quantity?: number;
      start_date?: Date;
      end_date?: Date;
      conditions?: any;
    }
  ): Promise<Campaign> {
    this.logger.log(`Creating campaign "${campaignData.name}" for supplier ${supplierId}`);

    const campaign = this.campaignRepository.create({
      name: campaignData.name,
      type: campaignData.type as CampaignType,
      discount_percentage: campaignData.discount_percentage,
      discount_amount: campaignData.discount_amount,
      min_order_quantity: campaignData.min_order_quantity,
      start_date: campaignData.start_date,
      end_date: campaignData.end_date,
      conditions: campaignData.conditions,
      supplier_id: supplierId,
      status: CampaignStatus.DRAFT
    });

    return this.campaignRepository.save(campaign);
  }

  /**
   * Get campaigns by supplier
   */
  async getCampaignsBySupplier(supplierId: string): Promise<Campaign[]> {
    return this.campaignRepository.find({
      where: { supplier_id: supplierId },
      order: { created_at: 'DESC' }
    });
  }

  /**
   * Get active campaigns count
   */
  async getActiveCampaignsCount(supplierId: string): Promise<number> {
    return this.campaignRepository.count({
      where: {
        supplier_id: supplierId,
        status: CampaignStatus.ACTIVE,
        is_active: true
      }
    });
  }

  /**
   * Activate campaign
   */
  async activateCampaign(campaignId: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId }
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = CampaignStatus.ACTIVE;
    campaign.is_active = true;

    return this.campaignRepository.save(campaign);
  }

  /**
   * Deactivate campaign
   */
  async deactivateCampaign(campaignId: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId }
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = CampaignStatus.PAUSED;
    campaign.is_active = false;

    return this.campaignRepository.save(campaign);
  }

  /**
   * Create personalized pack offer
   */
  async createPackOffer(
    supplierId: string,
    packData: {
      name: string;
      products: Array<{ product_id: string; quantity: number }>;
      discount_percentage: number;
      pack_price?: number;
      min_packs?: number;
      max_packs?: number;
    }
  ): Promise<Campaign> {
    this.logger.log(`Creating pack offer "${packData.name}" for supplier ${supplierId}`);

    const campaign = this.campaignRepository.create({
      name: packData.name,
      type: CampaignType.PACK,
      discount_percentage: packData.discount_percentage,
      min_order_quantity: packData.min_packs,
      max_order_quantity: packData.max_packs,
      supplier_id: supplierId,
      conditions: {
        pack_products: packData.products,
        pack_price: packData.pack_price,
        type: 'pack_offer'
      },
      status: CampaignStatus.DRAFT
    });

    return this.campaignRepository.save(campaign);
  }

  /**
   * Create seasonal discount
   */
  async createSeasonalDiscount(
    supplierId: string,
    seasonalData: {
      name: string;
      discount_percentage: number;
      season: string;
      start_date: Date;
      end_date: Date;
      applicable_products?: string[];
    }
  ): Promise<Campaign> {
    this.logger.log(`Creating seasonal discount "${seasonalData.name}" for supplier ${supplierId}`);

    const campaign = this.campaignRepository.create({
      name: seasonalData.name,
      type: CampaignType.SEASONAL,
      discount_percentage: seasonalData.discount_percentage,
      start_date: seasonalData.start_date,
      end_date: seasonalData.end_date,
      supplier_id: supplierId,
      conditions: {
        season: seasonalData.season,
        applicable_products: seasonalData.applicable_products,
        type: 'seasonal_discount'
      },
      status: CampaignStatus.DRAFT
    });

    return this.campaignRepository.save(campaign);
  }
}


