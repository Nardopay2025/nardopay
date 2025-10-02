# Pesapal Integration Setup Guide

## Overview
This guide will help you complete the Pesapal payment integration for NardoPay.

## Prerequisites
- Pesapal merchant account (get one at https://www.pesapal.com/dashboard/account/register)
- Consumer Key and Consumer Secret from Pesapal
- Supabase project with edge functions enabled

## Step 1: Configure Pesapal Secrets

The following secrets have already been added to your Supabase project:
- `PESAPAL_CONSUMER_KEY`
- `PESAPAL_CONSUMER_SECRET`

You also need to add:
1. `PESAPAL_ENVIRONMENT` - Set to `sandbox` for testing or `production` for live
2. `PESAPAL_IPN_ID` - Will be generated in Step 2

To add these secrets:
1. Go to https://supabase.com/dashboard/project/mczqwqsvumfsneoknlep/settings/functions
2. Click "Add Secret"
3. Add the secret name and value

## Step 2: Register IPN URL

The IPN (Instant Payment Notification) URL is where Pesapal will send payment status updates.

Your IPN URL is:
```
https://mczqwqsvumfsneoknlep.supabase.co/functions/v1/pesapal-ipn
```

### To register the IPN URL:

1. You can use the `pesapal-register-ipn` edge function:

```bash
curl -X POST https://mczqwqsvumfsneoknlep.supabase.co/functions/v1/pesapal-register-ipn \
  -H "Content-Type: application/json" \
  -d '{
    "ipnUrl": "https://mczqwqsvumfsneoknlep.supabase.co/functions/v1/pesapal-ipn"
  }'
```

2. Or register manually via Pesapal API documentation

3. Copy the returned `ipn_id` and add it as a secret `PESAPAL_IPN_ID`

## Step 3: Testing

### Test Credentials (Sandbox)
Download test credentials from: https://developer.pesapal.com/api3-demo-keys.txt

### Testing Payment Flow:

1. Create a payment link in your dashboard
2. Open the payment link (e.g., `/pay/{linkCode}`)
3. Fill in customer details
4. Click "Proceed to Checkout"
5. You'll be redirected to Pesapal's payment page
6. Complete the test payment
7. You'll be redirected back to the callback page showing payment status

## Step 4: Go Live

When ready for production:

1. Update `PESAPAL_ENVIRONMENT` secret to `production`
2. Replace test credentials with your live Consumer Key and Secret
3. Re-register the IPN URL using live credentials
4. Update `PESAPAL_IPN_ID` with the new IPN ID

## Integration Features

✅ Payment Links - One-time payments
✅ Donation Links - Variable amount donations with progress tracking
✅ Subscription Links - Recurring payments
✅ Catalogue - Multiple product checkout
✅ Mobile Money - M-Pesa, Airtel Money, etc.
✅ Bank Transfers
✅ Transaction tracking and history
✅ Webhook notifications
✅ Branded invoices with custom colors and logo
✅ Automatic payment status updates via IPN
✅ Callback and cancellation pages

## Troubleshooting

### Payment not completing
- Check that IPN URL is registered and reachable
- Verify `PESAPAL_IPN_ID` secret is set correctly
- Check edge function logs for errors

### IPN not received
- Ensure your IPN URL is publicly accessible
- Check that Pesapal's domain is not blocked by firewalls
- Verify the IPN URL format is correct

### Testing issues
- Make sure you're using sandbox credentials
- Check that `PESAPAL_ENVIRONMENT` is set to `sandbox`

## API Documentation

Full Pesapal API 3.0 documentation:
https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference

## Support

For Pesapal-specific issues, contact:
- Pesapal Support: https://www.pesapal.com/support

For NardoPay integration issues, check:
- Edge function logs: https://supabase.com/dashboard/project/mczqwqsvumfsneoknlep/functions
- Database logs for transaction records
