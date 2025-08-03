import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscriptionLinks } from '@/contexts/SubscriptionLinksContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Calendar,
  CheckCircle,
  ArrowLeft,
  Clock,
  Zap
} from 'lucide-react';

const SubscriptionPage = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { getSubscriptionLink, updateSubscriptionStats } = useSubscriptionLinks();
  const { invoiceSettings } = useInvoiceSettings();
  
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
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

  // Generate mock data for any link ID (for testing purposes)
  const generateMockData = (id: string) => {
    // Try to get the actual subscription link data first
    const actualLink = getSubscriptionLink(id);
    if (actualLink) {
      return {
        id: actualLink.id,
        title: actualLink.title,
        description: actualLink.description,
        amount: actualLink.amount,
        currency: actualLink.currency,
        billingCycle: actualLink.billingCycle,
        trialDays: actualLink.trialDays,
        thankYouMessage: actualLink.thankYouMessage,
        redirectUrl: actualLink.redirectUrl,
        status: actualLink.status || 'ACTIVE'
      };
    }

    // Fallback to default mock data
    return {
      id: id,
      title: 'Premium Membership',
      description: 'Get access to exclusive content, priority support, and advanced features. Cancel anytime.',
      amount: '29.99',
      currency: 'USD',
      billingCycle: 'monthly',
      trialDays: 7,
      thankYouMessage: 'Welcome to Premium! Your subscription is now active. You\'ll receive a confirmation email shortly.',
      redirectUrl: 'https://example.com/success',
      status: 'ACTIVE'
    };
  };

  useEffect(() => {
    if (linkId) {
      const data = generateMockData(linkId);
      setSubscriptionData(data);
    }
  }, [linkId, getSubscriptionLink]);

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      case 'quarterly': return 'quarter';
      case 'yearly': return 'year';
      default: return 'month';
    }
  };

  const getBillingCycleDisplay = (cycle: string) => {
    switch (cycle) {
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return 'Monthly';
    }
  };

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
    const currencySymbol = getCurrencySymbol(subscriptionData?.currency || 'USD');
    return `${currencySymbol}${amount}`;
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
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Update subscription stats
      if (subscriptionData?.id) {
        updateSubscriptionStats(subscriptionData.id, true);
      }
      
      // Redirect after success
      setTimeout(() => {
        if (subscriptionData?.redirectUrl) {
          window.location.href = subscriptionData.redirectUrl;
        }
      }, 2000);
    }, 2000);
  };

  if (!subscriptionData) {
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
            <h1 className="text-2xl font-bold text-white mb-2">Welcome!</h1>
            <p className="text-gray-400">{subscriptionData.thankYouMessage}</p>
          </div>
          <div className="text-sm text-gray-500">
            Redirecting to {subscriptionData.redirectUrl}...
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
          <h1 className="text-lg font-bold text-white mb-1">Subscribe to Our Service</h1>
          <p className="text-gray-400 text-xs">Secure subscription powered by {invoiceSettings.businessName || 'Nardopay'}</p>
        </div>

        {/* Subscription Plan */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardContent className="p-4">
            <div className="text-xs font-bold text-white mb-2">Subscription Plan</div>
            <div className="space-y-3">
              <div>
                <div className="text-white text-sm font-medium">
                  {subscriptionData.title}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {subscriptionData.description}
                </div>
              </div>
              
              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Price</span>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">
                      {formatAmount(subscriptionData.amount)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      per {getBillingCycleText(subscriptionData.billingCycle)}
                    </div>
                  </div>
                </div>
                
                {subscriptionData.trialDays > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Trial</span>
                    <span className="text-green-400 text-xs font-medium">
                      {subscriptionData.trialDays} days free
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Payment Method Selection */}
        {currentStep === 1 && (
          <>
            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors"
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="text-xs text-gray-300">Card</div>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('mobile')}
                className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors"
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

            {/* Subscribe Button - Only show on step 2 */}
            <div
              className="p-3 rounded text-center text-white font-medium cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
              }}
              onClick={handlePayment}
            >
              {paymentStatus === 'processing' ? 'Processing...' : `Subscribe Now`}
            </div>
            
            <div className="text-center mt-2">
              <p className="text-gray-400 text-xs">
                Cancel anytime • Secure payment
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage; 