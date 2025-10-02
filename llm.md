# NardoPay Complete System Documentation

## 🎯 Vision & Mission

NardoPay is a comprehensive payment infrastructure that enables African businesses to accept payments through multiple channels while providing unified financial tools for growth. Our platform bridges the gap between global payment standards and local African payment methods.

### Core Mission
- Make online payments accessible and simple for African businesses
- Support multiple payment methods (cards, mobile money, bank transfers)
- Provide a unified dashboard for payment management
- Enable cross-border transactions across African countries

## 🌍 Target Markets

### Phase 1: Nigeria & Kenya
- E-commerce platforms
- SaaS companies
- SME retailers transitioning to digital payments
- Freelancers and agencies

### Phase 2: Ghana & South Africa
- Local bank integration
- MTN Mobile Money & Vodacom M-Pesa

### Phase 3: Regional Expansion
- Rwanda, Uganda, Tanzania, Zambia
- Cross-border payments

## 💳 Payment Capabilities

### Global Card Schemes
- Visa, Mastercard, American Express
- Real-time authorization and settlement
- 3D Secure authentication
- Fraud prevention and risk management

### African Mobile Wallets
- **M-Pesa**: Kenya, Tanzania, Uganda
- **MTN Mobile Money**: Ghana, Uganda, Rwanda, Cameroon
- **Airtel Money**: Kenya, Tanzania, Rwanda, Zambia
- **Orange Money**: Senegal, Mali, Burkina Faso

### Local Banking Integration
- Direct bank transfers via major African banks
- USSD sessions for feature phone users
- Cash collection through agency banking networks
- Real-time balance inquiries and transaction status

## 📊 Dashboard Architecture

### Dashboard Structure Overview

The NardoPay dashboard is a fully responsive, tab-based single-page application with a collapsible sidebar navigation system. It's built using React with TypeScript and follows a component-based architecture.

### Main Dashboard Component (`Dashboard.tsx`)

**Location**: `src/components/dashboard/Dashboard.tsx`

**Purpose**: Main orchestrator component that manages state and renders different dashboard views

**Key State Management**:
```typescript
// Navigation & UI State
- activeTab: string (current view - 'dashboard' | 'create-link' | 'send-money' | 'make-payment' | 'deposit' | 'withdraw' | 'history' | 'payment-links' | 'donation-links' | 'subscription-links' | 'catalogue' | 'send' | 'direct-pay' | 'settings')
- sidebarCollapsed: boolean (sidebar collapsed state for desktop)
- mobileSidebarOpen: boolean (mobile sidebar overlay visibility)

// Data State
- createdLinks: any[] (payment links created by user)
- createdDonationLinks: any[] (donation links created by user)
- createdSubscriptionLinks: any[] (subscription links created by user)
- createdCatalogues: any[] (catalogues created by user)
- transfers: any[] (transaction history)
- showLinksModal: boolean (modal visibility state)
```

**Context Dependencies**:
- `useAuth()` - User authentication and logout
- `useInvoiceSettings()` - Invoice configuration
- `usePaymentLinks()` - Payment links management
- `useDonationLinks()` - Donation links management
- `useSubscriptionLinks()` - Subscription links management
- `useCatalogue()` - Catalogue management
- `useDynamicUrls()` - URL generation

**Layout Structure**:
```
<div className="min-h-screen w-full bg-background">
  {/* Mobile Sidebar Overlay */}
  <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
  
  {/* Sidebar (Fixed, Collapsible) */}
  <div className="fixed left-0 top-0 h-full z-50 transition-transform">
    <DashboardSidebar />
  </div>
  
  {/* Main Content Area */}
  <main className="min-h-screen transition-all lg:ml-64|lg:ml-16">
    {/* Sticky Header */}
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
      {/* Mobile: Menu Toggle + Logo + Avatar */}
      {/* Desktop: User Info + Avatar */}
    </header>
    
    {/* Page Content */}
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {renderContent()} {/* Dynamic content based on activeTab */}
      </div>
    </div>
  </main>
</div>
```

**Responsive Behavior**:
- **Mobile (< lg breakpoint)**:
  - Sidebar hidden by default, slides in from left when opened
  - Hamburger menu button in header
  - Full-width logo and avatar in header
  - Overlay backdrop when sidebar is open
  
