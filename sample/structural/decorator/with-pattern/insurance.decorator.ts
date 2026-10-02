import { OrderDecorator } from './order.decorator';

/**
 * Luu y: phi bảo hiem tinh theo PHAN TRAM trên gia HIEN TAI (`super.getPrice()`),
 * tuc la gia da bảo gom moi decorator nam BEN TRONG no. Day chỉnh la ly do
 * THỨ TỰ "boc" các decorator có thể ẢNH HƯỞNG ĐẾN KẾT QUẢ CUOI CUNG - xem vi
 * dù minh hoa trong `demo.ts` và test "thu tu decorator anh huong ket qua".
 */
export class InsuranceDecorator extends OrderDecorator {
  private static readonly RATE = 0.02; // 2%

  getDescription(): string {
    return `${super.getDescription()} + Bao hiem van chuyen`;
  }

  getPrice(): number {
    return Math.round(super.getPrice() * (1 + InsuranceDecorator.RATE));
  }
}
