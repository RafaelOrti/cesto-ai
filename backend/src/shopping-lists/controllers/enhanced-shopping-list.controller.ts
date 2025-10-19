import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EnhancedShoppingListService, CreateShoppingListDto, AddItemToListDto, UpdateItemDto } from '../services/enhanced-shopping-list.service';

@ApiTags('enhanced-shopping-lists')
@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EnhancedShoppingListController {
  constructor(
    private readonly shoppingListService: EnhancedShoppingListService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shopping list' })
  @ApiResponse({ status: 201, description: 'Shopping list created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createShoppingList(
    @Body() createDto: CreateShoppingListDto,
    @Request() req: any,
  ) {
    return this.shoppingListService.createShoppingList(req.user.id, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shopping lists with insights' })
  @ApiResponse({ status: 200, description: 'Shopping lists retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getShoppingLists(@Request() req: any) {
    return this.shoppingListService.getShoppingListsWithInsights(req.user.id);
  }

  @Get(':listId')
  @ApiOperation({ summary: 'Get specific shopping list with insights' })
  @ApiResponse({ status: 200, description: 'Shopping list retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Shopping list not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getShoppingList(
    @Param('listId') listId: string,
    @Request() req: any,
  ) {
    return this.shoppingListService.getShoppingListWithInsights(listId, req.user.id);
  }

  @Post(':listId/items')
  @ApiOperation({ summary: 'Add item to shopping list' })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addItemToList(
    @Param('listId') listId: string,
    @Body() addItemDto: AddItemToListDto,
    @Request() req: any,
  ) {
    return this.shoppingListService.addItemToList(listId, req.user.id, addItemDto);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update item in shopping list' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateItemDto,
    @Request() req: any,
  ) {
    return this.shoppingListService.updateItem(itemId, req.user.id, updateDto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from shopping list' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeItemFromList(
    @Param('itemId') itemId: string,
    @Request() req: any,
  ) {
    await this.shoppingListService.removeItemFromList(itemId, req.user.id);
    return { message: 'Item removed successfully' };
  }

  @Post('items/:itemId/move-to-buy-later')
  @ApiOperation({ summary: 'Move item to Buy Later list' })
  @ApiResponse({ status: 200, description: 'Item moved to Buy Later successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async moveToBuyLater(
    @Param('itemId') itemId: string,
    @Request() req: any,
  ) {
    await this.shoppingListService.moveToBuyLater(itemId, req.user.id);
    return { message: 'Item moved to Buy Later successfully' };
  }

  @Post('items/:itemId/mark-purchased')
  @ApiOperation({ summary: 'Mark item as purchased' })
  @ApiResponse({ status: 200, description: 'Item marked as purchased successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markItemAsPurchased(
    @Param('itemId') itemId: string,
    @Body() body: { actualPrice?: number },
    @Request() req: any,
  ) {
    await this.shoppingListService.markItemAsPurchased(itemId, req.user.id, body.actualPrice);
    return { message: 'Item marked as purchased successfully' };
  }

  @Get(':listId/ai-recommendations')
  @ApiOperation({ summary: 'Get AI recommendations for shopping list' })
  @ApiResponse({ status: 200, description: 'AI recommendations retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Shopping list not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAIRecommendations(
    @Param('listId') listId: string,
    @Request() req: any,
  ) {
    return this.shoppingListService.getAIRecommendations(listId, req.user.id);
  }

  @Post(':listId/reminder')
  @ApiOperation({ summary: 'Set reminder for shopping list' })
  @ApiResponse({ status: 200, description: 'Reminder set successfully' })
  @ApiResponse({ status: 404, description: 'Shopping list not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async setReminder(
    @Param('listId') listId: string,
    @Body() body: { reminderDate: string },
    @Request() req: any,
  ) {
    await this.shoppingListService.setReminder(listId, req.user.id, new Date(body.reminderDate));
    return { message: 'Reminder set successfully' };
  }

  @Post(':listId/share')
  @ApiOperation({ summary: 'Share shopping list with other users' })
  @ApiResponse({ status: 200, description: 'Shopping list shared successfully' })
  @ApiResponse({ status: 404, description: 'Shopping list not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async shareShoppingList(
    @Param('listId') listId: string,
    @Body() body: { sharedWith: string[] },
    @Request() req: any,
  ) {
    await this.shoppingListService.shareShoppingList(listId, req.user.id, body.sharedWith);
    return { message: 'Shopping list shared successfully' };
  }

  @Post(':listId/duplicate')
  @ApiOperation({ summary: 'Duplicate shopping list' })
  @ApiResponse({ status: 201, description: 'Shopping list duplicated successfully' })
  @ApiResponse({ status: 404, description: 'Shopping list not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async duplicateShoppingList(
    @Param('listId') listId: string,
    @Body() body: { newName: string },
    @Request() req: any,
  ) {
    return this.shoppingListService.duplicateShoppingList(listId, req.user.id, body.newName);
  }
}