- **Desktop (≥ lg breakpoint)**:
  - Sidebar always visible, fixed position
  - Can collapse to icon-only view (w-64 → w-16)
  - Main content shifts with margin-left
  - User info displayed in header
  - No hamburger menu

**Tab Navigation System**:
```typescript
renderContent() switches between:
  'dashboard' → DashboardOverview
  'create-link' → CreateLinkSection
  'send-money' → SendMoneySection
  'make-payment' → MakePaymentSection
  'deposit' → DepositSection
  'withdraw' → WithdrawSection
  'history' → HistorySection
  'payment-links' → PaymentLinksForm
  'donation-links' → DonationLinksForm
  'subscription-links' → SubscriptionLinksForm
  'catalogue' → CatalogueForm
  'send' → SendMoneyForm
  'direct-pay' → DirectPayForm
  'settings' → SettingsForm
```

---

### Dashboard Sidebar Component (`DashboardSidebar.tsx`)

**Location**: `src/components/dashboard/DashboardSidebar.tsx`

**Purpose**: Fixed navigation sidebar with collapsible functionality

**Props Interface**:
```typescript
interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  user: any;
  logout: () => void;
}
```

**Navigation Items**:
```typescript
const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'create-link', label: 'Create a Link', icon: Plus },
  { id: 'send-money', label: 'Send Money', icon: Send },
  { id: 'make-payment', label: 'Make Payment', icon: CreditCard },
  { id: 'deposit', label: 'Deposit', icon: PiggyBank },
  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];
```

**Visual Design**:
```css
/* Sidebar Container */
- Background: gradient from blue-500 to blue-700
- Border: blue-600 on right edge
- Width: 264px (expanded) | 64px (collapsed)
- Position: fixed left-0 top-0
- Height: 100vh
- z-index: 50

/* Header Section */
- Logo: White square with blue "N"
- Brand name: "Nardopay" (hidden when collapsed)
- Collapse toggle button (Eye icon)

/* Navigation Section */
- Flex-1 scrollable area
- 2-space gap between items
- Active state: white background, blue-600 text
- Inactive state: transparent, white text
- Hover: blue-600/50 background

/* User Section (Bottom) */
- Border-top: blue-600
- User avatar (circle, white bg)
- User name and email (hidden when collapsed)
- Logout button with icon
```

**Collapsed State Behavior**:
- Width shrinks to 64px
- Logo text hidden
- Navigation labels hidden (icons only)
- User details hidden
- Logout text hidden (icon only)
- Maintains all functionality

---

### Dashboard Overview Component (`DashboardOverview.tsx`)

**Location**: `src/components/dashboard/DashboardOverview.tsx`

**Purpose**: Main dashboard landing page displaying key metrics and sections

**Props Interface**:
```typescript
interface DashboardOverviewProps {
  user: any;
  setActiveTab: (tab: string) => void;
  setShowLinksModal: (show: boolean) => void;
  createdLinks: any[];
  createdDonationLinks: any[];
  createdSubscriptionLinks: any[];
  createdCatalogues: any[];
  transfers: any[];
}
```

**Section Layout (Ordered)**:

1. **Balance Section**
   - Component: `<BalanceSection />`
   - Shows current account balance
   - Quick deposit/withdraw actions
   
2. **Quick Actions Section** (Mobile Only)
   - Component: `<QuickActionsSection />`
   - Display: `lg:hidden`
   - Fast access to common tasks
   
3. **Active Links Section**
   - Component: `<ActiveLinksSection />`
   - Shows all created payment/donation/subscription links and catalogues
   - Link management and status
   
4. **Charts Section** (2-Column Grid)
   - Layout: `grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6`
   - Left: `<IncomeChart />` - Revenue over time
   - Right: `<RevenuePieChart />` - Revenue breakdown
   
5. **Virtual Card Section**
   - Component: `<VirtualCardSection />`
   - Displays virtual card information
   - Subscription metrics
   
6. **History Section**
   - Component: `<DashboardHistorySection />`
   - Recent transactions and transfers
   - Quick link to full history
   
7. **Quick Actions Section** (Desktop Only)
   - Component: `<QuickActionsSection />`
   - Display: `hidden lg:block`
   - Same as #2 but for desktop

**Responsive Spacing**:
```css
- Container: space-y-6 sm:space-y-8
- Charts Grid: gap-4 sm:gap-6
```

---

### Dashboard Component Files Structure

