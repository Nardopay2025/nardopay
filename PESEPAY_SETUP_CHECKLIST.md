# Pesepay Setup Checklist

## Quick Setup Steps

### 1. Get Pesepay Credentials
- [ ] Obtain Integration Key from Pesepay dashboard (UUID format)
- [ ] Obtain Encryption Key from Pesepay dashboard (32 characters)
- [ ] Note: These are NardoPay's Zimbabwe (ZW) credentials

### 2. Add Credentials to Database

Run this SQL command in Supabase SQL Editor:

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
  'sandbox',  -- Change to 'production' when ready
  'YOUR_INTEGRATION_KEY_HERE',  -- Replace with actual Integration Key
  'YOUR_ENCRYPTION_KEY_HERE',   -- Replace with actual Encryption Key
  true
);
```

**Important**: 
- `country_code` must be `'ZW'` (always Zimbabwe, regardless of merchant country)
- `consumer_key` = Integration Key
- `consumer_secret` = Encryption Key

### 3. Verify Edge Functions are Deployed

Check that these functions are deployed in Supabase:
- [ ] `pesepay-submit-order`
- [ ] `pesepay-check-status`
- [ ] `pesepay-ipn`
- [ ] `pesepay-register-ipn`
- [ ] `get-exchange-rate` (for currency conversion)

### 4. Test the Integration

1. **Create a Test Payment Link**
   - Create a payment link with amount in RWF (for testing currency conversion)
   - Or create a payment link with amount in USD

2. **Test as Zimbabwean Customer**
   - Access the payment link from a Zimbabwean IP or set `ipCountry = 'ZW'`
   - If link is in RWF, verify it converts to USD
   - Click "Proceed to Payment"

3. **Verify Payment Flow**
   - Should redirect to Pesepay payment page
   - Complete test payment
   - Should redirect back to your callback URL
   - Check transaction status in database

### 5. Go Live

When ready for production:
- [ ] Update `environment` to `'production'` in database
- [ ] Replace sandbox credentials with production credentials
- [ ] Test with small real payment
- [ ] Monitor logs for any issues

## How It Works - Simple Explanation

1. **Customer clicks "Pay"** → Frontend calls `pesepay-submit-order` function
2. **Function encrypts payment data** → Uses AES-256-CBC with your encryption key
3. **Sends to Pesepay** → Pesepay receives encrypted payload
4. **Pesepay responds** → Returns encrypted response with `redirectUrl`
5. **Customer redirected** → Goes to Pesepay payment page
6. **Customer pays** → Completes payment on Pesepay
7. **Pesepay redirects back** → Customer returns to your site
8. **Webhook notification** → Pesepay sends payment status to `pesepay-ipn` function
9. **Database updated** → Transaction status updated automatically

## Key Points

- ✅ **Always uses ZW credentials**: All Pesepay transactions use NardoPay's Zimbabwe credentials
- ✅ **Works for any merchant country**: Rwandan merchants can accept payments from Zimbabwean customers
- ✅ **Automatic currency conversion**: RWF amounts automatically convert to USD for ZW customers
- ✅ **Secure encryption**: All payloads encrypted with AES-256-CBC
- ✅ **Webhook support**: Automatic transaction status updates via webhooks

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid HTTP header" error | Already fixed - function uses native TLS connection |
| "Failed to decrypt" error | Check encryption key is correct (32 characters) |
| Payment not redirecting | Check `redirectUrl` in response is valid |
| Webhook not received | Verify `resultUrl` is publicly accessible |
| Currency not converting | Check `get-exchange-rate` function is deployed |

## Need Help?

- Check `PESEPAY_INTEGRATION_GUIDE.md` for detailed documentation
- Review edge function logs in Supabase dashboard
- Verify credentials in `payment_provider_configs` table

