/**
 * Sử dụng domain "Order". Ở dãy minh họa việc KHỞI TẠO 1 đối tượng
 * Order phức tạp - có nhiều trường bắt buộc, nhiều trường tùy chọn (optional),
 * rất dễ rơi vào tình trạng "telescoping constructor" (constructor qua nhiều tham số).
 */
export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  // Các trường sau là TUỲ CHỌN (optional) - nguồn gốc chính của vấn đề
  // "telescoping constructor" khi số lượng trường tùy chọn tăng lên.
  discountCode?: string;
  giftWrap?: boolean;
  note?: string;
}
