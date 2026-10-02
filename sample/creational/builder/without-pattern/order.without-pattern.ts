import { Order, OrderItem, ShippingAddress } from '../order.types';

/**
 * KHÔNG dùng Builder Pattern - "Telescoping Constructor".
 *
 * Vấn đề:
 * - Constructor nhận RẤT NHIỀU tham số, xen kẽ bắt buộc và tùy chọn.
 * - Khi gọi hàm, rất dễ TRUYỀN NHẦM VỊ TRÍ các tham số cũng kiểu dữ liệu
 *   (ví dụ: nhầm `giftWrap` và giá trị boolean khác, hoặc quên 1 tham số
 *   optional ở giữa khiến phải truyền `undefined` cho các tham số trước no).
 * - Muốn thêm 1 trường tùy chọn mới (ví dụ: `deliveryInstruction`) phải SỬA
 *   hàm constructor, ảnh hưởng toàn bộ nơi đang gọi constructor này.
 * - code gọi hàm rất khó đọc: chỉ thay 1 dãy giá trị, không biết giá trị nào
 *   ứng với trường nào nếu không mở IDE lên xem.
 */
export class OrderWithoutPattern {
  readonly orderId: string;
  readonly customerName: string;
  readonly items: OrderItem[];
  readonly shippingAddress: ShippingAddress;
  readonly discountCode?: string;
  readonly giftWrap?: boolean;
  readonly note?: string;

  constructor(
    orderId: string,
    customerName: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
    discountCode?: string,
    giftWrap?: boolean,
    note?: string,
  ) {
    this.orderId = orderId;
    this.customerName = customerName;
    this.items = items;
    this.shippingAddress = shippingAddress;
    this.discountCode = discountCode;
    this.giftWrap = giftWrap;
    this.note = note;
  }

  toPlainObject(): Order {
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
