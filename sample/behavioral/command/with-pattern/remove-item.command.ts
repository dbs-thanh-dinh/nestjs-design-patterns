import { CartItem } from '../order-cart.types';
import { ICommand } from './command.interface';
import { OrderCart } from './order-cart';

export class RemoveItemCommand implements ICommand {
  // Command tự lưu lại dữ liệu cần thiết để có thể UNDO chính xác - đây là
  // điểm mạnh của Command Pattern: mỗi command tự chịu trách nhiệm cho việc
  // hoàn tác của CHÍNH NÓ, không đẩy trách nhiệm này ra bên ngoài.
  private removedItem?: CartItem;
  private removedIndex?: number;

  constructor(
    private readonly cart: OrderCart,
    private readonly productName: string,
  ) {}

  execute(): void {
    const index = this.cart.findItemIndex(this.productName);
    if (index === -1) return;
    this.removedIndex = index;
    this.removedItem = this.cart.removeItemAt(index);
  }

  undo(): void {
    if (this.removedItem !== undefined && this.removedIndex !== undefined) {
      this.cart.insertItemAt(this.removedIndex, this.removedItem);
    }
  }

  describe(): string {
    return `Xóa sản phẩm "${this.productName}"`;
  }
}
