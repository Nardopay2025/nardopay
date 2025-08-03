import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { usePaymentLinks } from '@/contexts/PaymentLinksContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  ArrowLeft,
  DollarSign,
  User,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';

const PaymentPage = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { invoiceSettings } = useInvoiceSettings();
  const { getPaymentLink } = usePaymentLinks();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolderName: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

  // Mock payment link data - in real app, this would come from API
  const mockPaymentLinks = {
    'abc123': {
      id: 'abc123',
      amount: '$100.00',
      currency: 'USD',
      productName: 'Premium T-Shirt',
      description: 'High-quality cotton t-shirt with custom design',
      thankYouMessage: 'Thank you for your purchase!',
      redirectUrl: 'https://my-store.com/success',
      status: 'ACTIVE'
    },
    'def456': {
      id: 'def456',
      amount: '$250.00',
      currency: 'USD',
      productName: 'Consultation Service',
      description: 'One-hour business consultation session',
      thankYouMessage: 'Thank you for booking! We\'ll contact you soon.',
      redirectUrl: '',
      status: 'ACTIVE'
    },
    'ghi789': {
      id: 'ghi789',
      amount: '$75.00',
      currency: 'USD',
      productName: 'Digital Course',
      description: 'Complete web development course with lifetime access',
      thankYouMessage: 'Welcome to the course! Check your email for access.',
      redirectUrl: 'https://course-platform.com/welcome',
      status: 'EXPIRED'
    }
  };

  // Generate mock data for any link ID (for testing purposes)
  const generateMockData = (id: string) => {
    // Try to get the actual payment link data first
    const actualLink = getPaymentLink(id);
    if (actualLink) {
      return {
        id: actualLink.id,
        amount: actualLink.amount,
        currency: actualLink.currency,
        productName: actualLink.productName,
        description: actualLink.description,
        thankYouMessage: actualLink.thankYouMessage,
        redirectUrl: actualLink.redirectUrl,
        status: actualLink.status || 'ACTIVE'
      };
    }
    
    // Fallback to default mock data
    return {
      id: id,
      amount: '$50.00',
      currency: 'USD',
      productName: 'Product/Service',
      description: 'Payment for goods or services',
      thankYouMessage: 'Thank you for your payment!',
      redirectUrl: 'https://example.com/success',
      status: 'ACTIVE'
    };
  };

  useEffect(() => {
    // Simulate API call to fetch payment link data
    setTimeout(() => {
      // First check if it's one of our predefined links
      let linkData = mockPaymentLinks[linkId as keyof typeof mockPaymentLinks];
      
      // If not found, check if it's a created payment link
      if (!linkData && linkId) {
        linkData = getPaymentLink(linkId);
      }
      
      // If still not found, generate mock data for any link ID (for testing)
      if (!linkData) {
        linkData = generateMockData(linkId || '');
      }
      
      setPaymentData(linkData);
      setLoading(false);
    }, 1000);
  }, [linkId, getPaymentLink]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setPaymentMethod('');
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

  const calculateTotal = () => {
    const amountString = paymentData?.amount || '0';
    const baseAmount = parseFloat(amountString.replace(/[^\d.]/g, '')) || 0;
    return (baseAmount * quantity).toFixed(2);
  };

  const formatAmount = (amount: string) => {
    const currencySymbol = getCurrencySymbol(paymentData?.currency || 'USD');
    return `${currencySymbol}${amount}`;
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPaymentStatus('success');
    
    // Show success message for 3 seconds, then redirect
    setTimeout(() => {
      console.log('Redirect URL:', paymentData.redirectUrl); // Debug log
      if (paymentData.redirectUrl && paymentData.redirectUrl.trim() !== '') {
        // Ensure URL has protocol
        let redirectUrl = paymentData.redirectUrl.trim();
        if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
          redirectUrl = 'https://' + redirectUrl;
        }
        console.log('Redirecting to:', redirectUrl); // Debug log
        window.location.href = redirectUrl;
      } else {
        // If no redirect URL, go back to home
        console.log('No redirect URL, going home'); // Debug log
        navigate('/');
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Loading Payment Details</h1>
          <p className="text-muted-foreground mb-4">Please wait while we load your payment information...</p>
        </div>
      </div>
    );
  }

  if (paymentData.status === 'EXPIRED') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Payment Link Expired</h1>
          <p className="text-muted-foreground mb-4">This payment link has expired and is no longer active.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Show success confirmation
  if (paymentStatus === 'success') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}15, ${invoiceSettings.secondaryColor}15, ${invoiceSettings.primaryColor}25)`
        }}
      >
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6">
              {paymentData.thankYouMessage || 'Thank you for your payment!'}
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">{formatAmount(calculateTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-semibold">{paymentData.productName}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Redirecting you in a few seconds...
            </div>
            {paymentData.redirectUrl && paymentData.redirectUrl.trim() !== '' && (
              <Button 
                onClick={() => {
                  let redirectUrl = paymentData.redirectUrl.trim();
                  if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
                    redirectUrl = 'https://' + redirectUrl;
                  }
                  window.location.href = redirectUrl;
                }}
                className="w-full"
                style={{ 
                  background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`,
                  color: 'white',
                  border: 'none'
                }}
              >
                Continue to {paymentData.redirectUrl}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show processing state
  if (paymentStatus === 'processing') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}15, ${invoiceSettings.secondaryColor}15, ${invoiceSettings.primaryColor}25)`
        }}
      >
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: invoiceSettings.primaryColor }}></div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Processing Payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we process your payment securely.
            </p>
          </CardContent>
        </Card>
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
                  {invoiceSettings.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span 
              className="font-semibold text-white text-sm"
              style={{ color: invoiceSettings.primaryColor }}
            >
              {invoiceSettings.businessName}
            </span>
          </div>
          <h1 className="text-lg font-bold text-white mb-1">Complete Your Payment</h1>
          <p className="text-gray-400 text-xs">Secure payment powered by {invoiceSettings.businessName}</p>
        </div>

        {/* Back Button */}
        {currentStep === 2 && (
          <Button
            variant="outline"
            onClick={handleBackToStep1}
            className="flex items-center gap-2 mb-4 w-full"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Step 1
          </Button>
        )}

        {/* Order Summary */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardContent className="p-4">
            <div className="text-xs font-bold text-white mb-2">Order Summary</div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{paymentData.productName}</div>
                <div className="text-gray-400 text-xs mt-1">{paymentData.description}</div>
              </div>
              <div className="text-right ml-4">
                <div className="text-white font-bold text-sm">{formatAmount(calculateTotal())}</div>
                <div className="text-gray-400 text-xs">{paymentData.currency}</div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-3 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Total</span>
                <span className="text-white font-bold text-sm">{formatAmount(calculateTotal())}</span>
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
                className="p-3 border border-gray-600 rounded text-center hover:border-current/50 transition-colors"
                style={{ color: invoiceSettings.primaryColor }}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" style={{ color: invoiceSettings.primaryColor }} />
                <div className="text-xs text-gray-300">Card</div>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('mobile')}
                className="p-3 border border-gray-600 rounded text-center hover:border-current/50 transition-colors"
                style={{ color: invoiceSettings.primaryColor }}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1" style={{ color: invoiceSettings.primaryColor }} />
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

            {/* Pay Button - Only show on step 2 */}
            <div 
              className="p-3 rounded text-center text-white font-medium cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
              }}
              onClick={handlePayment}
            >
              Pay {formatAmount(calculateTotal())}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage; 