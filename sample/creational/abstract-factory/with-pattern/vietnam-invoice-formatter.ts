import { Injectable } from '@nestjs/common';
import { IInvoiceFormatter } from './invoice-formatter.interface';

@Injectable()
export class VietnamInvoiceFormatter implements IInvoiceFormatter {
  formatInvoiceNumber(orderId: string): string {
    return `HD-${orderId}`;
  }

  formatFooter(): string {
    return 'Hóa đơn GTGT - Mã số thứế: 0312345678';
  }
}