```
src/components/dashboard/
├── Dashboard.tsx                 # Main orchestrator
├── DashboardSidebar.tsx         # Navigation sidebar
├── DashboardOverview.tsx        # Overview page layout
├── CreateLinkSection.tsx        # Create link view
├── SendMoneySection.tsx         # Send money view
├── MakePaymentSection.tsx       # Make payment view
├── DepositSection.tsx           # Deposit view
├── WithdrawSection.tsx          # Withdraw view
├── index.ts                     # Exports
├── forms/
│   ├── PaymentLinksForm.tsx
│   ├── DonationLinksForm.tsx
│   ├── SubscriptionLinksForm.tsx
│   ├── CatalogueForm.tsx
│   ├── SendMoneyForm.tsx
│   ├── DirectPayForm.tsx
│   └── SettingsForm.tsx
└── sections/
    ├── BalanceSection.tsx
    ├── ActiveLinksSection.tsx
    ├── IncomeChart.tsx
    ├── RevenuePieChart.tsx
    ├── VirtualCardSection.tsx
    ├── HistorySection.tsx
    ├── DashboardHistorySection.tsx
    ├── QuickActionsSection.tsx
    └── index.ts
```

---

### Key Dashboard Features

#### 1. Sidebar Navigation
- Fixed position on desktop
- Slide-over overlay on mobile
- Collapsible to icon-only view
- Active state highlighting
- Smooth transitions

#### 2. Sticky Header
- Always visible at top
- Mobile: Hamburger + Logo + Avatar
- Desktop: User info + Avatar
- Backdrop blur effect
- Semi-transparent background

#### 3. Tab-Based Content Switching
- No page reloads
- State preserved between tab switches
- Smooth transitions
- Deep linking support via activeTab

#### 4. Mobile-First Responsive Design
- Breakpoint: lg (1024px)
- Mobile: Full-width sidebar overlay
- Desktop: Fixed sidebar + shifted content
- Adaptive spacing and typography

#### 5. Data Flow
- Contexts provide global state
- Props drilling for component communication
- useEffect for URL generation
- Auto-close mobile sidebar on navigation

---

### Implementation Guide for Rebuilding

**Step 1: Create Dashboard.tsx**
- Import all required contexts and components
- Set up state management (activeTab, sidebar states, data arrays)
- Implement renderContent() switch statement
- Build responsive layout structure with sidebar and main content
- Add mobile overlay and transitions

**Step 2: Create DashboardSidebar.tsx**
- Define sidebarItems array with icons
- Build three-section layout (header, nav, user)
- Implement collapse toggle functionality
- Style with blue gradient and white accents
- Add responsive text hiding on collapse

**Step 3: Create DashboardOverview.tsx**
- Import all section components from './sections'
- Define props interface
- Build ordered section layout
- Implement responsive grid for charts
- Add conditional rendering for mobile/desktop Quick Actions

**Step 4: Connect Components**
- Export from index.ts files
- Wire up contexts in parent component
- Ensure all setActiveTab callbacks work
- Test responsive behavior at all breakpoints

**Critical Design Specifications**:
- Sidebar: `bg-gradient-to-b from-blue-500 to-blue-700`
- Active nav item: `bg-white text-blue-600`
- Inactive nav item: `text-white hover:bg-blue-600/50`
- Border color: `border-blue-600`
- Transitions: `transition-all duration-300`
- Z-indexes: sidebar=50, header=30, overlay=40
- Breakpoint: lg (1024px) for responsive behavior

### 2. Payment Links
**Purpose**: Create shareable links for receiving payments

**Features**:
- Single payment links with fixed or variable amounts
- Product name and description
- Custom thank you messages
- Redirect URLs after successful payment
- QR code generation for easy sharing
- Track payments per link
- View total amount collected
- Active/Inactive status toggle

**Form Fields**:
- Amount (in selected currency)
- Currency (KES, NGN, USD, GHS, ZAR)
- Product/Service Name
- Description
- Thank You Message
- Redirect URL (optional)

### 3. Donation Links
**Purpose**: Create donation campaigns with goal tracking

**Features**:
- Campaign title and description
- Goal amount with progress tracking
- Visual progress bar
- Multiple donation tracking
- Donor management
- Share via social media
- Custom thank you messages
- Recurring donation support

