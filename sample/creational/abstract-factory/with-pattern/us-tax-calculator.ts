import { Injectable } from '@nestjs/common';
import { ITaxCalculator } from './tax-calculator.interface';

@Injectable()
export class UsTaxCalculator implements ITaxCalculator {
  calculateTax(subtotal: number): number {
    return subtotal * 0.08; // sales tax 8% (ví dụ)
  }
}
