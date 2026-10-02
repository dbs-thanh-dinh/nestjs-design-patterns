import { OrderRegion, RegionOrderSummary } from '../region-order.types';

/**
 * KHÔNG dùng Abstract Factory Pattern.
 *
 * Ở đây ta vẫn "tách class" cho từng khu vực (có vẻ giống Factory Method), NHƯNG
 * không có gì ràng buộc 1 tax calculator phải luôn đi cùng với 1 invoice formatter
 * CÙNG khu vực. Người gọi hàm phải TỰ NHỚ và tự ghép đúng cặp - rất dễ mắc lỗi khi
 * code lớn dần, nhiều người cùng sửa.
 */

// --- Tax calculators: mỗi khu vực 1 class riêng, không liên hệ gì với formatter ---
export class VietnamTaxCalculatorWithoutPattern {
  calculateTax(subtotal: number): number {
    return subtotal * 0.1; // VAT 10%
  }
}

export class UsTaxCalculatorWithoutPattern {
  calculateTax(subtotal: number): number {
    return subtotal * 0.08; // sales tax 8% (ví dụ)
  }
}

// --- Invoice formatters: cùng tách riêng, không liên hệ gì với tax calculator ---
export class VietnamInvoiceFormatterWithoutPattern {
  formatInvoiceNumber(orderId: string): string {
    return `HD-${orderId}`;
  }
  formatFooter(): string {
    return 'Hóa đơn GTGT - Mã số thuế: 0312345678';
  }
}

export class UsInvoiceFormatterWithoutPattern {
  formatInvoiceNumber(orderId: string): string {
    return `INV-${orderId}`;
  }
  formatFooter(): string {
    return 'Sales Invoice - EIN: 12-3456789';
  }
}

/**
 * Hàm xử lý đơn hàng nhận tax calculator và invoice formatter là 2 THAM SỐ
 * ĐỘC LẬP - không có kiểu dữ liệu nào đảm bảo cả 2 phải cùng 1 khu vực.
 */
export function processOrderWithoutPattern(
  orderId: string,
  subtotal: number,
  region: OrderRegion,
  taxCalculator: { calculateTax(subtotal: number): number },
  invoiceFormatter: { formatInvoiceNumber(orderId: string): string; formatFooter(): string },
): RegionOrderSummary {
  const taxAmount = taxCalculator.calculateTax(subtotal);
  return {
    orderId,
    subtotal,
    region,
    invoiceNumber: invoiceFormatter.formatInvoiceNumber(orderId),
    taxAmount,
    totalAmount: subtotal + taxAmount,
    invoiceFooter: invoiceFormatter.formatFooter(),
  };
}
