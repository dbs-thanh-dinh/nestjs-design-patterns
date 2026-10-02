import { Injectable } from '@nestjs/common';
import { ITaxCalculator } from './tax-calculator.interface';

@Injectable()
export class VietnamTaxCalculator implements ITaxCalculator {
  calculateTax(subtotal: number): number {
    return subtotal * 0.1; // VAT 10%
  }
}
