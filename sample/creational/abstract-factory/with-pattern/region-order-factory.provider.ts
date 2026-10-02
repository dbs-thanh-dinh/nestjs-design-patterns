import { Injectable } from '@nestjs/common';
import { OrderRegion, RegionOrderSummary } from '../region-order.types';
import { IRegionOrderFactory } from './region-order-factory.interface';
import { VietnamOrderFactory } from './vietnam-order-factory';
import { UsOrderFactory } from './us-order-factory';

/**
 * Provider chịu trách nhiệm chọn DÙNG 1 IRegionOrderFactory theo khu vực.
 * Đây là điểm duy nhất quyết định "khu vực nào đúng họ sản phẩm nào" - khác với
 * bản without-pattern, nơi người gọi hàm phải tự tay ghép từng thành phần riêng lẻ.
 */
@Injectable()
export class RegionOrderFactoryProvider {
  private readonly factories: Map<OrderRegion, IRegionOrderFactory>;

  constructor(vietnamFactory: VietnamOrderFactory, usFactory: UsOrderFactory) {
    this.factories = new Map<OrderRegion, IRegionOrderFactory>([
      [OrderRegion.VIETNAM, vietnamFactory],
      [OrderRegion.UNITED_STATES, usFactory],
    ]);
  }

  getFactory(region: OrderRegion): IRegionOrderFactory {
    const factory = this.factories.get(region);
    if (!factory) {
      throw new Error(`Không hỗ trợ khu vực: ${region}`);
    }
    return factory;
  }
}

/**
 * Xử lý đơn hàng CHỈ dựa vào 1 IRegionOrderFactory duy nhất -> tax calculator va
 * invoice formatter LUÔN ĐẢM BẢO cùng 1 khu vực, không thể trộn nhầm như hàm
 * `processOrderWithoutPattern`. Region được lấy từ factory để tránh inconsistency.
 */
export function processOrderWithFactory(
  orderId: string,
  subtotal: number,
  factory: IRegionOrderFactory,
): RegionOrderSummary {
  const region = factory.getRegion();
  const invoiceFormatter = factory.createInvoiceFormatter();
  const taxCalculator = factory.createTaxCalculator();
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
