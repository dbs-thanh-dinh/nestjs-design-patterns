/**
 * Tiep tuc dùng chung domain "Order". O day minh hoa viec THEM CAC DICH VU
 * TUY CHON vào đơn hàng (gọi qua, bảo hiem van chuyen, giao hoa toc...) - moi
 * dịch vụ THEM CHI PHI và THEM MO TA vào đơn hàng, và khach hang có thể chon
 * KET HOP BAT KY dịch vụ nao với nhau (không chon gi, chỉ 1, hoac ca 3...).
 * Day la boi canh kinh dien cũa Decorator Pattern: "bảo" (wrap) 1 doi tuong
 * nhieu lop, moi lop THEM 1 hanh vi, ma không can tạo ra 1 subclass riêng cho
 * TUNG TỔ HỢP có thể co.
 */
export interface IPricedOrder {
  getDescription(): string;
  getPrice(): number;
}
