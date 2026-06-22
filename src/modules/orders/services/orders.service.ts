import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  Prisma,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CartRepository } from '../../carts/repositories/cart.repository';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';
import { getCartCacheKey } from 'src/common/helpers/cart-cache.helper';
import { RedisService } from 'src/integrations/redis/redis.service';
import { SocketService } from 'src/integrations/socket/socket.service';
import { NotificationsService } from 'src/modules/notifications/services/notifications.service';
import { StatisticsService } from 'src/modules/statistics/services/statistics.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartRepo: CartRepository,
    private readonly orderRepo: OrdersRepository,
    private readonly redis: RedisService,
    private readonly socketService: SocketService,
    private readonly notificationsService: NotificationsService,
    private readonly statisticsService: StatisticsService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const cart = await this.cartRepo.findByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      for (const cartItem of cart.items) {
        const recipe = cartItem.variant.recipe;

        if (!recipe) {
          throw new BadRequestException(
            `${cartItem.variant.name} has no recipe`,
          );
        }

        for (const recipeItem of recipe.items) {
          const inventory = recipeItem.ingredient.inventory;

          if (!inventory) {
            throw new BadRequestException(
              `${recipeItem.ingredient.name} inventory not found`,
            );
          }

          const required = Number(recipeItem.quantity) * cartItem.quantity;

          const available = Number(inventory.quantity);

          if (available < required) {
            throw new BadRequestException(
              `${recipeItem.ingredient.name} is out of stock`,
            );
          }
        }
      }

      for (const cartItem of cart.items) {
        const recipe = cartItem.variant.recipe;

        if (!recipe) {
          throw new BadRequestException(
            `${cartItem.variant.name} has no recipe`,
          );
        }

        for (const recipeItem of recipe.items) {
          const inventory = recipeItem.ingredient.inventory;

          if (!inventory) {
            throw new BadRequestException(
              `${recipeItem.ingredient.name} inventory not found`,
            );
          }

          const required = Number(recipeItem.quantity) * cartItem.quantity;

          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              quantity: {
                decrement: required,
              },
            },
          });
        }
      }

      let total = new Prisma.Decimal(0);

      const orderItems = cart.items.map((item) => {
        const basePrice = new Prisma.Decimal(item.variant.price);
        const quantity = item.quantity;

        let toppingTotal = new Prisma.Decimal(0);

        const toppings = item.toppings.map((t) => {
          const toppingPrice = t.topping.price;

          const sub = toppingPrice.mul(t.quantity);

          toppingTotal = toppingTotal.add(sub);

          return {
            toppingId: t.toppingId,
            quantity: t.quantity,
          };
        });

        const itemTotal = basePrice.mul(quantity).add(toppingTotal);

        total = total.add(itemTotal);

        return {
          variantId: item.variantId,
          quantity,
          price: basePrice,
          toppings: {
            create: toppings,
          },
        };
      });

      const order = await tx.order.create({
        data: {
          user: {
            connect: { id: userId },
          },
          totalAmount: total,
          status: OrderStatus.PENDING,
          paymentMethod: dto.paymentMethod,
          paymentStatus:
            dto.paymentMethod === PaymentMethod.COD
              ? PaymentStatus.PAID
              : PaymentStatus.PENDING,

          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              variant: true,
            },
          },
        },
      });

      if (dto.paymentMethod !== PaymentMethod.COD) {
        await tx.payment.upsert({
          where: { orderId: order.id },
          update: {
            amount: total,
            status: PaymentStatus.PENDING,
          },
          create: {
            orderId: order.id,
            amount: total,
            status: PaymentStatus.PENDING,
          },
        });
      }

      await tx.cartItemTopping.deleteMany({
        where: {
          cartItem: {
            cartId: cart.id,
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    await this.redis.del(getCartCacheKey(userId));
    return result;
  }

  async findOrder(userId: string, id: string) {
    const order = await this.orderRepo.findById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  findMyOrders(userId: string) {
    return this.orderRepo.findByUserId(userId);
  }

  findAll() {
    return this.orderRepo.findAll();
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepo.findById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.orderRepo.updateStatus(id, status);

    this.socketService.emitOrderStatusUpdated(
      order.userId,
      order.id,
      updated.status,
    );

    await this.notificationsService.create(
      order.userId,
      'Cập nhật đơn hàng',
      `Đơn hàng ${order.id} đã chuyển sang trạng thái ${status}`,
    );

    await Promise.all([
      this.redis.del('stats:overview'),
      this.redis.del('stats:revenue-by-day'),
    ]);

    await this.statisticsService.emitDashboardUpdate();

    return updated;
  }
}
