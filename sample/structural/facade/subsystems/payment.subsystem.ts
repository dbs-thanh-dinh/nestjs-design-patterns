import { Injectable } from '@nestjs/common';

/**
 * Subsystem #2: xử lý thanh toán. Chi biet thu tiền - không biet gi ve ton
 * kho, giao hang hay email.
 */
@Injectable()
export class PaymentSubsystem {
  charge(orderId: string, amount: number): { success: boolean; transactionId?: string; errorMessage?: string } {
    if (amount <= 0) {
      return { success: false, errorMessage: 'So tien thanh toán không hop le' };
    }
    // amount > 5,000,000 giả lập thẻ bị từ chối (demo trường hợp thất bại ở
    // BƯỚC THANH TOÁN, SAU KHI đã giữ tồn kho - cần rollback tồn kho).
    if (amount > 5_000_000) {
      return { success: false, errorMessage: 'The bi tu choi: vuot han muc giao dich' };
    }
    return { success: true, transactionId: `PAY-${orderId}-${Date.now()}` };
  }
}
