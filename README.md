# Nardopay (MVP)

Unified payment aggregator for African merchants. Frontend is React + Vite + TypeScript with shadcn-ui. Backend endpoints run as Netlify Functions with Supabase for auth/DB.

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS + shadcn-ui (Radix)
- React Router, TanStack Query
- Netlify Functions for API/Webhooks
- Supabase (Postgres + Auth)

## Quick start

```bash
npm i
cp .env.example .env # fill values
npm run dev
```

Dev server: http://localhost:5173

## Environment

- Client (Vite exposes vars beginning with VITE_):
  - VITE_API_BASE_URL=https://your-domain.com
  - VITE_SUPABASE_URL=...
  - VITE_SUPABASE_ANON_KEY=...

- Server (Netlify site settings → Environment Variables):
  - SUPABASE_SERVICE_ROLE_KEY=...
  - PAYNOW_INTEGRATION_ID=...
  - PAYNOW_INTEGRATION_KEY=...
  - MPESA_CONSUMER_KEY=...
  - MPESA_CONSUMER_SECRET=...
  - MPESA_SHORTCODE=...
  - MPESA_PASSKEY=...
  - PAYSTACK_SECRET_KEY=...

See `.env.example`.

## Project layout

- src/config/env.ts — typed env loader (Zod)
- src/lib/apiClient.ts — fetch wrapper
- src/lib/supabaseClient.ts — browser Supabase client
// health endpoint served by Netlify dev proxy via any function (optional)

Existing UI is fully client-side; we will progressively wire it to API endpoints using React Query.

## Deploy (Netlify)

1) Push to GitHub
2) Connect repo in Netlify
3) Build command: `npm run build`, publish: `dist`
4) Functions dir: `netlify/functions` (already configured in `netlify.toml`)
5) Set environment variables in Netlify UI
6) Deploy and test: `/api/payment-links` (POST) should respond, SPA routes work via redirects

## Supabase

Create a project → copy URL and anon key to client env. Use SQL or Prisma (in a backend service) to create tables for `merchants`, `payment_links`, `transactions`, `webhook_events`, `withdrawals`.

## MVP integrations (fastest path)

- Cards (Visa/Mastercard): Paystack Transactions API (NG), test keys available
- M-Pesa (KE): Safaricom Daraja STK Push, Sandbox available
- EcoCash (ZW): Paynow aggregator (supports EcoCash), test available
- MoMo: MTN MoMo Open API (collections), sandbox available

All providers will call back to Netlify function webhooks. Store normalized transactions in Supabase.

## Next endpoints to add (serverless)

- POST /api/payment-links — create (persist in Supabase)
- GET /api/payment-links/:slug — fetch
- POST /api/checkout — initiate payment (selects provider by country/rail)
- Webhooks:
  - POST /api/webhooks/paystack
  - POST /api/webhooks/mpesa
  - POST /api/webhooks/paynow
  - POST /api/webhooks/mtnmomo

## Developer notes

- Prefer env-driven config; do not hardcode URLs
- Use idempotency keys on write endpoints
- Verify webhook signatures before updating state
