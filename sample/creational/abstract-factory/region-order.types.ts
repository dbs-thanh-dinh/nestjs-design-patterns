/**
 * Ở đây minh họa việc xử lý đơn hàng theo
 * TỪNG KHU VỰC THỊ TRƯỜNG (region) - mỗi khu vực cần 1 BỘ các quy tắc đi kèm
 * với nhau: cách tính thuế + cách format hóa đơn. Hai thứ này PHẢI ĐỒNG BỘ,
 * không thể "trộn" quy tắc thuế của khu vực này với cách format hóa đơn của
 * khu vực khác.
 */
export enum OrderRegion {
  VIETNAM = 'VIETNAM',
  UNITED_STATES = 'UNITED_STATES',
}

export interface RegionOrderSummary {
  orderId: string;
  subtotal: number;
  region: OrderRegion;
  invoiceNumber: string;
  taxAmount: number;
  totalAmount: number;
  invoiceFooter: string;
}
