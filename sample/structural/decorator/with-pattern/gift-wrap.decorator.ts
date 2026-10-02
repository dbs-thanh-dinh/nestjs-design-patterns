import { OrderDecorator } from './order.decorator';

export class GiftWrapDecorator extends OrderDecorator {
  private static readonly FEE = 20000;

  getDescription(): string {
    return `${super.getDescription()} + Goi qua`;
  }

  getPrice(): number {
    return super.getPrice() + GiftWrapDecorator.FEE;
  }
}
