import { Injectable } from '@nestjs/common';

import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  countUsers() {
    return this.prisma.user.count();
  }

  countOrders() {
    return this.prisma.order.count();
  }

  countPendingOrders() {
    return this.prisma.order.count({
      where: {
        status: OrderStatus.PENDING,
      },
    });
  }

  countCompletedOrders() {
    return this.prisma.order.count({
      where: {
        status: OrderStatus.COMPLETED,
      },
    });
  }

  totalRevenue() {
    return this.prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },

      where: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  }

  revenueByDay() {
    return this.prisma.$queryRaw<
      {
        date: Date;
        revenue: Prisma.Decimal;
      }[]
    >`
      SELECT
        DATE(createdAt) as date,
        SUM(totalAmount) as revenue
      FROM "Order"
      WHERE paymentStatus = 'PAID'
      GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt)
    `;
  }

  revenueToday() {
    return this.prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        paymentStatus: PaymentStatus.PAID,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
  }
}
