import { Injectable } from '@nestjs/common';
import { Order, ShippingQuote, ShippingType } from '../order-shipping.types';
import { IShippingStrategy } from './shipping-strategy.interface';

@Injectable()
export class SameDayShippingStrategy implements IShippingStrategy {
  readonly type = ShippingType.SAME_DAY;

  calculateFee(order: Order): ShippingQuote {
    const fee = order.weightInKg * 12000 + order.distanceInKm * 3500 + 50000;
    return { type: this.type, fee, estimatedDays: 1 };
  }
}
