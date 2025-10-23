/**
 * Withdrawal Router - Determines the best payment provider for withdrawals
 * Based on merchant's country and withdrawal account type
 * 
 * NOTE: Pesapal only supports collections, not withdrawals
 */

export type WithdrawalProvider = 'mtn_momo' | 'paymentology_card' | 'manual';
export type WithdrawalAccountType = 'mobile' | 'bank';

interface WithdrawalRoutingParams {
  country: string;
  accountType: WithdrawalAccountType;
  mobileProvider?: string;
}

// Countries supported by MTN MoMo Disbursements (B2C)
const MTN_MOMO_COUNTRIES = [
  'BJ', // Benin
  'CG', // Congo
  'CM', // Cameroon
  'GH', // Ghana
  'GN', // Guinea
  'GW', // Guinea-Bissau
  'LR', // Liberia
  'RW', // Rwanda
  'SZ', // Eswatini
  'ZA', // South Africa
  'ZM', // Zambia
];

// Countries supported by Paymentology Virtual Cards
const PAYMENTOLOGY_COUNTRIES = [
  'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'ZA', 
  'NG', 'GH', 'KE', 'UG', 'TZ', 'RW', 'ZM', 'MW', 'BW', 'ZW',
];

/**
 * Select the appropriate withdrawal provider based on routing parameters
 */
export function selectWithdrawalProvider(params: WithdrawalRoutingParams): WithdrawalProvider {
  const { country, accountType } = params;

  // MTN Mobile Money - For supported countries with mobile money
  if (accountType === 'mobile' && MTN_MOMO_COUNTRIES.includes(country)) {
    return 'mtn_momo';
  }

  // Paymentology Virtual Card - For supported countries wanting card withdrawals
  // This is especially useful for bank account withdrawals in supported countries
  if (accountType === 'bank' && PAYMENTOLOGY_COUNTRIES.includes(country)) {
    return 'paymentology_card';
  }

  // Manual processing for all other cases
  return 'manual';
}

/**
 * Get the edge function name for the selected provider
 */
export function getWithdrawalEdgeFunction(provider: WithdrawalProvider): string {
  switch (provider) {
    case 'mtn_momo':
      return 'mtn-momo-withdraw';
    case 'paymentology_card':
      return 'paymentology-issue-card';
    case 'manual':
      throw new Error('Manual withdrawals are not yet supported. Please contact support.');
    default:
      throw new Error(`Unknown withdrawal provider: ${provider}`);
  }
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: WithdrawalProvider): string {
  switch (provider) {
    case 'mtn_momo':
      return 'MTN Mobile Money';
    case 'paymentology_card':
      return 'Virtual Card (Paymentology)';
    case 'manual':
      return 'Manual Processing';
    default:
      return 'Unknown Provider';
  }
}

/**
 * Check if instant withdrawals are supported for this provider
 */
export function isInstantWithdrawal(provider: WithdrawalProvider, accountType: WithdrawalAccountType): boolean {
  if (provider === 'mtn_momo' && accountType === 'mobile') {
    return true;
  }
  if (provider === 'paymentology_card' && accountType === 'bank') {
    return true; // Virtual cards are issued instantly
  }
  return false;
}

/**
 * Get estimated processing time for withdrawal
 */
export function getProcessingTime(provider: WithdrawalProvider, accountType: WithdrawalAccountType): string {
  if (isInstantWithdrawal(provider, accountType)) {
    return 'Instant (within minutes)';
  }
  if (provider === 'paymentology_card') {
    return 'Instant virtual card issuance';
  }
  if (accountType === 'bank') {
    return '1-2 business days';
  }
  return '1-3 business days';
}
