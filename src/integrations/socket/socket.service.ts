import { Injectable } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly gateway: SocketGateway) {}

  emitOrderStatusUpdated(userId: string, orderId: string, status: string) {
    this.gateway.server.to(`user:${userId}`).emit('order.updated', {
      orderId,
      status,
    });
  }

  emitNotification(userId: string, notification: any) {
    this.gateway.server
      .to(`user:${userId}`)
      .emit('notification.created', notification);
  }

  emitDashboardUpdated(data: any) {
    this.gateway.server.emit('dashboard.updated', data);
  }
}
