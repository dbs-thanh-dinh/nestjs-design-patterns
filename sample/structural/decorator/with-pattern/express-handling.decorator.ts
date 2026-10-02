import { OrderDecorator } from './order.decorator';

export class ExpressHandlingDecorator extends OrderDecorator {
  private static readonly FEE = 50000;

  getDescription(): string {
    return `${super.getDescription()} + Giao hoa toc`;
  }

  getPrice(): number {
    return super.getPrice() + ExpressHandlingDecorator.FEE;
  }
}
