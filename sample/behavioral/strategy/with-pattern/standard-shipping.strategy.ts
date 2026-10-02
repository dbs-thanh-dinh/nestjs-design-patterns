import { Injectable } from '@nestjs/common';
import { Order, ShippingQuote, ShippingType } from '../order-shipping.types';
import { IShippingStrategy } from './shipping-strategy.interface';

@Injectable()
export class StandardShippingStrategy implements IShippingStrategy {
  readonly type = ShippingType.STANDARD;

  calculateFee(order: Order): ShippingQuote {
    const fee = order.weightInKg * 5000 + order.distanceInKm * 1000;
    return { type: this.type, fee, estimatedDays: 5 };
  }
}