**Form Fields**:
- Campaign Title
- Description
- Goal Amount
- Currency
- Thank You Message
- Redirect URL (optional)
- Enable/Disable recurring donations

### 4. Subscription Links
**Purpose**: Manage recurring payment subscriptions

**Features**:
- Flexible billing cycles (daily, weekly, monthly, yearly)
- Subscriber management
- Automatic renewal tracking
- Cancellation handling
- Trial period support
- Revenue tracking per subscription
- Active subscriber count

**Form Fields**:
- Plan Name
- Description
- Amount
- Currency
- Billing Cycle
- Trial Period (optional)
- Thank You Message
- Redirect URL

### 5. Catalogue
**Purpose**: Create product catalogues with multiple items

**Features**:
- Multiple items per catalogue
- Item images and descriptions
- Inventory tracking
- Pricing per item
- Cart functionality for customers
- Checkout page generation
- Order management
- Stock alerts

**Catalogue Structure**:
- Catalogue Name
- Description
- Currency
- Items:
  - Name
  - Description
  - Price
  - Image URL
  - Stock quantity
  - SKU

### 6. Direct Pay
**Purpose**: Quick one-time payments

**Features**:
- Instant payment to phone numbers or email
- Multiple payment methods
- Payment confirmation
- Receipt generation
- Transaction history

**Form Fields**:
- Recipient (phone/email)
- Amount
- Currency
- Payment Method
- Description/Note

### 7. Send Money
**Purpose**: Transfer money to other users or bank accounts

**Features**:
- Send to NardoPay users
- Send to bank accounts
- Send to mobile money
- Scheduled transfers
- Bulk transfers
- Transfer history
- Fee calculation

**Form Fields**:
- Recipient Type (NardoPay/Bank/Mobile)
- Recipient Details
- Amount
- Currency
- Schedule (optional)
- Note/Reference

### 8. Deposit & Withdraw
**Purpose**: Manage account balance

**Deposit Methods**:
- Bank transfer
- Card payment
- Mobile money
- Cash deposit (via agents)

**Withdraw Methods**:
- Bank transfer
- Mobile money
- Check withdrawal
- Instant payout (premium)

### 9. Settings
**Purpose**: Manage account and business settings

**Sections**:
- **Profile Settings**:
  - Business name
  - Email
  - Phone number
  - Avatar
  - KYC documents
  
- **Invoice Settings**:
  - Business logo
  - Business address
  - Tax ID
  - Invoice footer
  - Default currency
  
- **Payment Settings**:
  - Accepted payment methods
  - Settlement preferences
  - Payout schedule
  
- **Security**:
  - Change password
  - Two-factor authentication
  - API keys
  - Webhook endpoints
  
- **Notifications**:
  - Email notifications
  - SMS alerts
  - Webhook events
  
- **Team Management**:
  - Add team members
  - Role assignments
  - Permission management

### 10. Analytics & Reports
**Purpose**: Business intelligence and insights

**Features**:
- Revenue trends
- Transaction volume
- Success rate tracking
- Payment method breakdown
- Geographic distribution
- Customer insights
- Export reports (CSV, PDF)
- Custom date ranges
- Comparison views

## 🗄️ Database Schema

### Tables Overview

#### 1. `profiles`
User profile information linked to auth.users
```sql
- id (uuid, FK to auth.users)
- full_name (text)
- business_name (text)
- phone (text)
- avatar_url (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. `user_roles`
Role-based access control (RBAC)
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- role (enum: admin, moderator, user)
- unique constraint on (user_id, role)
```

