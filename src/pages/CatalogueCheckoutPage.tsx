import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, 
  CheckCircle,
  CreditCard,
  Smartphone,
  Globe,
  ArrowLeft,
  X
} from 'lucide-react';

const CatalogueCheckoutPage = () => {
  const { catalogueId } = useParams<{ catalogueId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { invoiceSettings } = useInvoiceSettings();
  
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [catalogueData, setCatalogueData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    email: '',
    name: '',
    address: ''
  });

  useEffect(() => {
    if (location.state) {
      setCart(location.state.cart || {});
      setCatalogueData(location.state.catalogueData || null);
    }
  }, [location.state]);

  // Helper function to ensure button visibility
  const getButtonStyle = (customColor: string) => {
    return {
      backgroundColor: customColor || '#3B82F6',
      borderColor: customColor || '#3B82F6',
      color: 'white',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    };
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

  const formatAmount = (amount: number, currencyCode: string) => {
    const currencySymbol = getCurrencySymbol(currencyCode);
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = catalogueData?.items.find((i: any) => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const handleCheckout = async () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 2000);
  };

  if (!catalogueData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">Your order has been processed successfully.</p>
            <p className="text-sm text-muted-foreground">Redirecting you back...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}15, ${invoiceSettings.secondaryColor}15, ${invoiceSettings.primaryColor}25)`
      }}
    >
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Order</h1>
          <p className="text-muted-foreground">Secure checkout powered by Nardopay</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" style={{ color: invoiceSettings.primaryColor }} />
                Order Details
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
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your shipping address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
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
                  </Button>
                  <Button
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
                  </Button>
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'mobile' && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Mobile Money Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+250 123 456 789"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              )}

              {/* Payment Button */}
              <Button 
                onClick={handleCheckout}
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
                disabled={!formData.name || !formData.email || 
                  (paymentMethod === 'card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) ||
                  (paymentMethod === 'mobile' && !formData.phoneNumber)
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
                    Pay {formatAmount(getCartTotal(), catalogueData.currency)}
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
                {Object.entries(cart).map(([itemId, quantity]) => {
                  const item = catalogueData.items.find((i: any) => i.id === itemId);
                  if (!item) return null;
                  
                  return (
                    <div key={itemId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-foreground">{formatAmount(item.price * quantity, item.currency)}</div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-foreground">{formatAmount(getCartTotal(), catalogueData.currency)}</span>
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

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate(`/catalogue/${catalogueId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalogue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCheckoutPage; 