import { ITaxCalculator } from './tax-calculator.interface';
import { IInvoiceFormatter } from './invoice-formatter.interface';

import { OrderRegion } from '../region-order.types';

/**
 * Đây chính là "Abstract Factory": 1 interface khai báo khởi tạo cả 1 HỌ sản phẩm
 * (ở đây là 2 thành viên: tax calculator + invoice formatter). Mỗi implementation
 * cụ thể (VietnamOrderFactory, UsOrderFactory) đảm bảo 2 thành viên trả về LUÔN
 * CÙNG 1 khu vực với nhau - không thể trộn nhầm như bản without-pattern.
 */
export interface IRegionOrderFactory {
  createTaxCalculator(): ITaxCalculator;
  createInvoiceFormatter(): IInvoiceFormatter;
  getRegion(): OrderRegion;
}
