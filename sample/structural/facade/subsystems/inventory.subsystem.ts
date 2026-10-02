import { Injectable } from '@nestjs/common';
import { CheckoutItem } from '../order-checkout.types';

/**
 * Subsystem #1: quan ly ton kho. Co API riêng, KHONG biet gi ve thanh toán,
 * giao hang hay thong bảo - dùng 1 nhiem vu duy nhất (giu/tra ton kho).
 */
@Injectable()
export class InventorySubsystem {
  // Ton kho gia lap, du để demo (san pham nao không co trong danh sach này
  // hoac vuot so luong sẽ bi tu choi giu hang).
  private readonly stock = new Map<string, number>([
    ['Ao thun', 10],
    ['Quan jean', 5],
    ['Ao khoac', 0], // het hang, dùng để demo truong hop thất bại
  ]);

  reserveStock(items: CheckoutItem[]): boolean {
    for (const item of items) {
      const available = this.stock.get(item.productName) ?? 0;
      if (available < item.quantity) {
        return false;
      }
    }
    for (const item of items) {
      const available = this.stock.get(item.productName) ?? 0;
      this.stock.set(item.productName, available - item.quantity);
    }
    return true;
  }

  releaseStock(items: CheckoutItem[]): void {
    for (const item of items) {
      const available = this.stock.get(item.productName) ?? 0;
      this.stock.set(item.productName, available + item.quantity);
    }
  }

  getAvailableQuantity(productName: string): number {
    return this.stock.get(productName) ?? 0;
  }
}
