import { Injectable, NotFoundException } from '@nestjs/common';

import { PaymentStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { OrdersRepository } from 'src/modules/orders/repositories/orders.repository';

import { PaymentsRepository } from '../repositories/payments.repository';

import { MomoService } from './momo.service';
import { MomoIpnDto } from 'src/modules/payments/dto/momo-ipn.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly momoService: MomoService,

    private readonly paymentRepo: PaymentsRepository,

    private readonly orderRepo: OrdersRepository,
  ) {}

  async createMomoPayment(orderId: string) {
    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      return {
        message: 'Order already paid',
      };
    }

    await this.paymentRepo.createIfNotExists({
      orderId: order.id,
      amount: order.totalAmount,
      status: PaymentStatus.PENDING,
    });

    const momo = await this.momoService.createPayment(
      order.id,
      Number(order.totalAmount),
    );

    return {
      payUrl: momo.payUrl,
    };
  }

  async momoIpn(data: MomoIpnDto) {
    const orderId = data.orderId;

    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const paymentStatus =
      data.resultCode === 0 ? PaymentStatus.PAID : PaymentStatus.FAILED;

    await this.paymentRepo.updateStatus(
      orderId,
      paymentStatus,
      data.transId?.toString(),
    );

    await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus,
      },
    });

    return {
      message: 'OK',
    };
  }
}
