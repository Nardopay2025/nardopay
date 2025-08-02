import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscriptionLinks } from '@/contexts/SubscriptionLinksContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
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
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    email: '',
    name: ''
  });

  useEffect(() => {
    if (linkId) {
      const link = getSubscriptionLink(linkId);
      if (link) {
        setSubscriptionData(link);
      } else {
        // Generate mock data for demo purposes
        setSubscriptionData({
          id: linkId,
          title: 'Premium Membership',
          description: 'Get access to exclusive content, priority support, and advanced features. Cancel anytime.',
          amount: '$29.99',
          currency: 'USD',
          billingCycle: 'monthly',
          trialDays: 7,
          thankYouMessage: 'Welcome to Premium! Your subscription is now active. You\'ll receive a confirmation email shortly.',
          redirectUrl: 'https://example.com/welcome',
          subscribers: 156,
          totalRevenue: '$4,678.44',
          nextBillingDate: 'September 15, 2024'
        });
      }
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
    return `${currencySymbol}${amount.replace(/[^\d.]/g, '')}`;
  };

  const handlePayment = async () => {
    if (!formData.email || !formData.name) return;

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Update subscription stats
      if (subscriptionData) {
        updateSubscriptionStats(subscriptionData.id, true);
      }
      
      // Redirect after 3 seconds
      setTimeout(() => {
        if (subscriptionData?.redirectUrl) {
          const redirectUrl = subscriptionData.redirectUrl.startsWith('http') 
            ? subscriptionData.redirectUrl 
            : `https://${subscriptionData.redirectUrl}`;
          window.location.href = redirectUrl;
        }
      }, 3000);
    }, 2000);
  };

  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary mx-auto mb-4"></div>
            <p className="text-foreground">Loading subscription page...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Subscription Active!</h2>
            <p className="text-muted-foreground mb-6">{subscriptionData.thankYouMessage}</p>
            <div className="bg-green-success/10 rounded-lg p-4 mb-6 border border-green-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-success" />
                <span className="text-sm font-medium text-foreground">Next billing: {subscriptionData.nextBillingDate}</span>
              </div>
              <p className="text-xs text-muted-foreground">You can cancel your subscription anytime from your account settings.</p>
            </div>
            <p className="text-sm text-muted-foreground">Redirecting you shortly...</p>
            <Button 
              onClick={() => window.location.href = subscriptionData.redirectUrl || '/'}
              className="mt-4"
            >
              Continue
            </Button>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {invoiceSettings.customLogo && invoiceSettings.logoUrl ? (
              <img src={invoiceSettings.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
            ) : (
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: invoiceSettings.primaryColor || '#3b82f6' }}
              >
                {invoiceSettings.businessName?.charAt(0) || 'N'}
              </div>
            )}
            <span 
              className="font-semibold text-lg"
              style={{ color: invoiceSettings.primaryColor || '#3b82f6' }}
            >
              {invoiceSettings.businessName || 'Nardopay'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{subscriptionData.title}</h1>
          <p className="text-muted-foreground mb-6">{subscriptionData.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subscription Form */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Subscribe Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subscription Details */}
              <div className="bg-blue-primary/10 rounded-lg p-4 mb-6 border border-blue-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-foreground">{formatAmount(subscriptionData.amount)}</span>
                  <Badge variant="secondary" className="bg-blue-primary/20 text-foreground">
                    {getBillingCycleDisplay(subscriptionData.billingCycle)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Billed every {getBillingCycleText(subscriptionData.billingCycle)}
                  {subscriptionData.trialDays > 0 && (
                    <span className="block mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {subscriptionData.trialDays}-day free trial
                    </span>
                  )}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={paymentMethod === 'card' ? "default" : "outline"}
                    onClick={() => setPaymentMethod('card')}
                    className="h-12"
                    style={{
                      backgroundColor: paymentMethod === 'card' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined,
                      borderColor: paymentMethod === 'card' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === 'mobile' ? "default" : "outline"}
                    onClick={() => setPaymentMethod('mobile')}
                    className="h-12"
                    style={{
                      backgroundColor: paymentMethod === 'mobile' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined,
                      borderColor: paymentMethod === 'mobile' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined
                    }}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              )}



              <Button
                onClick={handlePayment}
                disabled={!formData.email || !formData.name || paymentStatus === 'processing'}
                className="w-full h-12 text-lg"
                style={{
                  backgroundColor: invoiceSettings.primaryColor || '#3b82f6',
                  borderColor: invoiceSettings.primaryColor || '#3b82f6'
                }}
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Subscribe for ${formatAmount(subscriptionData.amount)}/${getBillingCycleText(subscriptionData.billingCycle)}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By subscribing, you agree to our Terms of Service and Privacy Policy. 
                You can cancel your subscription anytime.
              </p>
            </CardContent>
          </Card>

          {/* Subscription Stats */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Subscription Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Subscribers</span>
                  <span className="font-semibold">{subscriptionData.subscribers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Revenue</span>
                  <span className="font-semibold">{subscriptionData.totalRevenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Billing Cycle</span>
                  <span className="font-semibold">{getBillingCycleDisplay(subscriptionData.billingCycle)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Billing</span>
                  <span className="font-semibold">{subscriptionData.nextBillingDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Secure subscription powered by Nardopay</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage; 