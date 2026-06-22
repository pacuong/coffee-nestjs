import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MomoIpnDto {
  @IsString()
  orderId: string;

  @IsNumber()
  resultCode: number;

  @IsOptional()
  @IsNumber()
  transId?: number;
}
