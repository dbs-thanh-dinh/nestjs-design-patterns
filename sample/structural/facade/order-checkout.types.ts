/**
 * Tiep tuc dùng chung domain "Order". O day minh hoa QUY TRINH CHECKOUT hoan
 * chỉnh - can phoi hop NHIEU HE THONG CON (subsystem) theo DUNG THỨ TỰ và co
 * XU LY LOI/ROLLBACK khi 1 bước thất bại: kiem tra & giữ tồn kho, thu tiền,
 * lên lịch giao hang, gửi email xac nhan. Day la boi canh kinh dien cũa Facade
 * Pattern: qua nhieu subsystem, thu tu gọi quan trong, can 1 "mat tien" don
 * gian hoa cho nguoi gọi ben ngoai.
 */
export interface CheckoutItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CustomerInfo {
  email: string;
  shippingAddress: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  trackingCode?: string;
  failedStep?: string;
  errorMessage?: string;
}
