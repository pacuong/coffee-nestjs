import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

import { PaymentsService } from '../services/payments.service';
import { MomoIpnDto } from 'src/modules/payments/dto/momo-ipn.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('momo/:orderId')
  @ApiOperation({
    summary: 'Create MoMo payment',
  })
  createMomoPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.createMomoPayment(orderId);
  }

  @Post('momo/ipn')
  momoIpn(@Body() body: MomoIpnDto) {
    return this.paymentsService.momoIpn(body);
  }
}
