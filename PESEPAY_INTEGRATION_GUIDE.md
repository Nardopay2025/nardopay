# Pesepay Integration Guide

## Overview

Pesepay is a payment gateway for Zimbabwe that allows merchants to accept payments via mobile money, bank transfers, and other payment methods. NardoPay acts as an aggregator, providing access to Zimbabwean payment methods for merchants in other countries (e.g., Rwanda).

## How Pesepay Works in NardoPay

### Architecture

1. **NardoPay as Aggregator**: NardoPay maintains a single Pesepay merchant account for Zimbabwe (ZW)
2. **Merchant Independence**: Merchants from any country (e.g., Rwanda) can accept payments from Zimbabwean customers
3. **Credential Management**: All Pesepay transactions use NardoPay's Zimbabwe credentials, regardless of the merchant's country

### Payment Flow

#### Step 1: Customer Initiates Payment
- A Zimbabwean customer accesses a payment link created by a merchant (e.g., Rwandan merchant)
- If the payment link currency is RWF and the customer is in Zimbabwe, the amount is automatically converted to USD using exchange rates

#### Step 2: Payment Submission
- Frontend calls the `pesepay-submit-order` edge function
- The function:
  1. Retrieves NardoPay's Zimbabwe (ZW) credentials from the database
  2. Encrypts the payment payload using AES-256-CBC
  3. Sends the encrypted payload to Pesepay's Initiate Transaction API
  4. Receives and decrypts the response containing the `redirectUrl`

#### Step 3: Customer Redirect
- Customer is redirected to Pesepay's payment page using the `redirectUrl`
- Customer completes payment using their preferred method (mobile money, bank transfer, etc.)

#### Step 4: Payment Completion
- Pesepay redirects customer back to the merchant's `returnUrl`
- Pesepay also sends a webhook notification to the `resultUrl`
- The transaction status is updated in the database

## Setup Process

### 1. Prerequisites

- Pesepay merchant account (NardoPay's account for Zimbabwe)
- Integration Key (UUID format)
- Encryption Key (32-character string)
- Supabase project with edge functions enabled

### 2. Database Configuration

Add Pesepay credentials to the `payment_provider_configs` table:

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
  'sandbox',  -- or 'production'
  'YOUR_INTEGRATION_KEY',  -- e.g., 96cff418-86a1-4603-ae04-bab4954976df
  'YOUR_ENCRYPTION_KEY',   -- e.g., a12eb48baf8c44cd976660123cda8ade
  true
);
```

**Important Notes:**
- `consumer_key` = Integration Key (from Pesepay dashboard)
- `consumer_secret` = Encryption Key (from Pesepay dashboard)
- `country_code` must always be `'ZW'` (Zimbabwe)
- `environment` can be `'sandbox'` or `'production'`

### 3. Edge Functions

The following edge functions are deployed:

#### `pesepay-submit-order`
- **Purpose**: Initiates a payment transaction with Pesepay
- **Endpoint**: `POST /functions/v1/pesepay-submit-order`
- **Process**:
  1. Validates payment details
  2. Retrieves ZW credentials
  3. Encrypts payload using AES-256-CBC
  4. Calls Pesepay Initiate Transaction API
  5. Decrypts response
  6. Returns `redirectUrl` for customer redirect

#### `pesepay-check-status`
- **Purpose**: Checks the status of a Pesepay transaction
- **Endpoint**: `POST /functions/v1/pesepay-check-status`
- **Process**:
  1. Retrieves transaction details
  2. Calls Pesepay Check Transaction Status API
  3. Returns current transaction status

#### `pesepay-ipn`
- **Purpose**: Handles Pesepay webhook notifications
- **Endpoint**: `POST /functions/v1/pesepay-ipn`
- **Process**:
  1. Receives encrypted webhook payload
  2. Decrypts the payload
  3. Updates transaction status in database

#### `pesepay-register-ipn`
- **Purpose**: Registers webhook URLs with Pesepay
- **Endpoint**: `POST /functions/v1/pesepay-register-ipn`

## Technical Implementation

### Encryption/Decryption

Pesepay uses AES-256-CBC encryption with the following specifications:

- **Algorithm**: AES-256-CBC
- **Key**: 32-character encryption key (used directly, not hashed)
- **IV (Initialization Vector)**: First 16 characters of the encryption key
- **Mode**: CBC
- **Key Size**: 256 bits

**Important**: The IV is derived from the encryption key, not randomly generated. Both encryption and decryption use the same IV derivation method.

### API Endpoints

#### Initiate Transaction
- **URL**: `https://api.pesepay.com/api/payments-engine/v1/payments/initiate`
- **Method**: POST
- **Headers**:
  - `authorization`: Integration Key (no "Bearer" prefix)
  - `content-type`: application/json
