import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList, ShoppingListType, ShoppingListStatus } from '../entities/shopping-list.entity';
import { ShoppingListItem, ItemPriority, ItemStatus } from '../entities/shopping-list-item.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

export interface CreateShoppingListDto {
  name: string;
  description?: string;
  type: ShoppingListType;
  isShared?: boolean;
  sharedWith?: string[];
  reminderDate?: Date;
  preferences?: {
    autoReorder: boolean;
    notificationFrequency: 'daily' | 'weekly' | 'monthly';
    priceAlerts: boolean;
    stockAlerts: boolean;
    seasonalReminders: boolean;
  };
}

export interface AddItemToListDto {
  productId: string;
  quantity: number;
  notes?: string;
  priority?: ItemPriority;
  reminderDate?: Date;
  expectedPrice?: number;
}

export interface UpdateItemDto {
  quantity?: number;
  notes?: string;
  priority?: ItemPriority;
  reminderDate?: Date;
  expectedPrice?: number;
}

export interface ShoppingListWithInsights extends ShoppingList {
  totalItems: number;
  purchasedItems: number;
  pendingItems: number;
  estimatedTotal: number;
  actualTotal: number;
  aiRecommendations: {
    suggestedItems: any[];
    priceAlerts: any[];
    restockPredictions: any[];
    seasonalInsights: any[];
  };
}

@Injectable()
export class EnhancedShoppingListService {
  private readonly logger = new Logger(EnhancedShoppingListService.name);

  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(ShoppingListItem)
    private shoppingListItemRepository: Repository<ShoppingListItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  /**
   * Create a new shopping list
   */
  async createShoppingList(
    buyerId: string,
    createDto: CreateShoppingListDto
  ): Promise<ShoppingList> {
    const shoppingList = this.shoppingListRepository.create({
      ...createDto,
      buyerId,
      status: ShoppingListStatus.ACTIVE,
    });

    return this.shoppingListRepository.save(shoppingList);
  }

  /**
   * Get all shopping lists for a buyer with insights
   */
  async getShoppingListsWithInsights(buyerId: string): Promise<ShoppingListWithInsights[]> {
    const lists = await this.shoppingListRepository.find({
      where: { buyerId, isActive: true },
      relations: ['items', 'items.product'],
      order: { updatedAt: 'DESC' },
    });

    const listsWithInsights = await Promise.all(
      lists.map(async (list) => this.enrichListWithInsights(list))
    );

    return listsWithInsights;
  }

  /**
   * Get a specific shopping list with insights
   */
  async getShoppingListWithInsights(
    listId: string,
    buyerId: string
  ): Promise<ShoppingListWithInsights> {
    const list = await this.shoppingListRepository.findOne({
      where: { id: listId, buyerId },
      relations: ['items', 'items.product'],
    });

    if (!list) {
      throw new Error('Shopping list not found');
    }

    return this.enrichListWithInsights(list);
  }

