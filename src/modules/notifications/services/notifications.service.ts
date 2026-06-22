import { Injectable } from '@nestjs/common';

import { NotificationsRepository } from '../repositories/notifications.repository';
import { SocketService } from 'src/integrations/socket/socket.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepo: NotificationsRepository,
    private readonly socketService: SocketService,
  ) {}

  async create(userId: string, title: string, message: string) {
    const notification = await this.notificationRepo.create(
      userId,
      title,
      message,
    );

    this.socketService.emitNotification(userId, notification);

    return notification;
  }

  findMyNotifications(userId: string) {
    return this.notificationRepo.findByUser(userId);
  }

  markAsRead(id: string) {
    return this.notificationRepo.markAsRead(id);
  }
}
