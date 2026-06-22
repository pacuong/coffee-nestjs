import { Injectable } from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByOrderId(orderId: string) {
    return this.prisma.payment.findUnique({
      where: {
        orderId,
      },
    });
  }

  updateStatus(orderId: string, status: PaymentStatus, transactionId?: string) {
    return this.prisma.payment.update({
      where: {
        orderId,
      },
      data: {
        status,
        transactionId,
      },
    });
  }

  async createIfNotExists(data: {
    orderId: string;
    amount: Prisma.Decimal;
    status: PaymentStatus;
  }) {
    return this.prisma.payment.upsert({
      where: {
        orderId: data.orderId,
      },
      create: {
        orderId: data.orderId,
        amount: data.amount,
        status: data.status,
      },
      update: {
        amount: data.amount,
        status: data.status,
      },
    });
  }
}
