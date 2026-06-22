import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

import { NotificationsService } from '../services/notifications.service';

import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findMine(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.findMyNotifications(user.sub);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
