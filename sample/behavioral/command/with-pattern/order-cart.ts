import { Injectable, Scope } from '@nestjs/common';
import { CartItem } from '../order-cart.types';

/**
 * Đây là "Receiver" trong Command Pattern - nơi THỰC SỰ chứa logic nghiệp vụ
 * (thêm/xóa sản phẩm, áp dụng giảm giá). OrderCart hoàn toàn KHÔNG BIẾT gì về
 * khái niệm Command/undo - nó chỉ cung cấp các method nghiệp vụ thuần túy để
 * các Command class bên ngoài gọi tới.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class OrderCart {
  readonly items: CartItem[] = [];
  private discountPercent = 0;

  addItem(item: CartItem): void {
    this.items.push(item);
  }

  removeItemAt(index: number): CartItem | undefined {
    if (index < 0 || index >= this.items.length) return undefined;
    return this.items.splice(index, 1)[0];
  }

  findItemIndex(productName: string): number {
    return this.items.findIndex((i) => i.productName === productName);
  }

  insertItemAt(index: number, item: CartItem): void {
    this.items.splice(index, 0, item);
  }

  setDiscount(percent: number): void {
    this.discountPercent = percent;
  }

  getDiscount(): number {
    return this.discountPercent;
  }
}
