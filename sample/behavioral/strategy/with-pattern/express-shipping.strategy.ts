import { Injectable } from '@nestjs/common';
import { Order, ShippingQuote, ShippingType } from '../order-shipping.types';
import { IShippingStrategy } from './shipping-strategy.interface';

@Injectable()
export class ExpressShippingStrategy implements IShippingStrategy {
  readonly type = ShippingType.EXPRESS;

  calculateFee(order: Order): ShippingQuote {
    const fee = order.weightInKg * 8000 + order.distanceInKm * 2000 + 20000;
    return { type: this.type, fee, estimatedDays: 2 };
  }
}
