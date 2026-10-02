import { Order, ShippingQuote, ShippingType } from '../order-shipping.types';

/**
 * KHÔNG dùng Strategy Pattern.
 *
 * Vấn đề:
 * - Công thức tính phí của từng loại giao hàng bị nhồi chung vao 1 method.
 * - Muốn thay đổi công thức của riêng 1 loai (ví dụ EXPRESS) để gây ảnh hưởng /
 *   khó review code của các loại còn lại.
 * - Khó unit test riêng từng công thức, khó A/B test công thức mới cho 1 nhom user.
 */
export class ShippingCalculatorWithoutPattern {
  calculate(order: Order, type: ShippingType): ShippingQuote {
    let fee = 0;
    let estimatedDays = 0;

    if (type === ShippingType.STANDARD) {
      fee = order.weightInKg * 5000 + order.distanceInKm * 1000;
      estimatedDays = 5;
    } else if (type === ShippingType.EXPRESS) {
      fee = order.weightInKg * 8000 + order.distanceInKm * 2000 + 20000;
      estimatedDays = 2;
    } else if (type === ShippingType.SAME_DAY) {
      fee = order.weightInKg * 12000 + order.distanceInKm * 3500 + 50000;
      estimatedDays = 1;
    } else {
      throw new Error(`Không hỗ trợ hình thức giao hàng: ${type}`);
    }

    return { type, fee, estimatedDays };
  }
}