#### 3. `payment_links`
Single payment links
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- amount (numeric)
- currency (text)
- product_name (text)
- description (text)
- thank_you_message (text)
- redirect_url (text)
- link_code (text, unique)
- status (enum: active, inactive)
- payments_count (integer)
- total_amount_collected (numeric)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. `donation_links`
Donation campaign links
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- title (text)
- description (text)
- goal_amount (numeric)
- currency (text)
- current_amount (numeric, default 0)
- thank_you_message (text)
- redirect_url (text)
- link_code (text, unique)
- status (enum: active, inactive)
- donations_count (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. `subscription_links`
Recurring subscription plans
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- plan_name (text)
- description (text)
- amount (numeric)
- currency (text)
- billing_cycle (enum: daily, weekly, monthly, yearly)
- trial_days (integer)
- thank_you_message (text)
- redirect_url (text)
- link_code (text, unique)
- status (enum: active, inactive)
- subscribers_count (integer)
- total_revenue (numeric)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 6. `catalogues`
Product catalogues
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- name (text)
- description (text)
- currency (text)
- link_code (text, unique)
- status (enum: active, inactive)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 7. `catalogue_items`
Items within catalogues
```sql
- id (uuid, PK)
- catalogue_id (uuid, FK to catalogues)
- name (text)
- description (text)
- price (numeric)
- image_url (text)
- stock_quantity (integer)
- sku (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 8. `transactions`
All payment transactions
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- type (enum: payment, donation, subscription, transfer, deposit, withdrawal)
- amount (numeric)
- currency (text)
- status (enum: pending, completed, failed, refunded)
- payment_method (text)
- reference (text)
- description (text)
- metadata (jsonb)
- created_at (timestamp)
- completed_at (timestamp)
```

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only see their own data
- Admins can see all data
- Public can access payment/donation/subscription/catalogue pages via link_code

### Security Functions

```sql
-- Check if user has specific role
has_role(user_id uuid, role app_role) returns boolean

-- Automatic profile creation on signup
handle_new_user() trigger function
```

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Sign Up**:
   - Email/password registration
   - Email verification
   - Automatic profile creation
   - Default role assignment (user)

2. **Login**:
   - Email/password authentication
   - Session management via Supabase Auth
   - Redirect to dashboard on success
   - Remember me option

3. **Logout**:
   - Clear session
   - Redirect to home page

### Authorization Levels
- **User**: Basic access to create links and manage own payments
- **Moderator**: Can view analytics and reports
- **Admin**: Full access to all features and user management

### Protected Routes
- `/dashboard` - Requires authentication
- All dashboard sub-routes require authentication
- Payment/donation/subscription pages are public via unique codes

## 🎨 Design System

### Color Tokens (HSL)
```css
--primary: Primary brand color
--secondary: Secondary actions
--accent: Highlights and CTAs
--background: Page background
--foreground: Text color
--card: Card background
--muted: Muted text
--destructive: Error states
```

### Component Library
- Built with shadcn/ui
- Tailwind CSS for styling
- Responsive design
- Dark mode support
- Accessible (WCAG AA)

## 🔌 API Architecture

### Core Resources

#### Payment Intents API
```json
POST /v1/payment_intents
{
  "amount": 5000,
  "currency": "KES",
  "payment_methods": ["card", "mpesa", "bank_transfer"],
  "customer": {
    "email": "customer@example.com",
    "phone": "+254712345678"
  },
  "metadata": {
    "order_id": "ORD_123456"
  }
}
```

#### Payment Methods
- Card (Visa, Mastercard, Amex)
- M-Pesa
- MTN Mobile Money
- Airtel Money
- Bank Transfer
- USSD

#### Webhooks
Subscribe to events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `subscription.created`
- `subscription.cancelled`
- `payout.paid`
- `refund.created`

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide Icons** for iconography

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **Supabase Storage** for file uploads
- **Edge Functions** for serverless logic
- **Row Level Security** for data protection

### State Management
- React Context API for global state
- Local state for component-specific data
- Context providers:
  - AuthContext
  - PaymentLinksContext
  - DonationLinksContext
  - SubscriptionLinksContext
  - CatalogueContext
  - InvoiceSettingsContext

### Data Persistence
- Supabase PostgreSQL for production data
- LocalStorage for client-side caching
- Context + LocalStorage for offline support

## 🚀 User Flows

### Creating a Payment Link
1. Navigate to Dashboard
2. Click "Create Link" or "Payment Links" in sidebar
3. Fill out form:
   - Amount
   - Currency
   - Product name
   - Description
   - Thank you message
   - Redirect URL
4. Submit form
5. Receive unique payment link
6. Share link via social media, email, or QR code

### Receiving a Payment
1. Customer clicks payment link
2. Redirected to payment page
3. Select payment method
4. Enter payment details
5. Confirm payment
6. Process payment
7. Show thank you message
8. Redirect to merchant URL (if provided)
9. Send notification to merchant
10. Update transaction history

### Managing Subscriptions
1. Create subscription link with billing cycle
2. Customer subscribes via link
3. Automatic charge on billing cycle
4. Send receipt to customer
5. Update subscriber count
6. Handle failed payments (retry logic)
7. Allow customer to cancel subscription

### Catalogue Checkout
1. Create catalogue with multiple items
2. Customer visits catalogue page
3. Browse items
4. Add items to cart
5. Proceed to checkout
6. Select payment method
7. Complete payment
8. Receive order confirmation
9. Merchant receives order notification

## 💰 Pricing Structure

### Transaction Fees
- **Local Cards**: 2.9% + ₦50
- **International Cards**: 3.9% + ₦100
- **M-Pesa**: 1.5% per transaction
- **Bank Transfer**: 1.0% per transaction

### Settlement Schedule
- T+1 for mobile money transactions
- T+2 for card payments
- T+0 available for high-volume merchants (additional fee)

### Monthly Fees
- Free for businesses processing <₦1M monthly
- ₦5,000 for businesses processing >₦1M monthly
- Enterprise plans with custom pricing

## 🔒 Security & Compliance

### Security Measures
- End-to-end encryption (TLS 1.3)
- Data tokenization for sensitive info
- PCI DSS Level 1 compliance
- 3D Secure authentication
- Fraud detection with ML models
- Two-factor authentication
- API key management
- Webhook signature verification

### Compliance
- **Kenya**: CBK payment service provider license
- **Nigeria**: CBN switching and processing license
- **Ghana**: Bank of Ghana payment system license
- **GDPR**: Data protection and privacy
- **KYC/AML**: Identity verification and monitoring

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation
- Encrypted storage
- Regular security audits
- Audit logs for all actions

## 📱 Responsive Design

All dashboard features work seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

### Mobile-First Features
- Collapsible sidebar
- Touch-friendly buttons
- Optimized forms
- Swipeable cards
- Bottom navigation
- Pull-to-refresh

## 🌐 Internationalization

### Supported Languages
- English (default)
- French
- Swahili
- Yoruba
- Igbo
- Hausa

### Supported Currencies
- KES (Kenyan Shilling)
- NGN (Nigerian Naira)
- GHS (Ghanaian Cedi)
- ZAR (South African Rand)
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)

