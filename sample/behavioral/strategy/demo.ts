/**
 * Chay thu: npm run sample:strategy
 */
import { Order, ShippingType } from './order-shipping.types';
import { ShippingCalculatorWithoutPattern } from './without-pattern/shipping-calculator.without-pattern';
import { ShippingContext } from './with-pattern/shipping-context';
import { StandardShippingStrategy } from './with-pattern/standard-shipping.strategy';
import { ExpressShippingStrategy } from './with-pattern/express-shipping.strategy';
import { SameDayShippingStrategy } from './with-pattern/same-day-shipping.strategy';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

const order: Order = { orderId: 'ORD-500', weightInKg: 3, distanceInKm: 15 };

line('WITHOUT PATTERN');
const withoutPatternCalculator = new ShippingCalculatorWithoutPattern();
console.log(withoutPatternCalculator.calculate(order, ShippingType.STANDARD));
console.log(withoutPatternCalculator.calculate(order, ShippingType.EXPRESS));

line('WITH PATTERN (Strategy)');
const context = new ShippingContext(
  new StandardShippingStrategy(),
  new ExpressShippingStrategy(),
  new SameDayShippingStrategy(),
);

for (const type of Object.values(ShippingType)) {
  context.setStrategy(type);
  console.log(context.calculate(order));
}

console.log('\nDemo hoàn thành.\n');
