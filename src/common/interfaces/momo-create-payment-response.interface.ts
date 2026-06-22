export interface MomoCreatePaymentResponse {
  partnerCode: string;
  requestId: string;
  orderId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
}
