/**
 * Ở đây minh họa việc TRUY VẤN CHI TIẾT
 * đơn hàng (`Order Details`) từ 1 nguồn TỒN KÉM chỉ phí (giả lập: gọi database
 * hoặc API bên ngoài có độ trễ / chỉ phí tính toán cao). Đây là bối cảnh kinh
 * điển của Proxy Pattern (Caching Proxy): nhiều nơi trong hệ thống có thể cần
 * tra cứu CÙNG 1 đơn hàng nhiều lần, và ta muốn TRÁNH gọi lại nguồn dữ liệu đó
 * một cách TRONG SUỐT (người gọi không cần biết mình đang lấy từ cache hay từ
 * nguồn thật).
 */
export interface OrderDetails {
  orderId: string;
  customerName: string;
  totalAmount: number;
}

/**
 * Interface chung mà cả "nguồn thật" (RealOrderQueryService) và "proxy"
 * (CachingOrderQueryProxy) đều implement - đây là điểm mấu chốt khiến Proxy
 * Pattern hoạt động "trong suốt": người gọi chỉ biết tới interface này, hoàn
 * toàn không phân biệt được đang làm việc với nguồn thật hay proxy.
 */
export interface IOrderQueryService {
  getOrderDetails(orderId: string): OrderDetails;
}