- **Request Body**:
  ```json
  {
    "payload": "encrypted_json_string"
  }
  ```
- **Response Body**:
  ```json
  {
    "payload": "encrypted_json_string"
  }
  ```

### Request Payload Structure (Before Encryption)

```json
{
  "amountDetails": {
    "amount": 10.00,
    "currencyCode": "USD"
  },
  "merchantReference": "transaction-uuid",
  "reasonForPayment": "Payment description",
  "resultUrl": "https://your-domain.com/payment-callback",
  "returnUrl": "https://your-domain.com/payment-return",
  "paymentMethodCode": "MOBILE",
  "customer": {
    "email": "customer@example.com",
    "phoneNumber": "+263771234567",
    "name": "Customer Name"
  }
}
```

### Response Payload Structure (After Decryption)

```json
{
  "redirectUrl": "https://pay.pesepay.com/checkout/...",
  "referenceNumber": "PESEPAY-REF-123456",
  "status": "PENDING"
}
```

## Currency Conversion

For cross-border payments (e.g., Rwandan merchant, Zimbabwean customer):

1. **Detection**: System detects customer is in Zimbabwe (`ipCountry === 'ZW'`) and payment link currency is RWF
2. **Conversion**: Calls `get-exchange-rate` edge function to convert RWF to USD
3. **Display**: Shows converted amount in USD to the customer
4. **Submission**: Sends converted amount to Pesepay API

## Testing

### Sandbox Testing

1. Use sandbox credentials in `payment_provider_configs` with `environment = 'sandbox'`
2. Test payment flow with test payment methods
3. Verify webhook notifications are received
4. Check transaction status updates

### Production Deployment

1. Update credentials in `payment_provider_configs` with `environment = 'production'`
2. Ensure webhook URLs are publicly accessible
3. Test with small amounts first
4. Monitor logs for any issues

## Troubleshooting

### Common Issues

1. **"Invalid HTTP header parsed" Error**
   - **Solution**: This was resolved by using Deno's native TLS connection instead of fetch API
   - The function now uses `Deno.connectTls()` to bypass fetch header validation

2. **"Failed to decrypt your data" Error**
   - **Cause**: Incorrect encryption key or IV derivation
   - **Solution**: Ensure encryption key is exactly 32 characters and IV is derived from first 16 characters

3. **Chunked Encoding Issues**
   - **Solution**: Response parsing now handles HTTP chunked transfer encoding automatically

4. **Currency Conversion Not Working**
   - **Check**: Verify `get-exchange-rate` function is deployed and accessible
   - **Check**: Ensure customer IP geolocation is working correctly

## Security Best Practices

1. **Never expose credentials**: All API calls must be made from server-side code (edge functions)
2. **Use HTTPS**: All Pesepay API endpoints require HTTPS
3. **Validate webhooks**: Verify webhook payloads are from Pesepay
4. **Rotate keys**: If keys are compromised, deactivate and replace immediately
5. **Monitor logs**: Regularly check edge function logs for errors or suspicious activity

## API Documentation

For detailed API documentation, refer to:
- [Pesepay Developer Documentation](https://developers.pesepay.com/overview)
- [Initiate Transaction API](https://developers.pesepay.com/api-reference/initiate-transaction)
- [Security Guide](https://developers.pesepay.com/guides/security)

## Support

For Pesepay-specific issues:
- Contact Pesepay Support through their website
- Check Pesepay developer documentation

For NardoPay integration issues:
- Check edge function logs in Supabase dashboard
- Review database logs for transaction records
- Verify credentials are correctly stored in `payment_provider_configs` table

