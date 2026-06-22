import { Module } from '@nestjs/common';

import { ToppingsController } from './controllers/toppings.controller';

import { ToppingsService } from './services/toppings.service';

import { ToppingsRepository } from './repositories/toppings.repository';

import { PrismaModule } from 'src/prisma/prisma.module';

import { CloudinaryModule } from 'src/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],

  controllers: [ToppingsController],

  providers: [ToppingsService, ToppingsRepository],

  exports: [ToppingsService, ToppingsRepository],
})
export class ToppingsModule {}
