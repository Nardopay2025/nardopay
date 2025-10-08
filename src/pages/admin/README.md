# Nardopay Admin Panel

## Overview
Production-ready admin dashboard for payment aggregator operations, featuring real-time monitoring, provider management, merchant onboarding, and risk/dispute handling.

## Design Tokens

```css
/* Colors (HSL format) */
--background: 220 26% 8%;
--foreground: 210 40% 98%;
--card: 220 28% 10%;
--primary: 200 100% 50%;
--accent: 200 100% 50%;
--green-success: 142 71% 45%;
--destructive: 0 84.2% 60.2%;
--border: 220 28% 15%;

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Border Radius */
--radius-sm: 0.5rem;
--radius-md: 0.75rem;
--radius-lg: 1rem;
--radius-xl: 1.5rem;

/* Elevation / Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-glow: 0 0 40px hsl(var(--primary) / 0.3);

/* Transitions */
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## API Endpoints

### Admin Summary
```typescript
GET /api/admin/summary
Response: {
  totalMerchants: number;
  todayVolume: string;
  transactions24h: number;
  successRate: number;
  pendingSettlements: number;
  chargebacks: number;
}
```

### Providers
```typescript
GET /api/providers
Response: Provider[]

GET /api/providers/:id/metrics
Response: {
  volume24h: string;
  successRate: number;
  declineReasons: { reason: string; count: number }[];
  avgSettlementTime: string;
}

POST /api/providers/:id/test-webhook
Body: { webhookUrl: string }
Response: { success: boolean; message: string }

PATCH /api/providers/:id/config
Body: {
  sandboxMode?: boolean;
  autoRetries?: boolean;
  threeDSEnforcement?: boolean;
}
```

### Transactions
```typescript
GET /api/transactions?merchant=&provider=&status=&startDate=&endDate=&page=&limit=
Response: {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

POST /api/transactions/:id/refund
Body: { amount: number; reason: string }

POST /api/transactions/:id/retry
```

### Merchants
```typescript
POST /api/merchants
Body: {
  businessName: string;
  email: string;
  kycDocuments: File[];
}

GET /api/merchants/:id
PATCH /api/merchants/:id/fees
Body: {
  feePercentage: number;
  fixedFee: number;
  currency: string;
}
```

### Disputes
```typescript
GET /api/disputes?status=&severity=
Response: Dispute[]

PATCH /api/disputes/:id/assign
Body: { agentId: string }

POST /api/disputes/:id/note
Body: { note: string }
```

## Security Checks

### Role-Based Access
- Admin access verified server-side via `profiles.role === 'admin'`
- All endpoints require admin authentication
- No client-side role storage

### Sensitive Data
- API keys masked by default
- Reveal requires additional authentication
- Credentials never logged or exposed in network requests

### Rate Limiting
- Admin endpoints: 100 req/min
- Export endpoints: 10 req/min
- Test webhook: 5 req/min

## Mock Data Structure

```typescript
// Providers
const providers = [
  {
    id: "pesapal",
    name: "Pesapal",
    status: "connected",
    successRate: 98,
    volume24h: "KES 245K",
    credentials: {
      apiKey: "pk_live_xxx",
      secretKey: "sk_live_xxx",
      lastRotated: "2025-01-01"
    },
    webhook: {
      url: "https://api.nardopay.com/webhooks/pesapal",
      deliveries: [
        { timestamp: "2025-01-15 14:23", status: "success" }
      ]
    }
  }
];

// Transactions
const transactions = [
  {
    id: "TXN001",
    merchantId: "merchant_1",
    merchantName: "Acme Corp",
    amount: 45000,
    currency: "KES",
    status: "completed",
    provider: "Pesapal",
    paymentMethod: "card",
    timestamp: "2025-01-15 14:23:00",
    metadata: {}
  }
];

// Disputes
const disputes = [
  {
    id: "DIS001",
    transactionId: "TXN001",
    merchantId: "merchant_1",
    amount: 45000,
    status: "open",
    severity: "high",
    reason: "chargeback",
    assignedTo: null,
    notes: [],
    createdAt: "2025-01-15"
  }
];
```

## Features Implemented

✅ Main Dashboard with KPIs
✅ Interactive volume & payment method charts
✅ Provider management cards with quick metrics
✅ Provider detail modal with credentials, webhooks, settings
✅ Transactions table with filters and actions
✅ Alerts & notifications panel
✅ Admin role-based authentication
✅ Responsive layout (desktop/tablet/mobile)
✅ Dark glassy UI with smooth animations

## Next Steps

To complete the admin panel:
1. Connect real data sources (replace mock data)
2. Implement merchant onboarding flow
3. Build dispute queue UI
4. Add export functionality (CSV/XLSX/PDF)
5. Implement 2FA for sensitive actions
6. Add real-time updates via WebSocket/Supabase Realtime
7. Create automated fraud rules editor
8. Add audit logging for admin actions
