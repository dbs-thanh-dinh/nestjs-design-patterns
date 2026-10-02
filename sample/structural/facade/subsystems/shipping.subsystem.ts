import { Injectable } from '@nestjs/common';

/**
 * Subsystem #3: lên lịch giao hang. Chi biet tạo van don - không biet gi ve
 * ton kho, thanh toán hay email.
 */
@Injectable()
export class ShippingSubsystem {
  scheduleShipment(orderId: string, shippingAddress: string): { trackingCode: string } {
    return { trackingCode: `SHIP-${orderId}-${shippingAddress.length}${Date.now() % 1000}` };
  }
}
