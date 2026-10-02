# Proxy Pattern (Structural)

**Domain minh họa:** Tra cứu **chi tiết đơn hàng** (`Order Details`) từ 1 nguồn
**tốn kém chi phí** (giả lập database/API bên ngoài có độ trễ, chi phí tính toán
cao) — cụ thể là **Caching Proxy**, loại proxy phổ biến nhất.

## Phân biệt với Adapter và Facade

Cả 3 pattern đều "đứng giữa" client và code khác, nhưng mục đích khác nhau:

| | Adapter | Facade | Proxy |
|---|---|---|---|
| Interface so với đối tượng bên dưới | Khác — phải **chuyển đổi** | Không liên quan trực tiếp — **gộp** nhiều subsystem | **Giống hệt** — cùng implement 1 interface |
| Mục tiêu | Làm 2 interface không khớp trở nên tương thích | Đơn giản hóa việc gọi nhiều hệ thống con | Kiểm soát/tối ưu việc truy cập tới 1 đối tượng — cache, kiểm tra quyền, lazy-load... |
| Client có biết đang không gọi trực tiếp không? | Có (biết đang dùng adapter) | Có (biết đang dùng facade) | **Không nên biết** — proxy "trong suốt" |

## Vấn đề

Nếu mỗi nơi cần tra cứu đơn hàng tự viết cache riêng, các cache đó **không chia
sẻ với nhau**:

```ts
// OrderSummaryService tu cache rieng cho chinh no
class OrderSummaryServiceWithoutPattern {
  private readonly cache = new Map();
  getOrderSummary(orderId) { /* co cache */ }
}

// OrderInvoiceService - QUEN cache, goi thang nguon that moi lan
class OrderInvoiceServiceWithoutPattern {
  getOrderForInvoice(orderId) {
    return this.realService.getOrderDetails(orderId); // khong cache!
  }
}
```

Dù cả 2 service cùng tra cứu **1 đơn hàng**, nguồn tốn kém (`RealOrderQueryService`)
vẫn bị gọi lại nhiều lần không cần thiết — vì 2 cache tồn tại độc lập, không biết
gì về nhau.

## Cách Proxy Pattern giải quyết

- `CachingOrderQueryProxy` implement **cùng interface** `IOrderQueryService` với
  `RealOrderQueryService` — người gọi hoàn toàn không phân biệt được đang làm
  việc với nguồn thật hay proxy (**tính "trong suốt"** đặc trưng của Proxy).
- Proxy kiểm tra cache trước khi quyết định có gọi tới nguồn thật hay không.
- **Mọi consumer dùng chung 1 proxy instance** → cache được **chia sẻ** giữa tất
  cả, không còn tình trạng 2 nơi tra cứu cùng 1 đơn hàng nhưng không biết về
  nhau.
- Logic cache chỉ tồn tại ở 1 nơi duy nhất — dễ đổi chiến lược (thêm TTL, giới
  hạn kích thước cache...) mà không đụng đến code nghiệp vụ.

## Cấu trúc

```
proxy/
├── order-query.types.ts
├── real-order-query.service.ts    # Real Subject - nguon ton kem, dung chung
├── without-pattern/
│   └── order-lookup.without-pattern.ts
├── with-pattern/
│   ├── caching-order-query.proxy.ts
│   └── order-invoice.service.ts    # consumer, chi biet den interface
├── order-query-proxy.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:proxy
```

## Chạy test

```bash
npx jest sample/structural/proxy
```
