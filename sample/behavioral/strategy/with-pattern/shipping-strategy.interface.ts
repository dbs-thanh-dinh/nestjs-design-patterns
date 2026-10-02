import { Order, ShippingQuote, ShippingType } from '../order-shipping.types';

export interface IShippingStrategy {
  readonly type: ShippingType;
  calculateFee(order: Order): ShippingQuote;
}
