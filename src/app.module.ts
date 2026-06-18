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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
  ],
})
export class AppModule {}
