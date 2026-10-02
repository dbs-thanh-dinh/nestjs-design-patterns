/**
 * Giả lập 1 SDK/thư viện BÊN THỨ BA có sẵn (ví dụ: import từ 1 npm package của
 * nhà cũng cấp thanh toán, hoặc 1 hệ thống legacy của đội khác trong công ty).
 *
 * ĐÂY LÀ CODE MÀ BẠN KHÔNG THỂ/KHÔNG NÊN SỬA ĐỔI:
 * - Dùng đơn vị USD CENTS thay vì VND.
 * - Tên field hoàn toàn khác quy ước nội bộ (`referenceCode` thay vì `orderId`,
 *   `gatewayRefId` thay vì `transactionId`, `status: 'OK' | 'FAILED'` thay vì
 *   `success: boolean`).
 */
export interface LegacyPaymentPayload {
  amountInCents: number;
  cardToken: string;
  referenceCode: string;
}

export interface LegacyPaymentResponse {
  status: 'OK' | 'FAILED';
  gatewayRefId: string;
  errorMessage?: string;
}

export class LegacyPaymentGatewaySdk {
  /**
   * API có sẵn của nhà cũng cấp - chỉ nhận payload đúng định dạng của HỌ,
   * không biết gì về khái niệm "đơn hàng VND" của hệ thống chúng ta.
   */
  makePayment(payload: LegacyPaymentPayload): LegacyPaymentResponse {
    if (!payload.cardToken) {
      return { status: 'FAILED', gatewayRefId: '', errorMessage: 'Thiếu cardToken' };
    }
    if (!Number.isInteger(payload.amountInCents) || payload.amountInCents <= 0) {
      return {
        status: 'FAILED',
        gatewayRefId: '',
        errorMessage: `amountInCents không hợp lệ: ${payload.amountInCents} (SDK chỉ chấp nhận số nguyên dương)`,
      };
    }

    return {
      status: 'OK',
      gatewayRefId: `LEGACY-${payload.referenceCode}-${Date.now()}`,
    };
  }
}
