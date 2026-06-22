import { Module } from '@nestjs/common';

import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { NotificationsRepository } from './repositories/notifications.repository';

import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/integrations/socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
