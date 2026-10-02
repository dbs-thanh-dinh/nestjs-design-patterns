import { IPricedOrder } from '../order-pricing.types';

/**
 * "Concrete Component" - đơn hàng o dang co ban nhat, CHUA co bat ky dịch vụ
 * tùy chọn nao. Cac decorator ben dưới sẽ lần luot "boc" quanh doi tuong này.
 */
export class BaseOrder implements IPricedOrder {
  constructor(
    private readonly orderId: string,
    private readonly basePrice: number,
  ) {}

  getDescription(): string {
    return `Don hang ${this.orderId}`;
  }

  getPrice(): number {
    return this.basePrice;
  }
}
