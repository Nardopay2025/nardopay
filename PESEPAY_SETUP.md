# Pesepay Integration Setup Guide

## Overview
This guide will help you complete the Pesepay payment integration for NardoPay in Zimbabwe.

## Prerequisites
- Pesepay merchant account (contact Pesepay for Zimbabwe)
- Integration Key and Encryption Key from Pesepay
- Supabase project with edge functions enabled

## Step 1: Configure Pesepay Credentials

Based on the [Pesepay Developer Documentation](https://developers.pesepay.com/overview), Pesepay uses:
- **Integration Key** (stored as `consumer_key` in database)
- **Encryption Key** (stored as `consumer_secret` in database)

### Add Configuration via Admin Panel:
1. Go to Admin → Settings → Payment Providers
2. Click "Add Config"
3. Select Provider: **Pesepay**
4. Select Country: **Zimbabwe (ZW)**
5. Select Environment: **sandbox** (for testing) or **production** (for live)
6. Enter your Integration Key as "Consumer Key"
7. Enter your Encryption Key as "Consumer Secret"
8. Click "Create"

## Step 2: API Endpoints (Need to be Updated)

The following API endpoints need to be confirmed with Pesepay documentation:
- **Base URL (Sandbox)**: To be confirmed from [developers.pesepay.com](https://developers.pesepay.com/overview)
- **Base URL (Production)**: To be confirmed from [developers.pesepay.com](https://developers.pesepay.com/overview)

## Step 3: API Structure

Based on Pesepay Python library and documentation:

### Payment Creation
- Endpoint: `/api/payments/create` (to be confirmed)
- Method: POST
- Authentication: Uses Integration Key and Encryption Key
- Request Body:
  ```json
  {
    "integration_key": "YOUR_INTEGRATION_KEY",
    "encryption_key": "YOUR_ENCRYPTION_KEY",
    "currency_code": "USD",
    "payment_method_code": "MOBILE_MONEY",
    "amount": 100.00,
    "payment_reason": "Purchase description",
    "customer_email": "customer@example.com",
    "customer_phone_number": "0771234567",
    "customer_name": "John Doe",
    "result_url": "https://yourdomain.com/payment-callback",
    "return_url": "https://yourdomain.com/payment-return"
  }
  ```

### Payment Status Check
- Endpoint: `/api/payments/{reference_number}/status` (to be confirmed)
- Method: GET
- Response includes: `success`, `paid`, `referenceNumber`, `message`

### Webhook/Result URL
- Pesepay sends payment status updates to the `result_url`
- Webhook payload structure to be confirmed from documentation

## Step 4: Update Edge Functions

The following edge functions need their API endpoints updated once you have access to the full Pesepay API documentation:

1. **pesepay-submit-order/index.ts**
   - Update `PESEPAY_BASE_URL` with actual endpoints
   - Update authentication method (if different from token-based)
   - Update payment creation endpoint and request structure

2. **pesepay-ipn/index.ts**
   - Update webhook payload parsing
   - Update status check endpoint
   - Update status value mappings

3. **pesepay-check-status/index.ts**
   - Update status check endpoint
   - Update response parsing

4. **pesepay-register-ipn/index.ts**
   - Update webhook registration endpoint (if applicable)
   - Note: Pesepay may use result_url instead of IPN registration

## Step 5: Testing

### Test Credentials
Contact Pesepay support for sandbox/test credentials.

### Testing Payment Flow:
1. Create a payment link in your dashboard
2. Set merchant country to Zimbabwe (ZW)
3. Select Mobile Money or Bank Transfer as payment method
4. Fill in customer details
5. Click "Proceed to Checkout"
6. You'll be redirected to Pesepay's payment page
7. Complete the test payment
8. You'll be redirected back to the callback page showing payment status

## Step 6: Go Live

When ready for production:
1. Update configuration environment to `production`
2. Replace test credentials with your live Integration Key and Encryption Key
3. Test thoroughly in production mode

## Integration Features

✅ Payment Links - One-time payments  
✅ Donation Links - Variable amount donations  
✅ Subscription Links - Recurring payments  
✅ Catalogue - Multiple product checkout  
✅ Mobile Money - EcoCash, Telecash, etc. (Zimbabwe)  
✅ Bank Transfers  
✅ Transaction tracking and history  
✅ Webhook notifications (via result_url)  
✅ Automatic payment status updates  
✅ Callback and cancellation pages  

## Troubleshooting

### Payment not completing
- Verify Integration Key and Encryption Key are correct
- Check that result_url and return_url are publicly accessible
- Review edge function logs for errors

### Webhook not received
- Ensure your result_url is publicly accessible
- Check that Pesepay's domain is not blocked by firewalls
- Verify the webhook payload format matches expectations

### Testing issues
- Make sure you're using sandbox credentials
- Check that environment is set to `sandbox`
- Verify API endpoints are correct

## API Documentation

Full Pesepay API documentation:
- [Pesepay Developer Documentation](https://developers.pesepay.com/overview)
- Python Library: [PyPI - pesepay](https://pypi.org/project/pesepay/)
- WordPress Plugin: [WordPress Plugin Directory](https://wordpress.org/plugins/pesepay/)

## Support

For Pesepay-specific issues:
- Contact Pesepay Support through their website
- Check their developer documentation

For NardoPay integration issues:
- Check edge function logs in Supabase dashboard
- Review database logs for transaction records

## Important Notes

1. **Credential Mapping**: The database uses `consumer_key` and `consumer_secret` fields for consistency across providers, but these map to Pesepay's Integration Key and Encryption Key respectively.

2. **API Differences**: Pesepay uses a different API structure than Pesapal:
   - Uses Integration Key/Encryption Key instead of Consumer Key/Secret
   - Uses result_url/return_url instead of callback_url/cancellation_url
   - May use reference_number instead of order_tracking_id

3. **Webhook Registration**: Pesepay may handle webhooks differently (via result_url) compared to Pesapal's IPN registration. Confirm with Pesepay documentation.

