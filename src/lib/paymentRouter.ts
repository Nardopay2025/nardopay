import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

export type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer';
export type LinkType = 'payment' | 'donation' | 'catalogue' | 'subscription';

// Input validation schema for customer details
const customerDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
});

interface PaymentRequest {
  linkType: LinkType;
  linkCode: string;
  paymentMethod: PaymentMethod;
  merchantCountry: string;
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  // Optional fields based on link type
  donationAmount?: string;
  cartItems?: any[];
}

interface PaymentResponse {
  success: boolean;
  redirect_url?: string;
  error?: string;
}

/**
 * Smart payment routing - determines which payment provider to use
 * based on payment method and merchant's country
 */
function selectProvider(request: PaymentRequest): string {
  const { paymentMethod, merchantCountry } = request;

  // East African countries supported by Pesapal
  const pesapalCountries = ['KE', 'UG', 'TZ', 'MW', 'RW', 'ZM', 'ZW'];

  // Mobile Money in East Africa → Pesapal
  if (paymentMethod === 'mobile_money' && pesapalCountries.includes(merchantCountry)) {
    return 'pesapal';
  }

  // Bank Transfer in East Africa → Pesapal
  if (paymentMethod === 'bank_transfer' && pesapalCountries.includes(merchantCountry)) {
    return 'pesapal';
  }

  // Cards anywhere → Stripe (when configured)
  if (paymentMethod === 'card') {
    // TODO: Return 'stripe' when Stripe integration is ready
    return 'pesapal'; // Fallback to Pesapal for now
  }

  // Mobile Money in Nigeria → Paystack (future)
  if (paymentMethod === 'mobile_money' && merchantCountry === 'NG') {
    // TODO: Return 'paystack' when Paystack integration is ready
    return 'pesapal'; // Fallback
  }

  // Default fallback
  return 'pesapal';
}

/**
 * Format payment data for Pesapal provider
 */
function formatForPesapal(request: PaymentRequest): any {
  const { linkCode, linkType, customerDetails, donationAmount, cartItems } = request;
  
  const payload: any = {
    linkCode,
    linkType,
    payerName: customerDetails.name,
    payerEmail: customerDetails.email,
    paymentMethod: request.paymentMethod === 'mobile_money' ? 'mobile' : 'bank',
  };

  // Add donation amount for donation links
  if (linkType === 'donation' && donationAmount) {
    payload.donationAmount = donationAmount;
  }

  // Add cart items for catalogue links
  if (linkType === 'catalogue' && cartItems) {
    payload.cartItems = cartItems;
  }

  return payload;
}

/**
 * Main payment processing function - routes to appropriate provider
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    console.log('Processing payment:', request);

    // Validate customer details
    const validationResult = customerDetailsSchema.safeParse(request.customerDetails);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      throw new Error(`Invalid customer details: ${errors}`);
    }

    // 1. Determine which provider to use
    const provider = selectProvider(request);
    console.log('Selected provider:', provider);

    // 2. Format data for that provider
    let providerData: any;
    let edgeFunction: string;

    switch (provider) {
      case 'pesapal':
        providerData = formatForPesapal(request);
        edgeFunction = 'pesapal-submit-order';
        break;

      case 'stripe':
        // TODO: Implement Stripe formatting when ready
        providerData = {}; // formatForStripe(request);
        edgeFunction = 'stripe-submit-order';
        break;

      case 'paystack':
        // TODO: Implement Paystack formatting when ready
        providerData = {}; // formatForPaystack(request);
        edgeFunction = 'paystack-submit-order';
        break;

      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }

    // 3. Call appropriate edge function
    console.log('Invoking edge function:', edgeFunction, providerData);
    const { data, error } = await supabase.functions.invoke(edgeFunction, {
      body: providerData,
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    if (!data?.redirect_url) {
      throw new Error('No payment URL received from provider');
    }

    return {
      success: true,
      redirect_url: data.redirect_url,
    };
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process payment',
    };
  }
}

/**
 * Map generic payment method to provider-specific method
 */
export function mapPaymentMethodForProvider(
  paymentMethod: PaymentMethod,
  provider: string
): string {
  if (provider === 'pesapal') {
    return paymentMethod === 'mobile_money' ? 'mobile' : 'bank';
  }
  
  // Add mappings for other providers as needed
  return paymentMethod;
}
