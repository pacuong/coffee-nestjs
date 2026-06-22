import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { ProductsModule } from 'src/modules/products/products.module';
import { ProductVariantsModule } from 'src/modules/productVariants/product-variants.module';
import { CartModule } from 'src/modules/carts/cart.module';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { IngredientsModule } from 'src/modules/ingredients/ingredients.module';
import { InventoryModule } from 'src/modules/Inventory/inventory.module';
import { RecipesModule } from 'src/modules/recipes/recipes.module';

import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CloudinaryModule } from 'src/integrations/cloudinary/cloudinary.module';
import { PaymentsModule } from 'src/modules/payments/payments.module';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    ProductsModule,
    ProductVariantsModule,
    CartModule,
    OrdersModule,
    IngredientsModule,
    InventoryModule,
    RecipesModule,
    CloudinaryModule,
    PaymentsModule,
    StatisticsModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
})
export class AppModule {}
