/**
 * Chạy thử: npm run sample:abstract-factory
 */
import { OrderRegion } from './region-order.types';
import {
  VietnamTaxCalculatorWithoutPattern,
  VietnamInvoiceFormatterWithoutPattern,
  UsInvoiceFormatterWithoutPattern,
  processOrderWithoutPattern,
} from './without-pattern/region-order.without-pattern';
import { RegionOrderFactoryProvider, processOrderWithFactory } from './with-pattern/region-order-factory.provider';
import { VietnamOrderFactory } from './with-pattern/vietnam-order-factory';
import { UsOrderFactory } from './with-pattern/us-order-factory';
import { VietnamTaxCalculator } from './with-pattern/vietnam-tax-calculator';
import { VietnamInvoiceFormatter } from './with-pattern/vietnam-invoice-formatter';
import { UsTaxCalculator } from './with-pattern/us-tax-calculator';
import { UsInvoiceFormatter } from './with-pattern/us-invoice-formatter';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN - ghép đúng cặp (vẫn chạy, nhưng không có gì bảo đảm)');
console.log(
  processOrderWithoutPattern(
    'ORD-100',
    1000000,
    OrderRegion.VIETNAM,
    new VietnamTaxCalculatorWithoutPattern(),
    new VietnamInvoiceFormatterWithoutPattern(),
  ),
);

line('WITHOUT PATTERN - ghép NHẦM cặp (bug tiềm ẩn, không lỗi biên dịch!)');
console.log(
  processOrderWithoutPattern(
    'ORD-101',
    1000000,
    OrderRegion.VIETNAM,
    new VietnamTaxCalculatorWithoutPattern(), // thuế VN
    new UsInvoiceFormatterWithoutPattern(), // hóa đơn lại là mẫu US!
  ),
);
console.log('=> Thuế tính đúng 10% VAT, nhưng số hóa đơn và footer lại sai hoàn toàn sang mẫu US.');
console.log('   TypeScript không bao lỗi gì cả vì cả 2 tham số được "hợp kiểu dữ liệu".');

line('WITH PATTERN (Abstract Factory) - không thể ghép nhầm');
const provider = new RegionOrderFactoryProvider(
  new VietnamOrderFactory(new VietnamTaxCalculator(), new VietnamInvoiceFormatter()),
  new UsOrderFactory(new UsTaxCalculator(), new UsInvoiceFormatter()),
);

const vietnamFactory = provider.getFactory(OrderRegion.VIETNAM);
console.log(processOrderWithFactory('ORD-200', 1000000, vietnamFactory));

const usFactory = provider.getFactory(OrderRegion.UNITED_STATES);
console.log(processOrderWithFactory('ORD-201', 1000000, usFactory));
console.log('=> Chỉ truyền 1 factory duy nhất cho mỗi khu vực -> tax và invoice LUÔN đồng bộ.');

console.log('\nDemo hoàn tất.\n');
