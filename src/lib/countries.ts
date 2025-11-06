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
  {
    code: 'ET',
    name: 'Ethiopia',
    flag: '🇪🇹',
    currency: 'ETB',
    mobileProviders: [
      { id: 'mpesa', name: 'M-Pesa' },
      { id: 'mobisheeng', name: 'M-Birr' },
    ],
    banks: [
      { id: 'commercial', name: 'Commercial Bank of Ethiopia' },
      { id: 'awash', name: 'Awash Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'SS',
    name: 'South Sudan',
    flag: '🇸🇸',
    currency: 'SSP',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'bank', name: 'Bank of South Sudan' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    flag: '🇩🇯',
    currency: 'DJF',
    mobileProviders: [],
    banks: [
      { id: 'bank', name: 'Bank of Djibouti' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'SO',
    name: 'Somalia',
    flag: '🇸🇴',
    currency: 'SOS',
    mobileProviders: [
      { id: 'eplus', name: 'E-PLUS' },
      { id: 'hormuud', name: 'Hormuud' },
    ],
    banks: [
      { id: 'bank', name: 'Central Bank of Somalia' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'ER',
    name: 'Eritrea',
    flag: '🇪🇷',
    currency: 'ERN',
    mobileProviders: [],
    banks: [
      { id: 'bank', name: 'Bank of Eritrea' },
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
  {
    code: 'SN',
    name: 'Senegal',
    flag: '🇸🇳',
    currency: 'XOF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'tigo', name: 'Tigo Cash' },
    ],
    banks: [
      { id: 'sgbc', name: 'Société Générale' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    currency: 'XOF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'mtn', name: 'MTN Mobile Money' },
    ],
    banks: [
      { id: 'sgbci', name: 'SGBCI' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'ML',
    name: 'Mali',
    flag: '🇲🇱',
    currency: 'XOF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'mtn', name: 'MTN Mobile Money' },
    ],
    banks: [
      { id: 'bmsa', name: 'Bank of Africa' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    currency: 'XOF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'moov', name: 'Moov Money' },
    ],
    banks: [
      { id: 'boa', name: 'Bank of Africa' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'NE',
    name: 'Niger',
    flag: '🇳🇪',
    currency: 'XOF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'moov', name: 'Moov Money' },
    ],
    banks: [
      { id: 'boa', name: 'Bank of Africa' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'TD',
    name: 'Chad',
    flag: '🇹🇩',
    currency: 'XAF',
    mobileProviders: [
      { id: 'tigo', name: 'Tigo Cash' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'sbt', name: 'Société Générale' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'CM',
    name: 'Cameroon',
    flag: '🇨🇲',
    currency: 'XAF',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
      { id: 'orange', name: 'Orange Money' },
    ],
    banks: [
      { id: 'afriland', name: 'Afriland First Bank' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    flag: '🇨🇫',
    currency: 'XAF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
    ],
    banks: [
      { id: 'bca', name: 'Banque Centrale' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    currency: 'XAF',
    mobileProviders: [
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'bgf', name: 'BGFI Bank' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'CG',
    name: 'Republic of the Congo',
    flag: '🇨🇬',
    currency: 'XAF',
    mobileProviders: [
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'bac', name: 'Banque Centrale' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'CD',
    name: 'DR Congo',
    flag: '🇨🇩',
    currency: 'CDF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'rawbank', name: 'Rawbank' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'AO',
    name: 'Angola',
    flag: '🇦🇴',
    currency: 'AOA',
    mobileProviders: [],
    banks: [
      { id: 'bai', name: 'BAI' },
      { id: 'bpc', name: 'BPC' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'GW',
    name: 'Guinea-Bissau',
    flag: '🇬🇼',
    currency: 'XOF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
    ],
    banks: [
      { id: 'bgb', name: 'BGB' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'GN',
    name: 'Guinea',
    flag: '🇬🇳',
    currency: 'GNF',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'mtn', name: 'MTN Mobile Money' },
    ],
    banks: [
      { id: 'bicigui', name: 'BICIGUI' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    flag: '🇸🇱',
    currency: 'SLL',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'afrimoney', name: 'Africell Money' },
    ],
    banks: [
      { id: 'rokel', name: 'Rokel Commercial Bank' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'LR',
    name: 'Liberia',
    flag: '🇱🇷',
    currency: 'LRD',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'lonestar', name: 'Lonestar Cell MTN' },
    ],
    banks: [
      { id: 'ubl', name: 'United Bank for Africa' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'TG',
    name: 'Togo',
    flag: '🇹🇬',
    currency: 'XOF',
    mobileProviders: [
      { id: 'moov', name: 'Moov Money' },
      { id: 'togocel', name: 'Togocel Cash' },
    ],
    banks: [
      { id: 'btg', name: 'BTCI' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'BJ',
    name: 'Benin',
    flag: '🇧🇯',
    currency: 'XOF',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
      { id: 'moov', name: 'Moov Money' },
    ],
    banks: [
      { id: 'boa', name: 'Bank of Africa' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'MR',
    name: 'Mauritania',
    flag: '🇲🇷',
    currency: 'MRU',
    mobileProviders: [
      { id: 'mattel', name: 'Mattel' },
    ],
    banks: [
      { id: 'bcm', name: 'BCM' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'GM',
    name: 'Gambia',
    flag: '🇬🇲',
    currency: 'GMD',
    mobileProviders: [
      { id: 'afrimoney', name: 'Afrimoney' },
    ],
    banks: [
      { id: 'gtbank', name: 'GTBank' },
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
  {
    code: 'ZW',
    name: 'Zimbabwe',
    flag: '🇿🇼',
    currency: 'USD',
    mobileProviders: [
      { id: 'ecocash', name: 'EcoCash' },
      { id: 'telecash', name: 'Telecash' },
      { id: 'onemoney', name: 'OneMoney' },
    ],
    banks: [
      { id: 'cbz', name: 'CBZ Bank' },
      { id: 'stanbic', name: 'Stanbic Bank' },
      { id: 'fbc', name: 'FBC Bank' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'BW',
    name: 'Botswana',
    flag: '🇧🇼',
    currency: 'BWP',
    mobileProviders: [
      { id: 'mascom', name: 'Mascom MyZaka' },
      { id: 'orange', name: 'Orange Money' },
    ],
    banks: [
      { id: 'fnb', name: 'First National Bank' },
      { id: 'standard', name: 'Standard Chartered' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'NA',
    name: 'Namibia',
    flag: '🇳🇦',
    currency: 'NAD',
    mobileProviders: [],
    banks: [
      { id: 'fnb', name: 'First National Bank' },
      { id: 'standard', name: 'Standard Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'ZM',
    name: 'Zambia',
    flag: '🇿🇲',
    currency: 'ZMW',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'zambia', name: 'Bank of Zambia' },
      { id: 'stanbic', name: 'Stanbic Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'MW',
    name: 'Malawi',
    flag: '🇲🇼',
    currency: 'MWK',
    mobileProviders: [
      { id: 'tnm', name: 'TNM Mpamba' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'standard', name: 'Standard Bank' },
      { id: 'national', name: 'National Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    flag: '🇲🇿',
    currency: 'MZN',
    mobileProviders: [
      { id: 'mkesh', name: 'mKesh' },
      { id: 'mpesa', name: 'M-Pesa' },
    ],
    banks: [
      { id: 'bci', name: 'BCI' },
      { id: 'standard', name: 'Standard Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'SZ',
    name: 'Eswatini',
    flag: '🇸🇿',
    currency: 'SZL',
    mobileProviders: [
      { id: 'mtn', name: 'MTN Mobile Money' },
    ],
    banks: [
      { id: 'standard', name: 'Standard Bank' },
      { id: 'fnb', name: 'First National Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'LS',
    name: 'Lesotho',
    flag: '🇱🇸',
    currency: 'LSL',
    mobileProviders: [
      { id: 'ecocash', name: 'EcoCash' },
    ],
    banks: [
      { id: 'standard', name: 'Standard Bank' },
      { id: 'fnb', name: 'First National Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'MG',
    name: 'Madagascar',
    flag: '🇲🇬',
    currency: 'MGA',
    mobileProviders: [
      { id: 'orange', name: 'Orange Money' },
      { id: 'airtel', name: 'Airtel Money' },
    ],
    banks: [
      { id: 'boa', name: 'Bank of Africa' },
      { id: 'bfv', name: 'BFV-SG' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'MU',
    name: 'Mauritius',
    flag: '🇲🇺',
    currency: 'MUR',
    mobileProviders: [],
    banks: [
      { id: 'mcb', name: 'MCB' },
      { id: 'sbm', name: 'SBM Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'SC',
    name: 'Seychelles',
    flag: '🇸🇨',
    currency: 'SCR',
    mobileProviders: [],
    banks: [
      { id: 'nouvobanq', name: 'Nouvobanq' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'KM',
    name: 'Comoros',
    flag: '🇰🇲',
    currency: 'KMF',
    mobileProviders: [],
    banks: [
      { id: 'bcc', name: 'BCC' },
      { id: 'other', name: 'Other Bank' },
    ],
  },

  // North Africa
  {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬',
    currency: 'EGP',
    mobileProviders: [],
    banks: [
      { id: 'nbe', name: 'National Bank of Egypt' },
      { id: 'cib', name: 'CIB' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'LY',
    name: 'Libya',
    flag: '🇱🇾',
    currency: 'LYD',
    mobileProviders: [],
    banks: [
      { id: 'cbl', name: 'Central Bank of Libya' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'TN',
    name: 'Tunisia',
    flag: '🇹🇳',
    currency: 'TND',
    mobileProviders: [],
    banks: [
      { id: 'bct', name: 'BCT' },
      { id: 'stb', name: 'STB' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'DZ',
    name: 'Algeria',
    flag: '🇩🇿',
    currency: 'DZD',
    mobileProviders: [],
    banks: [
      { id: 'bdl', name: 'Banque d\'Algérie' },
      { id: 'bna', name: 'BNA' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'MA',
    name: 'Morocco',
    flag: '🇲🇦',
    currency: 'MAD',
    mobileProviders: [],
    banks: [
      { id: 'attijari', name: 'Attijariwafa Bank' },
      { id: 'bmce', name: 'BMCE Bank' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
  {
    code: 'SD',
    name: 'Sudan',
    flag: '🇸🇩',
    currency: 'SDG',
    mobileProviders: [],
    banks: [
      { id: 'cbs', name: 'Central Bank of Sudan' },
      { id: 'other', name: 'Other Bank' },
    ],
  },
];

export const getCountryByCode = (code: string): CountryConfig | undefined => {
  return COUNTRIES.find(c => c.code === code);
};

export const getCurrencyForCountry = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country?.currency || 'USD';
};
