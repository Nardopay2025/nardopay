import { useState, useEffect } from 'react';
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
  Phone
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
    bankName: '',
    accountNumber: '',
    accountName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolderName: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
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
    return {
      id: id,
      amount: '$50.00',
      currency: 'USD',
      productName: 'Product/Service',
      description: 'Payment for goods or services',
      thankYouMessage: 'Thank you for your payment!',
      redirectUrl: '',
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

  const calculateTotal = () => {
    const baseAmount = parseFloat(paymentData?.amount.replace('$', '') || '0');
    return (baseAmount * quantity).toFixed(2);
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
                <span className="font-semibold">${calculateTotal()}</span>
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
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}15, ${invoiceSettings.secondaryColor}15, ${invoiceSettings.primaryColor}25)`
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {invoiceSettings.customLogo && invoiceSettings.logoUrl ? (
              <img 
                src={invoiceSettings.logoUrl} 
                alt={invoiceSettings.businessName} 
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: invoiceSettings.primaryColor }}
              >
                <span className="text-white font-bold text-lg">
                  {invoiceSettings.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span 
              className="text-2xl font-bold"
              style={{ color: invoiceSettings.primaryColor }}
            >
              {invoiceSettings.businessName}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Payment</h1>
          <p className="text-muted-foreground">Secure payment powered by Nardopay</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" style={{ color: invoiceSettings.primaryColor }} />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Your Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={customerData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={customerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Dynamic fields based on payment method */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={customerData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date *</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={customerData.cardExpiry}
                          onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV *</Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          value={customerData.cardCvv}
                          onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                          maxLength={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardHolderName">Cardholder Name *</Label>
                        <Input
                          id="cardHolderName"
                          placeholder="Name on card"
                          value={customerData.cardHolderName}
                          onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'mobile' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Money Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+250 123 456 789"
                      value={customerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                )}
                
                {paymentMethod === 'bank' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        placeholder="e.g., Chase Bank, Bank of America"
                        value={customerData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input
                          id="accountNumber"
                          placeholder="1234567890"
                          value={customerData.accountNumber}
                          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Holder Name *</Label>
                        <Input
                          id="accountName"
                          placeholder="Account holder's full name"
                          value={customerData.accountName}
                          onChange={(e) => handleInputChange('accountName', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Payment Method</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-current bg-current/10'
                        : 'border-border hover:border-current/50'
                    }`}
                    style={{ 
                      '--tw-border-opacity': paymentMethod === 'card' ? 1 : 0.5,
                      '--tw-bg-opacity': paymentMethod === 'card' ? 0.1 : 0,
                      color: invoiceSettings.primaryColor
                    } as React.CSSProperties}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" style={{ color: invoiceSettings.primaryColor }} />
                    <span className="text-sm font-medium">Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'mobile'
                        ? 'border-current bg-current/10'
                        : 'border-border hover:border-current/50'
                    }`}
                    style={{ 
                      '--tw-border-opacity': paymentMethod === 'mobile' ? 1 : 0.5,
                      '--tw-bg-opacity': paymentMethod === 'mobile' ? 0.1 : 0,
                      color: invoiceSettings.primaryColor
                    } as React.CSSProperties}
                  >
                                          <Smartphone className="w-6 h-6 mx-auto mb-2" style={{ color: invoiceSettings.primaryColor }} />
                    <span className="text-sm font-medium">Mobile Money</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'bank'
                        ? 'border-current bg-current/10'
                        : 'border-border hover:border-current/50'
                    }`}
                    style={{ 
                      '--tw-border-opacity': paymentMethod === 'bank' ? 1 : 0.5,
                      '--tw-bg-opacity': paymentMethod === 'bank' ? 0.1 : 0,
                      color: invoiceSettings.primaryColor
                    } as React.CSSProperties}
                  >
                    <Globe className="w-6 h-6 mx-auto mb-2" style={{ color: invoiceSettings.primaryColor }} />
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Payment Button */}
              <Button 
                onClick={handlePayment}
                className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`,
                  color: 'white',
                  boxShadow: `0 4px 14px 0 ${invoiceSettings.primaryColor}40`,
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${invoiceSettings.secondaryColor}, ${invoiceSettings.primaryColor})`;
                  e.currentTarget.style.boxShadow = `0 6px 20px 0 ${invoiceSettings.secondaryColor}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`;
                  e.currentTarget.style.boxShadow = `0 4px 14px 0 ${invoiceSettings.primaryColor}40`;
                }}
                disabled={!customerData.name || !customerData.email || 
                  (paymentMethod === 'card' && (!customerData.cardNumber || !customerData.cardExpiry || !customerData.cardCvv || !customerData.cardHolderName)) ||
                  (paymentMethod === 'mobile' && !customerData.phone) ||
                  (paymentMethod === 'bank' && (!customerData.bankName || !customerData.accountNumber || !customerData.accountName))
                }
              >
                {paymentStatus === 'processing' && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                )}
                {paymentStatus !== 'processing' && (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Pay ${calculateTotal()}
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  By completing this payment, you agree to our Terms of Service
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{paymentData.productName}</h3>
                    <p className="text-sm text-muted-foreground">{paymentData.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-foreground">{paymentData.amount}</div>
                    <div className="text-sm text-muted-foreground">{paymentData.currency}</div>
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 hover:bg-current/10"
                        style={{ color: invoiceSettings.primaryColor }}
                      >
                        -
                      </Button>
                      <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 hover:bg-current/10"
                        style={{ color: invoiceSettings.primaryColor }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Subtotal</div>
                    <div className="font-semibold text-foreground">${calculateTotal()}</div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-foreground">${calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badges */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Global
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Smartphone className="w-3 h-3 mr-1" />
                    Mobile
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 