  /**
   * Add item to shopping list
   */
  async addItemToList(
    listId: string,
    buyerId: string,
    addItemDto: AddItemToListDto
  ): Promise<ShoppingListItem> {
    // Verify list exists and belongs to buyer
    const list = await this.shoppingListRepository.findOne({
      where: { id: listId, buyerId },
    });

    if (!list) {
      throw new Error('Shopping list not found');
    }

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: addItemDto.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if item already exists in list
    const existingItem = await this.shoppingListItemRepository.findOne({
      where: { shoppingListId: listId, productId: addItemDto.productId },
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += addItemDto.quantity;
      existingItem.notes = addItemDto.notes || existingItem.notes;
      existingItem.priority = addItemDto.priority || existingItem.priority;
      existingItem.reminderDate = addItemDto.reminderDate || existingItem.reminderDate;
      existingItem.expectedPrice = addItemDto.expectedPrice || existingItem.expectedPrice;
      
      return this.shoppingListItemRepository.save(existingItem);
    }

    // Create new item
    const item = this.shoppingListItemRepository.create({
      ...addItemDto,
      shoppingListId: listId,
      status: ItemStatus.PENDING,
    });

    const savedItem = await this.shoppingListItemRepository.save(item);

    // Update list usage
    await this.updateListUsage(listId);

    // Generate AI insights for the item
    await this.generateItemInsights(savedItem.id);

    return savedItem;
  }

  /**
   * Update item in shopping list
   */
  async updateItem(
    itemId: string,
    buyerId: string,
    updateDto: UpdateItemDto
  ): Promise<ShoppingListItem> {
    const item = await this.shoppingListItemRepository.findOne({
      where: { id: itemId },
      relations: ['shoppingList'],
    });

    if (!item || item.shoppingList.buyerId !== buyerId) {
      throw new Error('Item not found');
    }

    Object.assign(item, updateDto);
    return this.shoppingListItemRepository.save(item);
  }

  /**
   * Remove item from shopping list
   */
  async removeItemFromList(
    itemId: string,
    buyerId: string
  ): Promise<void> {
    const item = await this.shoppingListItemRepository.findOne({
      where: { id: itemId },
      relations: ['shoppingList'],
    });

    if (!item || item.shoppingList.buyerId !== buyerId) {
      throw new Error('Item not found');
    }

    await this.shoppingListItemRepository.remove(item);
    await this.updateListUsage(item.shoppingListId);
  }

  /**
   * Move item to "Buy Later" (Saved for Later)
   */
  async moveToBuyLater(
    itemId: string,
    buyerId: string
  ): Promise<void> {
    const item = await this.shoppingListItemRepository.findOne({
      where: { id: itemId },
      relations: ['shoppingList'],
    });

    if (!item || item.shoppingList.buyerId !== buyerId) {
      throw new Error('Item not found');
    }

    // Create or find "Buy Later" list
    let buyLaterList = await this.shoppingListRepository.findOne({
      where: { 
        buyerId, 
        type: ShoppingListType.SAVED_FOR_LATER,
        status: ShoppingListStatus.ACTIVE
      },
    });

    if (!buyLaterList) {
      buyLaterList = await this.createShoppingList(buyerId, {
        name: 'Buy Later',
        type: ShoppingListType.SAVED_FOR_LATER,
        description: 'Items saved for later purchase',
      });
    }

    // Move item to Buy Later list
    item.shoppingListId = buyLaterList.id;
    item.status = ItemStatus.PENDING;
    await this.shoppingListItemRepository.save(item);

    await this.updateListUsage(item.shoppingListId);
  }

  /**
   * Mark item as purchased
   */
  async markItemAsPurchased(
    itemId: string,
    buyerId: string,
    actualPrice?: number
  ): Promise<void> {
    const item = await this.shoppingListItemRepository.findOne({
      where: { id: itemId },
      relations: ['shoppingList'],
    });

    if (!item || item.shoppingList.buyerId !== buyerId) {
      throw new Error('Item not found');
    }

    item.isPurchased = true;
    item.status = ItemStatus.PURCHASED;
    item.purchasedAt = new Date();
    if (actualPrice) {
      item.actualPrice = actualPrice;
    }

    await this.shoppingListItemRepository.save(item);
    await this.updateListUsage(item.shoppingListId);
  }

  /**
   * Get AI recommendations for shopping list
   */
  async getAIRecommendations(
    listId: string,
    buyerId: string
  ): Promise<any> {
    const list = await this.getShoppingListWithInsights(listId, buyerId);
    
    // Get purchase history for similar items
    const purchaseHistory = await this.getPurchaseHistory(buyerId);
    
    // Generate recommendations based on:
    // 1. Purchase patterns
    // 2. Seasonal trends
    // 3. Price trends
    // 4. Stock availability
    // 5. Supplier relationships

    const recommendations = {
      suggestedItems: await this.getSuggestedItems(list, purchaseHistory),
      priceAlerts: await this.getPriceAlerts(list),
      restockPredictions: await this.getRestockPredictions(list),
      seasonalInsights: await this.getSeasonalInsights(list),
    };

    return recommendations;
  }

  /**
   * Set reminder for shopping list
   */
  async setReminder(
    listId: string,
    buyerId: string,
    reminderDate: Date
  ): Promise<void> {
    const list = await this.shoppingListRepository.findOne({
      where: { id: listId, buyerId },
    });

    if (!list) {
      throw new Error('Shopping list not found');
    }

    list.reminderDate = reminderDate;
    await this.shoppingListRepository.save(list);
  }

  /**
   * Share shopping list with other users
   */
  async shareShoppingList(
    listId: string,
    buyerId: string,
    sharedWith: string[]
  ): Promise<void> {
    const list = await this.shoppingListRepository.findOne({
      where: { id: listId, buyerId },
    });

    if (!list) {
      throw new Error('Shopping list not found');
    }

    list.isShared = true;
    list.sharedWith = sharedWith;
    await this.shoppingListRepository.save(list);
  }

  /**
   * Duplicate shopping list
   */
  async duplicateShoppingList(
    listId: string,
    buyerId: string,
    newName: string
  ): Promise<ShoppingList> {
    const originalList = await this.shoppingListRepository.findOne({
      where: { id: listId, buyerId },
      relations: ['items'],
    });

    if (!originalList) {
      throw new Error('Shopping list not found');
    }

    const newList = this.shoppingListRepository.create({
      name: newName,
      description: originalList.description,
      type: originalList.type,
      buyerId,
      status: ShoppingListStatus.ACTIVE,
      preferences: originalList.preferences,
    });

    const savedList = await this.shoppingListRepository.save(newList);

    // Copy items
    const items = originalList.items.map(item => 
      this.shoppingListItemRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes,
        priority: item.priority,
        reminderDate: item.reminderDate,
        expectedPrice: item.expectedPrice,
        shoppingListId: savedList.id,
      })
    );