## 📈 Growth Roadmap

### Phase 1 (Current)
- ✅ Payment Links
- ✅ Donation Links
- ✅ Subscription Links
- ✅ Catalogue
- ✅ Dashboard Analytics
- ✅ Transaction History
- 🔄 Supabase Integration
- 🔄 Authentication System

### Phase 2 (Next 3 months)
- [ ] Mobile Money Integration (M-Pesa)
- [ ] Card Payment Processing
- [ ] Webhook System
- [ ] API for Developers
- [ ] Invoice Generation
- [ ] Receipt Management
- [ ] Advanced Analytics

### Phase 3 (6 months)
- [ ] Multi-currency Support
- [ ] Cross-border Payments
- [ ] Virtual Cards
- [ ] Bulk Transfers
- [ ] Team Management
- [ ] White-label Solution
- [ ] Mobile Apps (iOS/Android)

### Phase 4 (12 months)
- [ ] Marketplace Integration
- [ ] E-commerce Plugins
- [ ] POS Integration
- [ ] Lending Products
- [ ] Insurance Products
- [ ] Investment Products

## 🎯 Key Performance Indicators (KPIs)

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn Rate
- Active Merchants
- Transaction Volume
- Average Transaction Value

### Technical Metrics
- API Response Time
- Uptime (99.9% SLA)
- Payment Success Rate
- Error Rate
- Page Load Time
- Time to First Byte (TTFB)

### User Metrics
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session Duration
- Feature Adoption Rate
- Net Promoter Score (NPS)

## 🤝 Support & Resources

### Customer Support
- 24/7 Chat Support
- Email: support@nardopay.com
- Phone: Available during business hours
- WhatsApp: +254 XXX XXX XXX

### Developer Resources
- API Documentation
- SDK Libraries (Node.js, Python, PHP)
- Code Examples
- Integration Guides
- Video Tutorials
- Developer Forum

### Business Resources
- Knowledge Base
- Best Practices Guide
- Case Studies
- Webinars
- Blog Articles
- Community Forum

---

**Last Updated**: 2025-10-02  
**Version**: 1.0.0  
**Status**: In Development

**Next Steps**:
1. Complete Supabase integration
2. Implement M-Pesa integration
3. Add card payment processing
4. Build webhook system
5. Create API documentation
6. Launch beta program
