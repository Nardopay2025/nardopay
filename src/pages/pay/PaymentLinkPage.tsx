import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { PaymentDetailsForm } from '@/components/checkout/PaymentDetailsForm';
import { processPayment, PaymentMethod } from '@/lib/paymentRouter';

export default function PaymentLinkPage() {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [merchantCountry, setMerchantCountry] = useState<string>('KE');
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (linkCode) {
      fetchPaymentLink();
    }
  }, [linkCode]);

  const fetchPaymentLink = async () => {
    try {
      // Use secure public view to avoid exposing sensitive fields
      const { data, error } = await supabase
        .from('public_payment_links')
        .select('*')
        .eq('link_code', linkCode)
        .limit(1);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const row = Array.isArray(data) ? data[0] : undefined;
      if (!row) {
        console.warn('No payment link found for code:', linkCode);
        navigate('/404');
        return;
      }

      console.log('Payment link found:', row);
      setPaymentLink(row);

      // Fetch merchant's branding settings from safe_profiles view (no PII exposure)
      const { data: profileData, error: profileError } = await supabase
        .from('safe_profiles')
        .select('business_name, logo_url, primary_color, secondary_color, country')
        .eq('id', row.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      if (profileData) {
        setMerchantCountry(profileData.country || 'KE');
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: profileData.logo_url || '',
          primary_color: profileData.primary_color || '#0EA5E9',
          secondary_color: profileData.secondary_color || '#0284C7',
        });
      } else {
        // Default to NardoPay branding if merchant hasn't set up branding
        setInvoiceSettings({
          business_name: 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: '',
          primary_color: '#0EA5E9',
          secondary_color: '#0284C7',
        });
      }
    } catch (error: any) {
      console.error('Error fetching payment link:', error);
      toast({ title: 'Error', description: 'Payment link not found or inactive', variant: 'destructive' });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentDetails: any) => {
    if (!payerName || !payerEmail) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name and email address',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate phone format if provided
    if (phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number with country code (e.g., +27123456789)',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      const result = await processPayment({
        linkType: 'payment',
        linkCode: linkCode!,
        paymentMethod: selectedMethod!,
        merchantCountry,
        customerDetails: {
          name: payerName,
          email: payerEmail,
          phone: phoneNumber,
        },
        cardDetails: paymentDetails.cardDetails,
      });

      if (result.success && result.redirect_url) {
        setPaymentUrl(result.redirect_url);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Failed to process payment';
      let errorTitle = 'Payment Failed';
      
      if (error.message) {
        if (error.message.includes('COUNTRY_NOT_SUPPORTED')) {
          errorTitle = 'Country Not Supported';
          errorMessage = error.message.split(':')[1]?.trim() || 'This payment method is not available in your region.';
        } else if (error.message.includes('Invalid Access Token')) {
          errorMessage = 'Payment service configuration error. Please contact merchant.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const primaryColor = invoiceSettings?.primary_color || '#0EA5E9';
  const secondaryColor = invoiceSettings?.secondary_color || '#0284C7';
  const businessName = invoiceSettings?.business_name || 'Business';

  // Show payment iframe if we have the URL
  if (paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div
          className="p-6 text-white shadow-xl relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {invoiceSettings?.logo_url ? (
                  <img
                    src={invoiceSettings.logo_url}
                    alt={businessName}
                    className="h-12 object-contain bg-white/10 backdrop-blur-sm rounded-lg p-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{businessName}</h1>
                )}
              </div>
              <div className="text-right">
                <div className="text-white/80 text-sm mb-1">
                  Payment #{linkCode?.slice(0, 8).toUpperCase()}
                </div>
                <div className="text-2xl font-bold">
                  {paymentLink.currency} {parseFloat(paymentLink.amount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
            <div className="bg-muted/50 px-6 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Powered by NardoPay
              </div>
              <div className="text-xs text-muted-foreground">Encrypted & Secure Payment</div>
            </div>

            <iframe
              src={paymentUrl}
              className="w-full border-0 bg-background"
              style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
              title="Secure Payment Gateway"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl overflow-hidden border-border">
        {/* Invoice Header with Brand Colors */}
        <div 
          className="p-8 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              {invoiceSettings?.logo_url ? (
                <img 
                  src={invoiceSettings.logo_url} 
                  alt={businessName}
                  className="h-12 mb-4 object-contain"
                />
              ) : (
                <h1 className="text-2xl font-bold mb-2">{businessName}</h1>
              )}
              {invoiceSettings?.business_address && (
                <p className="text-white/80 text-sm">{invoiceSettings.business_address}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">INVOICE</p>
              <p className="text-xl font-bold">#{linkCode?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 space-y-6">
          {/* Product Details */}
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item</span>
                <span className="font-medium">{paymentLink.product_name}</span>
              </div>
              {paymentLink.description && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description</span>
                  <span className="text-sm">{paymentLink.description}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Amount Due</span>
                <span style={{ color: primaryColor }}>
                  {paymentLink.currency} {parseFloat(paymentLink.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="bg-background"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+27123456789"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code, digits only (e.g., +27123456789)
                </p>
              </div>
            </div>

            {/* Payment Method Selection */}
            {!selectedMethod && (
              <div className="space-y-4">
                <h3 className="font-semibold">Payment Method</h3>
                <PaymentMethodSelector
                  selectedMethod={selectedMethod}
                  onSelectMethod={setSelectedMethod}
                  merchantCountry={merchantCountry}
                  primaryColor={primaryColor}
                />
              </div>
            )}

            {/* Payment Details Form */}
            {selectedMethod && (
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMethod(null)}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Change payment method
                </Button>

                <PaymentDetailsForm
                  paymentMethod={selectedMethod}
                  amount={parseFloat(paymentLink.amount)}
                  currency={paymentLink.currency}
                  onSubmit={handlePaymentSubmit}
                  processing={processing}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          {invoiceSettings?.invoice_footer && (
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              {invoiceSettings.invoice_footer}
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Secured by NardoPay • Your payment information is encrypted
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
