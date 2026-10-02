/**
 * Tiếp tục dùng chung domain "Order" nhu sample Factory, ở đây tập trung vao
 * bước tính phí vận chuyển (shipping fee) cho đơn hàng voi nhieu hình thức giao hàng.
 */
export enum ShippingType {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  SAME_DAY = 'SAME_DAY',
}

export interface Order {
  orderId: string;
  weightInKg: number;
  distanceInKm: number;
}

export interface ShippingQuote {
  type: ShippingType;
  fee: number;
  estimatedDays: number;
}
