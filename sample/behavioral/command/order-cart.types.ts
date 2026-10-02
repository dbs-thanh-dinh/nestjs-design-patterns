/**
 * Ở đây minh họa GIỎ HÀNG (cart) của đơn
 * hàng trước khi checkout: thêm sản phẩm, xóa sản phẩm, áp dụng mã giảm giá.
 * Đây là bối cảnh rất phổ biến cần UNDO (hoàn tác) - dùng để minh họa Command
 * Pattern, vì mỗi thao tác cần được "gọi lại" thành 1 object có thể thực thi
 * (execute) và hoàn tác (undo) một cách đồng nhất.
 */
export interface CartItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}
