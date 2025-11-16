## NardoPay – Modern Payments & Links for African Merchants

NardoPay is a multi-provider payment platform for African businesses. It lets merchants create payment links, donation links, catalogues, and subscriptions while routing payments across providers like **Pesepay**, **Pesapal**, and **Paymentology** using smart rules.

### Tech stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Supabase (Postgres, Auth, Edge Functions)
- **Payments**: Pesepay, Pesapal, Paymentology (via Supabase Edge Functions)

---

### Project structure (high-level)

- **`src/`** – Frontend app
  - `src/pages/` – Top-level routes (marketing pages, dashboard, `/pay/*` flows)
  - `src/components/` – Reusable UI and dashboard widgets
  - `src/lib/` – Core domain logic:
    - `paymentRouter.ts` – Smart routing to Pesepay/Pesapal/Paymentology
    - `withdrawalRouter.ts` – Routing for withdrawals (MTN MoMo, virtual card, manual)
  - `src/contexts/AuthContext.tsx` – Supabase auth session handling
  - `src/integrations/supabase/` – Typed Supabase client and DB types
- **`supabase/functions/`** – Edge Functions (payments, IPNs, emails, provider configs)
- **`supabase/migrations/`** – Database schema and RLS policies
- **`docs/`** – Product and expansion specs

---

### Getting started (local development)

**Prerequisites**

- Node.js 18+ and npm or bun
- Supabase project (see `supabase/config.toml`)

**1. Clone & install**

```sh
git clone <YOUR_GIT_URL>
cd nardopay
npm install
```

**2. Configure environment**

Create a `.env` (or `.env.local`) with at least:

```sh
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

Recommended backend/env variables (set in Supabase or your hosting):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_DASHBOARD_ORIGIN` (e.g. `https://admin.nardopay.com`)
- `PUBLIC_APP_ORIGIN` (e.g. `https://app.nardopay.com`)
- Provider credentials: `PESAPAL_*`, `PESEPAY_*`, `PAYMENTOLOGY_*`, `RESEND_API_KEY`

**3. Run the app**

```sh
npm run dev
```

Vite will start the frontend; Supabase Edge Functions are deployed from the `supabase/functions` folder using the Supabase CLI.

---

### Architecture overview

- **Authentication**
  - Supabase Auth (email/password + Google OAuth) via `AuthContext`.
  - Sessions are persisted in `localStorage`; secure operations (config, payments) are protected by RLS and edge-function role checks.

- **Payments**
  - `src/lib/paymentRouter.ts` determines which provider to use based on:
    - Payment method (`card`, `mobile_money`, `bank_transfer`)
    - Customer phone and merchant country (with `provider_country_overrides` + `fx_rates`)
  - Frontend calls Supabase Edge Functions:
    - `pesepay-submit-order` for Zimbabwe mobile/bank flows.
    - `pesapal-submit-order` for East Africa flows.
    - `paymentology-accept-payment` for card payments.
  - Each function:
    - Validates input with **Zod**
    - Applies provider-specific auth (keys, encryption)
    - Writes a `transactions` row with metadata and redirects the customer to the provider.

- **Security & data access**
  - **RLS enabled** on profiles, links, catalogues, transactions, roles, configs:
    - Merchants only see their own records (`user_id = auth.uid()`).
    - Admin-only tables (`payment_provider_configs`, `admin_audit_logs`) are gated by `user_roles.role = 'admin'`.
    - Infra tables (`provider_country_overrides`, `fx_rates`) are read-only to the public and writable only by the `service_role`.
  - Sensitive provider keys are never exposed to the client; they are read only inside Edge Functions using the **service role key** and env vars.

- **Emails**
  - `send-auth-email` and `send-payment-emails` functions use **Resend** and React-based templates for:
    - Auth flows (signup, magic link, recovery, email change)
    - Merchant payment notifications, customer receipts, withdrawal emails, and service notices.

---

### Coding standards & conventions

- **TypeScript-first**: All business logic lives in typed modules (`src/lib/*`, Edge Functions use Zod for runtime validation).
- **Separation of concerns**:
  - UI components are presentational.
  - Routing and provider selection are centralized in `paymentRouter.ts` and `withdrawalRouter.ts`.
  - Side effects (DB writes, external APIs) live in Supabase Edge Functions.
- **Security**
  - No secrets in the repo; Supabase client requires env vars.
  - Edge Functions use `SUPABASE_SERVICE_ROLE_KEY` and check admin roles via `user_roles` before mutating configs.
  - CORS is restricted using `ADMIN_DASHBOARD_ORIGIN` and `PUBLIC_APP_ORIGIN` where appropriate.

---

### Deployment

- Frontend can be deployed to any static host (Netlify, Vercel, etc.) using `npm run build`.
- Backend is Supabase-managed:
  - Database and auth via Supabase.
  - Edge Functions in `supabase/functions/*` deployed via Supabase CLI:

```sh
supabase functions deploy pesepay-submit-order
supabase functions deploy pesapal-submit-order
supabase functions deploy paymentology-accept-payment
supabase functions deploy manage-payment-configs
supabase functions deploy send-auth-email
supabase functions deploy send-payment-emails
```

Ensure your environment variables and RLS policies are configured in Supabase before going live.
