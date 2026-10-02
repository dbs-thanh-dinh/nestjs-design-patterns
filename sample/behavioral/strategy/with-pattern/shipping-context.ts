import { Injectable } from '@nestjs/common';
import { Order, ShippingQuote, ShippingType } from '../order-shipping.types';
import { IShippingStrategy } from './shipping-strategy.interface';
import { StandardShippingStrategy } from './standard-shipping.strategy';
import { ExpressShippingStrategy } from './express-shipping.strategy';
import { SameDayShippingStrategy } from './same-day-shipping.strategy';

/**
 * DÙNG Strategy Pattern.
 *
 * ShippingContext khong tự chứa công thức tinh phi - no chỉ giữ 1 tham chiếu den
 * IShippingStrategy va ủy quyền (delegate) việc tính toán cho strategy do.
 *
 * Lợi ích:
 * - Them 1 hình thức giao hàng moi (vi du: INTERNATIONAL) chỉ cần tạo thêm 1
 *   strategy class mới, không sửa context hay các strategy cũ.
 * - Dễ dàng đổi strategy ở runtime (vi du: theo campaign khuyến mại, theo khu vực)
 *   bằng cách goi `setStrategy()`.
 * - Từng strategy test độc lập, khong phụ thuộc các strategy khác.
 */
@Injectable()
export class ShippingContext {
  private readonly strategies: Map<ShippingType, IShippingStrategy>;
  private currentStrategy: IShippingStrategy;

  constructor(
    standard: StandardShippingStrategy,
    express: ExpressShippingStrategy,
    sameDay: SameDayShippingStrategy,
  ) {
    this.strategies = new Map<ShippingType, IShippingStrategy>([
      [standard.type, standard],
      [express.type, express],
      [sameDay.type, sameDay],
    ]);
    this.currentStrategy = standard;
  }

  setStrategy(type: ShippingType): void {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Không hỗ trợ hình thức giao hàng: ${type}`);
    }
    this.currentStrategy = strategy;
  }

  calculate(order: Order): ShippingQuote {
    return this.currentStrategy.calculateFee(order);
  }
}
