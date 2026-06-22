import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import * as crypto from 'crypto';
import { MomoCreatePaymentResponse } from 'src/common/interfaces/momo-create-payment-response.interface';

@Injectable()
export class MomoService {
  constructor(private readonly configService: ConfigService) {}

  async createPayment(
    orderId: string,
    amount: number,
  ): Promise<MomoCreatePaymentResponse> {
    const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE')!;

    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY')!;

    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY')!;

    const redirectUrl = this.configService.get<string>('MOMO_REDIRECT_URL')!;

    const ipnUrl = this.configService.get<string>('MOMO_IPN_URL')!;

    const requestId = orderId;
    const orderInfo = 'Coffee payment';
    const requestType = 'captureWallet';
    const extraData = '';

    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const body = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      signature,
      lang: 'vi',
    };

    const response = await axios.post<MomoCreatePaymentResponse>(
      'https://test-payment.momo.vn/v2/gateway/api/create',
      body,
    );

    return response.data;
  }
}
