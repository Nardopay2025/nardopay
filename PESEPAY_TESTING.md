# Pesepay Integration Testing Guide

## Prerequisites

1. **Pesepay Sandbox Credentials**
   - Contact Pesepay to get your sandbox/test credentials
   - You'll need:
     - Integration Key (stored as `consumer_key` in database)
     - Encryption Key (stored as `consumer_secret` in database)

2. **Supabase Project Access**
   - Access to Supabase dashboard
   - Admin access to NardoPay

## Step 1: Configure Pesepay Credentials

### Via Admin Panel (Recommended)

1. **Login as Admin**
   - Go to your NardoPay dashboard
   - Navigate to Admin → Settings → Payment Providers

2. **Add Pesepay Configuration**
   - Click "Add Config" button
   - Fill in the form:
     - **Provider**: Select "Pesepay"
     - **Country**: Select "Zimbabwe (ZW)"
     - **Environment**: Select "sandbox" (for testing)
     - **Consumer Key**: Enter your Pesepay Integration Key
     - **Consumer Secret**: Enter your Pesepay Encryption Key
     - **IPN ID**: Leave empty (not required for initial testing)
     - **Active**: Toggle ON
   - Click "Create"

### Via SQL (Alternative)

If you prefer to add credentials directly via SQL:

```sql
INSERT INTO payment_provider_configs (
  provider,
  country_code,
  environment,
  consumer_key,
  consumer_secret,
  is_active
) VALUES (
  'pesepay',
  'ZW',
  'sandbox',
  'YOUR_INTEGRATION_KEY_HERE',
  'YOUR_ENCRYPTION_KEY_HERE',
  true
);
```

## Step 2: Create a Test Payment Link

1. **Login as Merchant**
   - Go to Dashboard → Payment Links
   - Click "Create Payment Link"

2. **Fill in Test Details**
   - **Product Name**: "Test Payment - Pesepay"
   - **Amount**: 10.00 (or any test amount)
   - **Currency**: USD or ZWL (check Pesepay supported currencies)
   - **Description**: "Testing Pesepay integration"
   - **Status**: Active

3. **Save the Link**
   - Copy the generated link code

## Step 3: Test Payment Flow

### Option A: Test via Payment Link Page

1. **Open Payment Link**
   - Navigate to: `/pay/{linkCode}`
   - Example: `https://yourdomain.com/pay/ABCD1234EFGH5678`

2. **Fill Customer Details**
   - Name: "Test Customer"
   - Email: "test@example.com"
   - Phone: "+263771234567" (Zimbabwe format)

3. **Select Payment Method**
   - Choose "Mobile Money" or "Bank Transfer"
   - Note: Make sure the merchant's country is set to "ZW" (Zimbabwe)

4. **Proceed to Checkout**
   - Click "Proceed to Checkout"
   - The system should:
     - Call `pesepay-submit-order` edge function
     - Encrypt the payload
     - Submit to Pesepay API
     - Receive encrypted response
     - Decrypt response
     - Redirect you to Pesepay's payment page (pollUrl)

5. **Complete Payment on Pesepay**
   - Follow Pesepay's payment instructions
   - Use test credentials provided by Pesepay

6. **Verify Callback**
   - After payment, you'll be redirected to `/payment-callback`
   - Check if transaction status is updated to "completed"

### Option B: Test via API Directly

You can test the edge function directly:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/pesepay-submit-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "linkCode": "YOUR_LINK_CODE",
    "linkType": "payment",
    "payerName": "Test Customer",
    "payerEmail": "test@example.com",
    "paymentMethod": "mobile_money"
  }'
```

## Step 4: Monitor Logs and Debug

### Supabase Edge Function Logs

1. **View Logs**
   - Go to Supabase Dashboard → Edge Functions
   - Click on `pesepay-submit-order`
   - View "Logs" tab

2. **Check for Errors**
   - Look for encryption/decryption errors
   - Check API response errors
   - Verify credential lookup

### Common Issues to Check

#### Issue 1: Encryption/Decryption Failures

**Symptoms:**
- Error: "Failed to decrypt Pesepay response"
- Error: "Encryption failed"

**Solution:**
- Verify Encryption Key is correct
- Check encryption algorithm matches Pesepay specification
- Review encryption implementation in `encryptPayload()` and `decryptPayload()`

#### Issue 2: Authentication Errors

**Symptoms:**
- Error: "Pesepay authentication failed"
- 401 Unauthorized responses

**Solution:**
- Verify Integration Key is correct
- Check that Integration Key is in `Authorization` header (not as Bearer token)
- Confirm credentials are active in database

#### Issue 3: Payment Method Not Supported

**Symptoms:**
- Error: "COUNTRY_NOT_SUPPORTED"
- Payment method not available

**Solution:**
- Ensure merchant profile has `country = 'ZW'`
- Verify payment method code matches Pesepay's codes (MOBILE_MONEY, BANK_TRANSFER, etc.)

#### Issue 4: Missing Redirect URL

**Symptoms:**
- Error: "No redirect URL (pollUrl) received from Pesepay"
- Payment created but no redirect

**Solution:**
- Check Pesepay response structure
- Verify decryption is working correctly
- Check if `pollUrl` field exists in decrypted response

## Step 5: Test Payment Status Check

1. **Check Status Manually**
   - After creating a payment, get the transaction ID
   - Call the check-status function:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/pesepay-check-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "transactionId": "YOUR_TRANSACTION_ID"
  }'
```

