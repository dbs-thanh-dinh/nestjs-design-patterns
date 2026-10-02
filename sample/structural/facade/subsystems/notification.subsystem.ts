import { Injectable } from '@nestjs/common';

/**
 * Subsystem #4: gui thong bảo. Chi biet gửi email - không biet gi ve ton kho,
 * thanh toán hay giao hang.
 */
@Injectable()
export class NotificationSubsystem {
  readonly sentEmails: string[] = [];

  sendOrderConfirmation(orderId: string, email: string, trackingCode: string): void {
    const message = `Gui email xac nhan đơn hàng ${orderId} toi ${email} - ma van don: ${trackingCode}`;
    this.sentEmails.push(message);
    // eslint-disable-next-line no-console
    console.log(`[Notification] ${message}`);
  }
}
