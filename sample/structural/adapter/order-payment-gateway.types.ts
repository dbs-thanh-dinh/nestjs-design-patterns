/**
 * Ở đây minh họa việc TÍCH HỢP với 1 cổng
 * thanh toán BÊN THỨ BA (third-party payment gateway) có sẵn - đại diện cho
 * trường hợp rất phổ biến: thư viện/SDK bên ngoài có API, đơn vị tiền tệ, tên
 * field... KHÁC HOÀN TOÀN với quy ước nội bộ cũa hệ thống mình, và mình KHÔNG
 * THỂ sửa đổi source code cũa nó.
 */
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  errorMessage?: string;
}

/**
 * Đây là interface NỘI BỘ mà toàn bộ hệ thống của chúng ta mong muốn làm việc
 * cũng: nhận `amountInVnd` (dòng Viet Nam), trả về `PaymentResult` với field
 * rõ ràng. Hệ thống không nên biết gì về chi tiết cũa cổng thanh toán cụ thể
 * đang được dùng bên dưới.
 */
export interface IPaymentGateway {
  charge(orderId: string, amountInVnd: number, cardToken: string): PaymentResult;
}
