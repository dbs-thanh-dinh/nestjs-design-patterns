import { ICommand } from './command.interface';
import { OrderCart } from './order-cart';

export class ApplyDiscountCommand implements ICommand {
  private previousPercent?: number;

  constructor(
    private readonly cart: OrderCart,
    private readonly newPercent: number,
  ) {}

  execute(): void {
    this.previousPercent = this.cart.getDiscount();
    this.cart.setDiscount(this.newPercent);
  }

  undo(): void {
    if (this.previousPercent !== undefined) {
      this.cart.setDiscount(this.previousPercent);
    }
  }

  describe(): string {
    return `Áp dụng giảm giá ${this.newPercent}%`;
  }
}
