import { OrderIdSequenceInfo } from '../order-id-generator.types';

/**
 * DÙNG Singleton Pattern (kiểu "classic": private constructor + static getInstance()).
 *
 * Đảm bảo toàn bộ ứng dụng chỉ có DUY NHẤT 1 instance của OrderIdGenerator,
 * bất kể bao nhiêu nơi trong code gọi đến nó -> bộ đếm `sequence` luôn dùng 1
 * nguồn duy nhất, không thể sinh trùng ID.
 *
 * Lưu ý khi dùng trong NestJS thực tế:
 * Nếu class này dược khai báo là 1 Provider trong Nest Module (`providers: [OrderIdGenerator]`),
 * Nest DI container MẶC ĐỊNH đã tạo nó theo Singleton scope (chỉ 1 instance dùng chung
 * cho toàn app) mà KHÔNG cần tự viết static getInstance(). Sample này minh họa Singleton
 * "thuần TypeScript" để hiểu bản chất pattern; trong dự án NestJS thực tế, bạn thường chỉ
 * cần `@Injectable()` là đủ, trừ khi code này sẽ được dùng ở cả nơi ngoài Nest DI (script,
 * cronjob độc lập...).
 */
export class OrderIdGenerator {
  private static instance: OrderIdGenerator | null = null;

  private prefix = 'ORD';
  private sequence = 0;

  // Constructor là `private` -> không ai có thể `new OrderIdGenerator()` từ bên ngoài.
  private constructor() {}

  static getInstance(): OrderIdGenerator {
    if (!OrderIdGenerator.instance) {
      OrderIdGenerator.instance = new OrderIdGenerator();
    }
    return OrderIdGenerator.instance;
  }

  generate(): string {
    this.sequence += 1;
    const paddedSequence = String(this.sequence).padStart(6, '0');
    return `${this.prefix}-${paddedSequence}`;
  }

  getInfo(): OrderIdSequenceInfo {
    return { prefix: this.prefix, currentSequence: this.sequence };
  }

  /**
   * Chỉ phục vụ cho unit test: reset lại instance để mỗi test case
   * không bị ảnh hưởng bởi sequence của test trước đó.
   * KHÔNG dùng method này trong code production.
   */
  static resetForTesting(): void {
    OrderIdGenerator.instance = null;
  }
}
