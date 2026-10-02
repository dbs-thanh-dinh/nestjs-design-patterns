/**
 * Domain dùng chung cho sample này: xử lý thanh toán đơn hàng (Order Payment).
 */
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export interface PaymentResult {
  method: PaymentMethod;
  amount: number;
  transactionId: string;
  message: string;
}
