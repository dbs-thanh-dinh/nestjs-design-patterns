import { CartItem } from '../order-cart.types';
import { ICommand } from './command.interface';
import { OrderCart } from './order-cart';

export class AddItemCommand implements ICommand {
  constructor(
    private readonly cart: OrderCart,
    private readonly item: CartItem,
  ) {}

  execute(): void {
    this.cart.addItem(this.item);
  }

  undo(): void {
    const index = this.cart.findItemIndex(this.item.productName);
    if (index !== -1) {
      this.cart.removeItemAt(index);
    }
  }

  describe(): string {
    return `Thêm sản phẩm "${this.item.productName}" (x${this.item.quantity})`;
  }
}
