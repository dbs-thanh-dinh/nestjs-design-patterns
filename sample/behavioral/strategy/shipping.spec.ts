import { Order, ShippingType } from './order-shipping.types';
import { ShippingCalculatorWithoutPattern } from './without-pattern/shipping-calculator.without-pattern';
import { ShippingContext } from './with-pattern/shipping-context';
import { StandardShippingStrategy } from './with-pattern/standard-shipping.strategy';
import { ExpressShippingStrategy } from './with-pattern/express-shipping.strategy';
import { SameDayShippingStrategy } from './with-pattern/same-day-shipping.strategy';

const sampleOrder: Order = {
  orderId: 'ORD-1',
  weightInKg: 2,
  distanceInKm: 10,
};

describe('Strategy Pattern - Order Shipping Fee', () => {
  describe('Without Pattern', () => {
    const calculator = new ShippingCalculatorWithoutPattern();

    it('tinh phi STANDARD dung cong thuc', () => {
      const quote = calculator.calculate(sampleOrder, ShippingType.STANDARD);
      expect(quote.fee).toBe(2 * 5000 + 10 * 1000);
      expect(quote.estimatedDays).toBe(5);
    });

    it('nêm lỗi khi hình thức không tồn tại', () => {
      expect(() => calculator.calculate(sampleOrder, 'INTERNATIONAL' as ShippingType)).toThrow();
    });
  });

  describe('With Pattern (Strategy)', () => {
    const context = new ShippingContext(
      new StandardShippingStrategy(),
      new ExpressShippingStrategy(),
      new SameDayShippingStrategy(),
    );

    it('mac dinh dung STANDARD strategy', () => {
      const quote = context.calculate(sampleOrder);
      expect(quote.type).toBe(ShippingType.STANDARD);
      expect(quote.fee).toBe(2 * 5000 + 10 * 1000);
    });

    it('đổi sang EXPRESS strategy lúc runtime', () => {
      context.setStrategy(ShippingType.EXPRESS);
      const quote = context.calculate(sampleOrder);
      expect(quote.type).toBe(ShippingType.EXPRESS);
      expect(quote.fee).toBe(2 * 8000 + 10 * 2000 + 20000);
      expect(quote.estimatedDays).toBe(2);
    });

    it('đổi sang SAME_DAY strategy lúc runtime', () => {
      context.setStrategy(ShippingType.SAME_DAY);
      const quote = context.calculate(sampleOrder);
      expect(quote.type).toBe(ShippingType.SAME_DAY);
      expect(quote.fee).toBe(2 * 12000 + 10 * 3500 + 50000);
      expect(quote.estimatedDays).toBe(1);
    });

    it('nêm lỗi khi setStrategy với loại không tồn tại', () => {
      expect(() => context.setStrategy('INTERNATIONAL' as ShippingType)).toThrow();
    });
  });
});
