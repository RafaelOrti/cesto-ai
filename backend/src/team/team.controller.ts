import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('members')
  @ApiOperation({ summary: 'Get team members' })
  async getMembers(
    @Request() req,
    @Query('status') status?: string,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.teamService.getMembers(req.user.userId, {
      status,
      role,
      search,
    });
  }

  @Get('members/:id')
  @ApiOperation({ summary: 'Get team member by ID' })
  async getMemberById(@Request() req, @Param('id') id: string) {
    return this.teamService.getMemberById(req.user.userId, id);
  }

  @Post('members/invite')
  @ApiOperation({ summary: 'Invite team member' })
  async inviteMember(@Request() req, @Body() inviteData: any) {
    return this.teamService.inviteMember(req.user.userId, inviteData);
  }

  @Put('members/:id')
  @ApiOperation({ summary: 'Update team member' })
  async updateMember(
    @Request() req,
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.teamService.updateMember(req.user.userId, id, updateData);
  }

  @Delete('members/:id')
  @ApiOperation({ summary: 'Remove team member' })
  async removeMember(@Request() req, @Param('id') id: string) {
    return this.teamService.removeMember(req.user.userId, id);
  }

  @Post('members/:id/activate')
  @ApiOperation({ summary: 'Activate team member' })
  async activateMember(@Request() req, @Param('id') id: string) {
    return this.teamService.activateMember(req.user.userId, id);
  }

  @Post('members/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate team member' })
  async deactivateMember(@Request() req, @Param('id') id: string) {
    return this.teamService.deactivateMember(req.user.userId, id);
  }

  @Get('invitations')
  @ApiOperation({ summary: 'Get team invitations' })
  async getInvitations(
    @Request() req,
    @Query('status') status?: string,
  ) {
    return this.teamService.getInvitations(req.user.userId, { status });
  }

  @Post('invitations/:id/resend')
  @ApiOperation({ summary: 'Resend invitation' })
  async resendInvitation(@Request() req, @Param('id') id: string) {
    return this.teamService.resendInvitation(req.user.userId, id);
  }

  @Delete('invitations/:id')
  @ApiOperation({ summary: 'Cancel invitation' })
  async cancelInvitation(@Request() req, @Param('id') id: string) {
    return this.teamService.cancelInvitation(req.user.userId, id);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get team activity log' })
  async getActivity(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('memberId') memberId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.teamService.getActivity(req.user.userId, {
      page,
      limit,
      memberId,
      startDate,
      endDate,
    });
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get available permissions' })
  async getPermissions(@Request() req) {
    return this.teamService.getPermissions();
  }

  @Get('plan')
  @ApiOperation({ summary: 'Get current team plan' })
  async getPlan(@Request() req) {
    return this.teamService.getPlan(req.user.userId);
  }

  @Post('plan/upgrade')
  @ApiOperation({ summary: 'Upgrade team plan' })
  async upgradePlan(@Request() req, @Body() planData: any) {
    return this.teamService.upgradePlan(req.user.userId, planData);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get team statistics' })
  async getStats(@Request() req) {
    return this.teamService.getStats(req.user.userId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export team data' })
  async exportTeamData(
    @Request() req,
    @Query('format') format: string,
  ) {
    return this.teamService.exportTeamData(req.user.userId, format);
  }
}






