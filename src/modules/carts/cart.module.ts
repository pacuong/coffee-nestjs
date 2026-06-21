import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';

import { CartRepository } from './repositories/cart.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { ProductVariantsRepository } from 'src/modules/productVariants/repositories/product-variants.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository,
    CartItemRepository,
    ProductVariantsRepository,
  ],
  exports: [CartRepository],
})
export class CartModule {}
