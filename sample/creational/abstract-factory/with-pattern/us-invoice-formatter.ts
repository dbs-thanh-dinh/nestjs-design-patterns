import { Injectable } from '@nestjs/common';
import { IInvoiceFormatter } from './invoice-formatter.interface';

@Injectable()
export class UsInvoiceFormatter implements IInvoiceFormatter {
  formatInvoiceNumber(orderId: string): string {
    return `INV-${orderId}`;
  }

  formatFooter(): string {
    return 'Sales Invoice - EIN: 12-3456789';
  }
}
