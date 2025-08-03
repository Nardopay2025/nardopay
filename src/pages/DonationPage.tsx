import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDonationLinks } from '@/contexts/DonationLinksContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Smartphone, 
  Heart,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

const DonationPage = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { getDonationLink, updateDonationProgress } = useDonationLinks();
  const { invoiceSettings } = useInvoiceSettings();
  
  const [donationData, setDonationData] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolderName: '',
    phone: ''
  });

  const presetAmounts = ['10', '25', '50', '100', '250', '500'];

  const getCurrencySymbol = (currencyCode: string) => {
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'RWF': 'RWF ',
      'ETB': 'ETB ',
      'MAD': 'MAD ',
      'EGP': 'EGP ',
      'XOF': 'CFA ',
      'XAF': 'CFA ',
      'BIF': 'BIF ',
      'CDF': 'CDF ',
      'MWK': 'MWK ',
      'ZMW': 'ZMW ',
      'BWP': 'BWP ',
      'NAD': 'NAD ',
      'LSL': 'LSL ',
      'SZL': 'SZL ',
      'MUR': 'MUR ',
      'SCR': 'SCR ',
      'MGA': 'MGA ',
      'KMF': 'KMF ',
      'DJF': 'DJF ',
      'SOS': 'SOS ',
      'SDG': 'SDG ',
      'SSP': 'SSP ',
      'LYD': 'LYD ',
      'TND': 'TND ',
      'DZD': 'DZD ',
      'MRO': 'MRO ',
      'GMD': 'GMD ',
      'GNF': 'GNF ',
      'SLL': 'SLL ',
      'LRD': 'LRD ',
      'STD': 'STD ',
      'CVE': 'CVE ',
      'AOA': 'AOA ',
      'MZN': 'MZN '
    };
    return currencySymbols[currencyCode] || currencyCode + ' ';
  };

  const formatAmount = (amount: string) => {
    const currencySymbol = getCurrencySymbol(donationData?.currency || 'USD');
    return `${currencySymbol}${amount}`;
  };

  // Generate mock data for any link ID (for testing purposes)
  const generateMockData = (id: string) => {
    // Try to get the actual donation link data first
    const actualLink = getDonationLink(id);
    if (actualLink) {
      return {
        id: actualLink.id,
        title: actualLink.title,
        description: actualLink.description,
        goalAmount: actualLink.goalAmount,
        currency: actualLink.currency,
        thankYouMessage: actualLink.thankYouMessage,
        redirectUrl: actualLink.redirectUrl,
        status: actualLink.status || 'ACTIVE'
      };
    }

    // Fallback to default mock data
    return {
      id: id,
      title: 'Help Build a School',
      description: 'We are raising funds to build a new school in rural Kenya. Your donation will help provide education to 200 children who currently walk 5km to the nearest school.',
      goalAmount: '10000',
      currency: 'USD',
      thankYouMessage: 'Thank you for your generous donation! Your support will make a real difference in these children\'s lives.',
      redirectUrl: 'https://example.com/success',
      status: 'ACTIVE'
    };
  };

  useEffect(() => {
    if (linkId) {
      const data = generateMockData(linkId);
      setDonationData(data);
    }
  }, [linkId, getDonationLink]);

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount('');
  };

  const getAmountToCharge = () => {
    return customAmount || selectedAmount || '0';
  };

  const handlePaymentMethodSelect = (method: 'card' | 'mobile') => {
    setPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    const amount = parseFloat(getAmountToCharge());
    if (amount <= 0) return;

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Update donation progress
      if (donationData?.id) {
        updateDonationProgress(donationData.id, amount);
      }
      
      // Redirect after success
      setTimeout(() => {
        if (donationData?.redirectUrl) {
          window.location.href = donationData.redirectUrl;
        }
      }, 2000);
    }, 2000);
  };

  if (!donationData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Thank You!</h1>
            <p className="text-gray-400">{donationData.thankYouMessage}</p>
          </div>
          <div className="text-sm text-gray-500">
            Redirecting to {donationData.redirectUrl}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {invoiceSettings.customLogo && invoiceSettings.logoUrl ? (
              <img
                src={invoiceSettings.logoUrl}
                alt={invoiceSettings.businessName}
                className="w-6 h-6 object-contain"
              />
            ) : (
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: invoiceSettings.primaryColor }}
              >
                <span className="text-white font-bold text-xs">
                  {(invoiceSettings.businessName || 'N').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span
              className="font-semibold text-white text-sm"
              style={{ color: invoiceSettings.primaryColor }}
            >
              {invoiceSettings.businessName || 'Nardopay'}
            </span>
          </div>
          <h1 className="text-lg font-bold text-white mb-1">Support Our Cause</h1>
          <p className="text-gray-400 text-xs">Secure donation powered by {invoiceSettings.businessName || 'Nardopay'}</p>
        </div>

        {/* Campaign Info */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardContent className="p-4">
            <div className="text-xs font-bold text-white mb-2">Campaign</div>
            <div className="space-y-3">
              <div>
                <div className="text-white text-sm font-medium">
                  {donationData.title}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {donationData.description}
                </div>
              </div>
              
              {/* Goal Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Goal</span>
                  <span className="text-gray-400 font-medium">
                    {formatAmount(donationData.goalAmount)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: '0%',
                      background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">$0 raised</span>
                  <span className="text-gray-400">0%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Amount Selection */}
        {currentStep === 1 && (
          <>
            {/* Donation Amount Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-3 border rounded text-center transition-colors ${
                    selectedAmount === amount 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-600 hover:border-blue-500'
                  }`}
                >
                  <div className="text-white font-medium text-sm">
                    {formatAmount(amount)}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-4">
              <Input
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white text-center"
              />
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors"
                disabled={!getAmountToCharge() || getAmountToCharge() === '0'}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="text-xs text-gray-300">Card</div>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('mobile')}
                className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors"
                disabled={!getAmountToCharge() || getAmountToCharge() === '0'}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="text-xs text-gray-300">Mobile</div>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Payment Details Form */}
        {currentStep === 2 && (
          <>
            <Card className="bg-gray-800 border-gray-700 mb-4">
              <CardContent className="p-4">
                <div className="text-sm font-bold text-white mb-3">
                  {paymentMethod === 'card' ? 'Card Details' : 'Mobile Money Details'}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-xs text-gray-300">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={customerData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        maxLength={19}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry" className="text-xs text-gray-300">Expiry Date *</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={customerData.cardExpiry}
                          onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                          maxLength={5}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv" className="text-xs text-gray-300">CVV *</Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          value={customerData.cardCvv}
                          onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                          maxLength={4}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardHolderName" className="text-xs text-gray-300">Cardholder Name *</Label>
                      <Input
                        id="cardHolderName"
                        placeholder="Name on card"
                        value={customerData.cardHolderName}
                        onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs text-gray-300">Mobile Money Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+250 123 456 789"
                        value={customerData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donate Button - Only show on step 2 */}
            <div
              className="p-3 rounded text-center text-white font-medium cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
              }}
              onClick={handlePayment}
            >
              {paymentStatus === 'processing' ? 'Processing...' : `Donate ${formatAmount(getAmountToCharge())}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationPage; 