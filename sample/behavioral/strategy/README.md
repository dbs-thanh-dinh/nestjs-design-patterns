# Strategy Pattern (Behavioral)

**Domain minh họa:** Tinh phi van chuyen (`Shipping Fee`) cho don hang - tiep tuc dung
domain `Order` giong sample Factory de de doi chieu.

## Van de

Moi hinh thuc giao hang (Standard, Express, Same-day) co 1 cong thuc tinh phi khac nhau.
Neu don het vao 1 method voi `if/else`, moi lan sua cong thuc cua 1 hinh thuc deu co nguy
co anh huong cac hinh thuc con lai, va rat kho doi thuat toan tinh phi luc runtime (vi du
theo campaign khuyen mai).

## Cach Strategy Pattern giai quyet

- Dinh nghia interface chung `IShippingStrategy` voi method `calculateFee()`.
- Moi hinh thuc giao hang la 1 strategy class rieng, tu chua cong thuc cua minh.
- `ShippingContext` khong tinh toan gi ca - no chi giu 1 strategy hien tai va **uy
  quyen** viec tinh phi cho strategy do. Co the doi strategy bat cu luc nao qua
  `setStrategy()`.

## Khac biet voi Factory Pattern (sample o thu muc `creational/factory`)

- Factory: tap trung vao **cach khoi tao dung object**.
- Strategy: tap trung vao **cach hoan doi thuat toan/hanh vi** luc runtime, object
  duoc tao san va co the doi qua doi lai.

## Cau truc

```
strategy/
├── order-shipping.types.ts
├── without-pattern/
│   └── shipping-calculator.without-pattern.ts
├── with-pattern/
│   ├── shipping-strategy.interface.ts
│   ├── standard-shipping.strategy.ts
│   ├── express-shipping.strategy.ts
│   ├── same-day-shipping.strategy.ts
│   └── shipping-context.ts
├── shipping.spec.ts
├── demo.ts
└── README.md
```

## Chay thu

```bash
npm run sample:strategy
```

## Chay test

```bash
npx jest sample/behavioral/strategy
```
