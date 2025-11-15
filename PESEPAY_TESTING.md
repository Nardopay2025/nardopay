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
- Error: "ENCRYPTION_FAILED: ..."
- Error: "DECRYPTION_FAILED: ..."
- Error: "Failed to decrypt Pesepay response"
- Error: "Failed to encrypt payload"

**Solutions:**

1. **Verify Encryption Key**
   - Ensure the Encryption Key in the database matches Pesepay's provided key exactly
   - Check for extra spaces, newlines, or special characters
   - Verify the key hasn't expired or been regenerated

2. **Check Encryption Algorithm**
   - Current implementation uses AES-256-CBC with direct key usage (per Pesepay docs)
   - Key: 32-character encryption key used directly (not hashed)
   - IV: First 16 characters of encryption key (not random)
   - If encryption still fails:
     - Verify encryption key is exactly 32 characters
     - Ensure IV is correctly derived from first 16 characters of key
     - Check base64 encoding/decoding
     - Compare with Pesepay's official SDK output

3. **Compare with Pesepay SDK**
   - Use Pesepay's official SDK (Python/Ruby) to encrypt the same test payload
   - Compare the encrypted output with your implementation
   - Adjust the implementation to match Pesepay's output

4. **Debug Steps**
   - Check edge function logs for detailed error messages
   - Log the encryption key (first/last few characters only for security)
   - Verify the payload structure matches Pesepay's expected format
   - Test encryption/decryption separately with a known payload

5. **Common Issues**
   - **Wrong key format**: Ensure the key is exactly 32 characters and used directly (not hashed)
   - **IV mismatch**: CRITICAL - IV must be first 16 characters of encryption key (not random!)
   - **Key length**: Encryption key must be at least 32 characters
   - **Encoding issues**: Check base64 encoding/decoding
   - **Payload structure**: Ensure JSON structure matches Pesepay's specification

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

## Step 9: Encryption Implementation Details

### Encryption Algorithm

The integration implements **AES-256-CBC** encryption for Pesepay payloads according to Pesepay documentation:

- **Algorithm**: AES-256-CBC (Advanced Encryption Standard with Cipher Block Chaining)
- **Key**: Your 32 character long encryption key (used directly, not hashed)
- **IV (Initialization Vector)**: The first 16 characters of your encryption key (NOT random!)
- **Output Format**: Base64 encoded string containing IV + encrypted data

**Important**: The IV is derived from the encryption key itself, not generated randomly. This is a critical requirement from Pesepay.

### Implementation Details

The encryption functions are located in `supabase/functions/pesepay-submit-order/index.ts`:

1. **`encryptPayload(payload, encryptionKey)`**
   - Validates encryption key is at least 32 characters
   - Converts payload to JSON string
   - Uses encryption key directly (first 32 characters)
   - Gets IV from first 16 characters of encryption key (per Pesepay spec)
   - Encrypts using AES-256-CBC
   - Combines IV + encrypted data
   - Returns base64 encoded string

2. **`decryptPayload(encryptedPayload, encryptionKey)`**
   - Validates encryption key is at least 32 characters
   - Decodes base64 string
   - Extracts IV (first 16 bytes) and encrypted data
   - Uses encryption key directly (first 32 characters)
   - Decrypts using AES-256-CBC
   - Parses JSON and returns object

### Important Notes

✅ **Encryption implementation follows Pesepay documentation:**
- Key: Used directly (32 characters), not hashed
- IV: First 16 characters of encryption key (not random)
- Algorithm: AES-256-CBC
- Mode: CBC

If encryption still fails:
- Verify your encryption key is exactly 32 characters
- Ensure the key matches what Pesepay provided
- Check that the key hasn't been modified (no extra spaces, newlines)
- Compare with Pesepay's official SDK (Python/Ruby) if available

### Testing Encryption

1. **Test with a sample payload**:
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
   - Use Pesepay's Python/Ruby SDK to encrypt the same payload
   - Compare encrypted outputs byte-by-byte
   - If different, adjust the encryption implementation accordingly

3. **Verify Round-Trip**
   - Encrypt a test payload
   - Decrypt it back
   - Verify the decrypted payload matches the original

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
   - Edge functions automatically log encryption/decryption steps
   - Check Supabase Dashboard → Edge Functions → Logs
   - Look for "Payload encrypted successfully" or "Decryption failed" messages
   - ⚠️ Never log full encryption keys or decrypted sensitive data in production

2. **Test Encryption Separately**
   - The encryption functions can be tested independently
   - Create a test edge function or script to verify encryption/decryption
   - Compare encrypted output with Pesepay's SDK output

3. **Verify API Endpoints**
   - Confirm base URLs are correct (sandbox vs. production)
   - Check if endpoints match Pesepay documentation exactly
   - Verify HTTP methods (POST vs. GET) and headers

4. **Check Authentication**
   - Verify Integration Key format in Authorization header
   - Confirm if Pesepay uses token-based auth or direct key auth
   - Check if "Bearer " prefix is needed

5. **Payment Method Codes**
   - Verify exact payment method codes with Pesepay
   - Current mapping: `mobile_money` → `MOBILE_MONEY`, `bank_transfer` → `BANK_TRANSFER`
   - Add other methods as needed (CARD, etc.)
   - Test each payment method

6. **Check Currency Codes**
   - Verify currency codes match Pesepay's supported currencies
   - Test with different currencies

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

1. **Verify Encryption Implementation**
   - Confirm encryption/decryption works correctly with Pesepay
   - If issues persist, compare with Pesepay SDK and adjust algorithm if needed

2. **Update API Endpoints**
   - Replace placeholder URLs with actual Pesepay endpoints
   - Verify sandbox and production URLs are correct
   - Update all edge functions consistently

3. **Verify Authentication Method**
   - Confirm if Pesepay uses token-based auth or direct Integration Key
   - Update all functions to use the correct authentication method
   - Remove unused authentication code if not needed

4. **Production Readiness**
   - Configure production credentials
   - Set environment to "production" in database
   - Test with small real payment first
   - Monitor logs for first few transactions
   - Set up monitoring/alerts for payment failures

5. **Documentation**
   - Update any custom configurations
   - Document any deviations from standard implementation
   - Keep notes on encryption algorithm if different from standard

