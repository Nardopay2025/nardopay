// Country configurations with currency and withdrawal options

export interface MobileProvider {
  id: string;
  name: string;
}

export interface Bank {
  id: string;
  name: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  mobileProviders: MobileProvider[];
  banks: Bank[];
}

export const COUNTRIES: CountryConfig[] = [
  // East Africa
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    mobileProviders: [
      { id: 'mpesa', name: 'M-Pesa' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'equity', name: 'Equity Bank' },
      { id: 'kcb', name: 'KCB Bank' },
      { id: 'coop', name: 'Co-operative Bank' },
      { id: 'ncba', name: 'NCBA Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    currency: 'TZS',
    mobileProviders: [
      { id: 'mpesa', name: 'M-Pesa' },
      { id: 'tigopesa', name: 'Tigo Pesa' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'crdb', name: 'CRDB Bank' },
      { id: 'nmb', name: 'NMB Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    currency: 'UGX',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'stanbic', name: 'Stanbic Bank' },
      { id: 'centenary', name: 'Centenary Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    currency: 'RWF',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'bk', name: 'Bank of Kigali' },
      { id: 'equity', name: 'Equity Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },

  // West Africa
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    mobileProviders: [
      { id: 'opay', name: 'OPay' },
      { id: 'palmpay', name: 'PalmPay' },
    ],
    banks: [
      { id: 'gtbank', name: 'GTBank' },
      { id: 'access', name: 'Access Bank' },
      { id: 'zenith', name: 'Zenith Bank' },
      { id: 'first', name: 'First Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
      { id: 'vodafone', name: 'Vodafone Cash' },
      { id: 'airteltigo', name: 'AirtelTigo Money' },
    ],
    banks: [
      { id: 'gcb', name: 'GCB Bank' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },

  // Southern Africa
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    mobileProviders: [],
    banks: [
      { id: 'fnb', name: 'FNB' },
      { id: 'standard', name: 'Standard Bank' },
      { id: 'absa', name: 'Absa' },
      { id: 'capitec', name: 'Capitec' },
      { id: 'other', name: 'Other Bank' },
    ],
  },

  // North America
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    mobileProviders: [],
    banks: [
      { id: 'chase', name: 'Chase' },
      { id: 'boa', name: 'Bank of America' },
      { id: 'wells', name: 'Wells Fargo' },
      { id: 'citi', name: 'Citibank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },

  // Europe
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    mobileProviders: [],
    banks: [
      { id: 'hsbc', name: 'HSBC' },
      { id: 'barclays', name: 'Barclays' },
      { id: 'lloyds', name: 'Lloyds' },
      { id: 'other', name: 'Other Bank' },
    ],
  },

  // Add more countries as needed
];

export const getCountryByCode = (code: string): CountryConfig | undefined => {
  return COUNTRIES.find(c => c.code === code);
};

export const getCurrencyForCountry = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country?.currency || 'USD';
};