2. **Verify Status Updates**
   - Check transaction status in database
   - Verify metadata is updated correctly

## Step 6: Test Webhook/IPN (Result URL)

1. **Configure Result URL**
   - The result URL is automatically set to: 
     `https://YOUR_PROJECT.supabase.co/functions/v1/pesepay-ipn`

2. **Test Webhook**
   - Complete a test payment
   - Check if webhook is received
   - Verify transaction status is updated via webhook

3. **Check Webhook Logs**
   - View logs in `pesepay-ipn` edge function
   - Verify webhook payload structure
   - Check if decryption works for webhook data

## Step 7: Verify Database Updates

### Check Transaction Record

```sql
SELECT 
  id,
  status,
  reference,
  amount,
  currency,
  metadata->>'pesepay_reference' as pesepay_ref,
  metadata->>'pesepay_poll_url' as poll_url,
  created_at
FROM transactions
WHERE metadata->>'link_code' = 'YOUR_LINK_CODE'
ORDER BY created_at DESC
LIMIT 5;
```

### Check Payment Link Statistics

```sql
SELECT 
  link_code,
  payments_count,
  total_amount_collected,
  status
FROM payment_links
WHERE link_code = 'YOUR_LINK_CODE';
```

## Step 8: Test Different Payment Types

### Test Donation Links
- Create a donation link
- Test with variable amount
- Verify amount is passed correctly

### Test Catalogue Links
- Create a catalogue with items
- Add items to cart
- Test checkout flow

### Test Subscription Links
- Create a subscription link
- Test recurring payment setup (if applicable)

## Step 9: Encryption Testing

### Verify Encryption Implementation

The encryption needs to match Pesepay's exact specification. Test:

1. **Encrypt a test payload**
   ```javascript
   const testPayload = {
     amountDetails: { amount: 100, currencyCode: "USD" },
     merchantReference: "TEST123",
     reasonForPayment: "Test",
     resultUrl: "https://example.com/result",
     returnUrl: "https://example.com/return",
     paymentMethodCode: "MOBILE_MONEY",
     customer: {
       email: "test@example.com",
       phoneNumber: "+263771234567",
       name: "Test User"
     }
   };
   ```

2. **Compare with Pesepay SDK**
   - Use Pesepay's Python/Ruby SDK to encrypt same payload
   - Compare encrypted outputs
   - Adjust encryption algorithm if different

## Step 10: Production Readiness Checklist

Before going live:

- [ ] Tested with sandbox credentials
- [ ] Encryption/decryption working correctly
- [ ] All payment methods tested
- [ ] Webhook/IPN receiving correctly
- [ ] Transaction status updates working
- [ ] Error handling tested
- [ ] Logs reviewed for issues
- [ ] Production credentials configured
- [ ] Environment set to "production"
- [ ] Result URL is publicly accessible
- [ ] SSL certificate valid
- [ ] Tested with real payment (small amount)

## Troubleshooting Tips

1. **Enable Debug Logging**
   - Add console.log statements in edge functions
   - Log encrypted payloads (be careful with sensitive data)
   - Log decrypted responses

2. **Test Encryption Separately**
   - Create a test script to verify encryption
   - Compare with Pesepay's examples

3. **Verify API Endpoints**
   - Confirm base URL is correct
   - Check if sandbox URL differs from production

4. **Check Currency Codes**
   - Verify currency codes match Pesepay's supported currencies
   - Test with different currencies

5. **Payment Method Codes**
   - Confirm exact payment method codes with Pesepay
   - Test each payment method

## Getting Help

If you encounter issues:

1. **Check Pesepay Documentation**
   - [Pesepay Developer Docs](https://developers.pesepay.com/overview)
   - Pesepay support team

2. **Review Edge Function Logs**
   - Supabase Dashboard → Edge Functions → Logs

3. **Check Database**
   - Verify credentials are stored correctly
   - Check transaction records

4. **Test with Pesepay SDK**
   - Compare with official SDK implementation
   - Identify differences in encryption/API calls

## Next Steps After Testing

Once testing is successful:

1. Update encryption implementation if needed
2. Remove any debug/fallback code
3. Configure production credentials
4. Set environment to "production"
5. Test with small real payment
6. Monitor for first few transactions
7. Set up monitoring/alerts

