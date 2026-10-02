import { Injectable } from '@nestjs/common';
import { OrderRegion } from '../region-order.types';
import { IRegionOrderFactory } from './region-order-factory.interface';
import { ITaxCalculator } from './tax-calculator.interface';
import { IInvoiceFormatter } from './invoice-formatter.interface';
import { VietnamTaxCalculator } from './vietnam-tax-calculator';
import { VietnamInvoiceFormatter } from './vietnam-invoice-formatter';

@Injectable()
export class VietnamOrderFactory implements IRegionOrderFactory {
  constructor(
    private readonly taxCalculator: VietnamTaxCalculator,
    private readonly invoiceFormatter: VietnamInvoiceFormatter,
  ) {}

  createTaxCalculator(): ITaxCalculator {
    return this.taxCalculator;
  }

  createInvoiceFormatter(): IInvoiceFormatter {
    return this.invoiceFormatter;
  }

  getRegion(): OrderRegion {
    return OrderRegion.VIETNAM;
  }
}
