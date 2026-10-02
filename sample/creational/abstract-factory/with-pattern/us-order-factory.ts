import { Injectable } from '@nestjs/common';
import { OrderRegion } from '../region-order.types';
import { IRegionOrderFactory } from './region-order-factory.interface';
import { ITaxCalculator } from './tax-calculator.interface';
import { IInvoiceFormatter } from './invoice-formatter.interface';
import { UsTaxCalculator } from './us-tax-calculator';
import { UsInvoiceFormatter } from './us-invoice-formatter';

@Injectable()
export class UsOrderFactory implements IRegionOrderFactory {
  constructor(
    private readonly taxCalculator: UsTaxCalculator,
    private readonly invoiceFormatter: UsInvoiceFormatter,
  ) {}

  createTaxCalculator(): ITaxCalculator {
    return this.taxCalculator;
  }

  createInvoiceFormatter(): IInvoiceFormatter {
    return this.invoiceFormatter;
  }

  getRegion(): OrderRegion {
    return OrderRegion.UNITED_STATES;
  }
}