    await this.shoppingListItemRepository.save(items);

    return savedList;
  }

  // Private helper methods
  private async enrichListWithInsights(list: ShoppingList): Promise<ShoppingListWithInsights> {
    const totalItems = list.items.length;
    const purchasedItems = list.items.filter(item => item.isPurchased).length;
    const pendingItems = totalItems - purchasedItems;

    const estimatedTotal = list.items.reduce((sum, item) => {
      return sum + (item.expectedPrice || 0) * item.quantity;
    }, 0);

    const actualTotal = list.items.reduce((sum, item) => {
      return sum + (item.actualPrice || 0) * item.quantity;
    }, 0);

    const aiRecommendations = await this.getAIRecommendations(list.id, list.buyerId);

    return {
      ...list,
      totalItems,
      purchasedItems,
      pendingItems,
      estimatedTotal,
      actualTotal,
      aiRecommendations,
    };
  }

  private async updateListUsage(listId: string): Promise<void> {
    const list = await this.shoppingListRepository.findOne({
      where: { id: listId },
    });

    if (list) {
      list.usageCount += 1;
      list.lastUsedDate = new Date();
      await this.shoppingListRepository.save(list);
    }
  }

  private async generateItemInsights(itemId: string): Promise<void> {
    // This would integrate with AI service to generate insights
    // For now, we'll create placeholder insights
    const item = await this.shoppingListItemRepository.findOne({
      where: { id: itemId },
      relations: ['product'],
    });

    if (item) {
      item.aiInsights = {
        predictedRestockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        confidence: 0.75,
        pricePrediction: item.expectedPrice || item.product?.price || 0,
        seasonalDemand: 'medium',
        alternativeProducts: [],
      };

      await this.shoppingListItemRepository.save(item);
    }
  }

  private async getPurchaseHistory(buyerId: string): Promise<any[]> {
    // Get recent purchase history for AI recommendations
    return this.orderRepository.find({
      where: { buyerId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  private async getSuggestedItems(list: ShoppingListWithInsights, purchaseHistory: any[]): Promise<any[]> {
    // AI logic to suggest items based on purchase patterns
    return [];
  }

  private async getPriceAlerts(list: ShoppingListWithInsights): Promise<any[]> {
    // Check for price changes and alerts
    return [];
  }

  private async getRestockPredictions(list: ShoppingListWithInsights): Promise<any[]> {
    // Predict when items might need restocking
    return [];
  }

  private async getSeasonalInsights(list: ShoppingListWithInsights): Promise<any[]> {
    // Provide seasonal shopping insights
    return [];
  }
}

