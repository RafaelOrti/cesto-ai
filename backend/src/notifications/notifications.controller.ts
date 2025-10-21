import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  async getNotifications(
    @Request() req,
    @Query('unread') unread?: boolean,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.notificationsService.getNotifications(req.user.userId, {
      unread,
      page,
      limit,
    });
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.userId, id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  async deleteNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(req.user.userId, id);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get notification settings' })
  async getSettings(@Request() req) {
    return this.notificationsService.getSettings(req.user.userId);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update notification settings' })
  async updateSettings(@Request() req, @Body() settings: any) {
    return this.notificationsService.updateSettings(req.user.userId, settings);
  }
}






