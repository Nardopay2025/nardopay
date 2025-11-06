import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

export type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer';
export type LinkType = 'payment' | 'donation' | 'catalogue' | 'subscription';

// Input validation schema for customer details
const customerDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
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
  cardDetails?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName?: string;
  };
}

interface PaymentResponse {
  success: boolean;
  redirect_url?: string;
  error?: string;
}

/**
 * Infer ISO-3166-1 alpha-2 country code from an E.164 phone number.
 * Only maps the regions we support; returns undefined if unknown.
 */
function getCountryFromPhone(e164Phone?: string): string | undefined {
  if (!e164Phone) return undefined;
  const normalized = e164Phone.replace(/\s|-/g, '');
  // Early exit if it doesn't look like a +countrycode number
  if (!/^\+\d{6,15}$/.test(normalized)) return undefined;

  // Common African and supported markets mapping
  const prefixToIso2: Array<[RegExp, string]> = [
    [/^\+263/, 'ZW'], // Zimbabwe
    [/^\+250/, 'RW'], // Rwanda
    [/^\+254/, 'KE'], // Kenya
    [/^\+256/, 'UG'], // Uganda
    [/^\+255/, 'TZ'], // Tanzania
    [/^\+265/, 'MW'], // Malawi
    [/^\+260/, 'ZM'], // Zambia
    [/^\+267/, 'BW'], // Botswana
    [/^\+27(?!\d{0}$)/, 'ZA'], // South Africa
    [/^\+233/, 'GH'], // Ghana
    [/^\+234/, 'NG'], // Nigeria
    // Add more as needed
  ];

  for (const [re, iso] of prefixToIso2) {
    if (re.test(normalized)) return iso;
  }
  return undefined;
}

function getEffectiveCountry(request: PaymentRequest): string {
  const inferred = getCountryFromPhone(request.customerDetails?.phone);
  return inferred || request.merchantCountry;
}

// Paymentology supported countries (global virtual card provider)
const PAYMENTOLOGY_COUNTRIES = [
  'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'ZA', 
  'NG', 'GH', 'KE', 'UG', 'TZ', 'RW', 'ZM', 'MW', 'BW', 'ZW',
];

// Pesapal supported countries (East African markets + select regions)
const PESAPAL_COUNTRIES = [
  'KE', 'UG', 'TZ', 'RW', 'MW', 'ZM', 'BW',
];

// Pesepay supported countries (Zimbabwe)
const PESEPAY_COUNTRIES = [
  'ZW',
];

/**
 * Smart payment routing - determines which payment provider to use
 */
function selectProvider(request: PaymentRequest): string {
  const { paymentMethod } = request;
  const effectiveCountry = getEffectiveCountry(request);
  
  // Card payments via Paymentology (global coverage)
  if (paymentMethod === 'card' && PAYMENTOLOGY_COUNTRIES.includes(effectiveCountry)) {
    return 'paymentology';
  }
  
  // Mobile Money and Bank Transfer via Pesepay for Zimbabwe
  if ((paymentMethod === 'mobile_money' || paymentMethod === 'bank_transfer') 
      && PESEPAY_COUNTRIES.includes(effectiveCountry)) {
    return 'pesepay';
  }
  
  // Mobile Money and Bank Transfer via Pesapal (only for supported countries)
  if ((paymentMethod === 'mobile_money' || paymentMethod === 'bank_transfer') 
      && PESAPAL_COUNTRIES.includes(effectiveCountry)) {
    return 'pesapal';
  }
  
  // Unsupported combination
  throw new Error(`COUNTRY_NOT_SUPPORTED: ${paymentMethod} payments are not available in ${effectiveCountry}. Please use an alternative payment method.`);
}

/**
 * Check if a payment method is supported in a given country
 */
export function isPaymentMethodSupported(paymentMethod: PaymentMethod, country: string): boolean {
  if (paymentMethod === 'card') {
    return PAYMENTOLOGY_COUNTRIES.includes(country);
  }
  if (paymentMethod === 'mobile_money' || paymentMethod === 'bank_transfer') {
    return PESAPAL_COUNTRIES.includes(country) || PESEPAY_COUNTRIES.includes(country);
  }
  return false;
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
    const amountNum = typeof donationAmount === 'string' ? parseFloat(donationAmount) : donationAmount;
    payload.donationAmount = amountNum;
  }

  // Add cart items for catalogue links
  if (linkType === 'catalogue' && cartItems) {
    payload.cartItems = cartItems;
  }

  return payload;
}

/**
 * Format payment data for Pesepay provider
 */
function formatForPesepay(request: PaymentRequest): any {
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
    const amountNum = typeof donationAmount === 'string' ? parseFloat(donationAmount) : donationAmount;
    payload.donationAmount = amountNum;
  }

  // Add cart items for catalogue links
  if (linkType === 'catalogue' && cartItems) {
    payload.cartItems = cartItems;
  }

  return payload;
}

/**
 * Format payment data for Paymentology provider
 */
function formatForPaymentology(request: PaymentRequest): any {
  const { linkCode, linkType, customerDetails, donationAmount, cartItems, cardDetails } = request;
  
  // Calculate total amount
  let amount = 0;
  let description = '';
  
  if (linkType === 'donation' && donationAmount) {
    amount = parseFloat(donationAmount);
    description = 'Donation';
  } else if (linkType === 'catalogue' && cartItems) {
    amount = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    description = 'Catalogue purchase';
  }
  
  if (!cardDetails) {
    throw new Error('Card details are required for card payments');
  }
  
  return {
    amount: amount.toString(),
    currency: 'USD', // Paymentology uses USD
    customerName: customerDetails.name,
    customerEmail: customerDetails.email,
    cardNumber: cardDetails.cardNumber,
    expiryMonth: cardDetails.expiryMonth,
    expiryYear: cardDetails.expiryYear,
    cvv: cardDetails.cvv,
    reference: `${linkType}-${linkCode}-${Date.now()}`,
    description,
    metadata: {
      linkType,
      linkCode,
      cartItems,
    },
  };
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

      case 'pesepay':
        providerData = formatForPesepay(request);
        edgeFunction = 'pesepay-submit-order';
        break;

      case 'paymentology':
        providerData = formatForPaymentology(request);
        edgeFunction = 'paymentology-accept-payment';
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
      // Extract detailed error message if available
      const errorMessage = error.message || 'Payment provider error';
      throw new Error(errorMessage);
    }

    // Check for errors in the response data
    if (data?.error) {
      const detailedError = data.details 
        ? `${data.error}: ${JSON.stringify(data.details)}`
        : data.message || data.error;
      console.error('Payment provider error:', detailedError);
      throw new Error(detailedError);
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
  if (provider === 'pesapal' || provider === 'pesepay') {
    return paymentMethod === 'mobile_money' ? 'mobile' : 'bank';
  }
  
  // Add mappings for other providers as needed
  return paymentMethod;
}
