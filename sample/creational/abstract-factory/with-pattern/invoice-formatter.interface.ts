export interface IInvoiceFormatter {
  formatInvoiceNumber(orderId: string): string;
  formatFooter(): string;
}
