import { Injectable, Scope } from '@nestjs/common';
import { Order, OrderItem, ShippingAddress } from '../order.types';

/**
 * DÙNG Builder Pattern (kiểu "fluent interface" - các method trả về `this`
 * để gọi nơi tiếp nhau, rất phổ biến trong TypeScript/JS).
 *
 * Lợi ích so với telescoping constructor:
 * - Mỗi trường được xét qua 1 method có TÊN RÕ RÀNG (`withCustomer`, `addItem`,
 *   `applyDiscountCode`...) -> code gọi hàm tự đọc được chính nó, không cần
 *   xem lại định nghĩa constructor.
 * - Các trường bắt buộc được kiểm tra ở bước `build()`, tránh tạo ra Order
 *   thiếu dữ liệu cần thiết.
 * - Thêm 1 trường tùy chọn mới chỉ cần thêm 1 method mới vào builder, KHÔNG
 *   ảnh hưởng các nơi đã dùng builder trước đó.
 * - Dễ đọc, dễ đổi thứ tự gọi (vì trả về `this` nên thứ tự gọi method không
 *   quan trọng, khác với thứ tự tham số cố định của constructor).
 *
 * `@Injectable()` với `Scope.TRANSIENT`: vì builder giữ state (`items`, `discountCode`...)
 * qua từng lần gọi method, KHÔNG được dùng Singleton scope mặc định của Nest cho class
 * này - nếu không, state của request này sẽ bị lẫn sang request khác. Nếu inject builder
 * qua Nest DI container, nên khai báo Scope.TRANSIENT (hoặc REQUEST) để mỗi lần resolve
 * là 1 instance mới, sạch state.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class OrderBuilder {
  private orderId?: string;
  private customerName?: string;
  private items: OrderItem[] = [];
  private shippingAddress?: ShippingAddress;
  private discountCode?: string;
  private giftWrap = false;
  private note?: string;

  withOrderId(orderId: string): this {
    this.orderId = orderId;
    return this;
  }

  withCustomer(customerName: string): this {
    this.customerName = customerName;
    return this;
  }

  addItem(item: OrderItem): this {
    this.items.push(item);
    return this;
  }

  withShippingAddress(shippingAddress: ShippingAddress): this {
    this.shippingAddress = shippingAddress;
    return this;
  }

  applyDiscountCode(discountCode: string): this {
    this.discountCode = discountCode;
    return this;
  }

  markAsGiftWrap(): this {
    this.giftWrap = true;
    return this;
  }

  withNote(note: string): this {
    this.note = note;
    return this;
  }

  build(): Order {
    if (!this.orderId) {
      throw new Error('OrderBuilder: thieu orderId - gọi withOrderId() trước khi build()');
    }
    if (!this.customerName) {
      throw new Error('OrderBuilder: thieu customerName - gọi withCustomer() trước khi build()');
    }
    if (this.items.length === 0) {
      throw new Error('OrderBuilder: đơn hàng phải co it nhat 1 san pham - gọi addItem() trước khi build()');
    }
    if (!this.shippingAddress) {
      throw new Error('OrderBuilder: thieu shippingAddress - gọi withShippingAddress() trước khi build()');
    }

    return {
      orderId: this.orderId,
      customerName: this.customerName,
      items: this.items,
      shippingAddress: this.shippingAddress,
      discountCode: this.discountCode,
      giftWrap: this.giftWrap,
      note: this.note,
    };
  }
}
