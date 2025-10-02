import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Building2, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentLinkPage() {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'bank'>('mobile');
  const [processing, setProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (linkCode) {
      fetchPaymentLink();
    }
  }, [linkCode]);

  const fetchPaymentLink = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_links')
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

      // Fetch merchant's branding settings from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_name, business_address, tax_id, invoice_footer, logo_url, primary_color, secondary_color')
        .eq('id', row.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      if (profileData && profileData.business_name) {
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: profileData.business_address || '',
          tax_id: profileData.tax_id || '',
          invoice_footer: profileData.invoice_footer || '',
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      toast({
        title: 'Processing Payment',
        description: 'Redirecting to payment gateway...',
      });

      // Call Pesapal edge function to submit order
      const { data, error } = await supabase.functions.invoke('pesapal-submit-order', {
        body: {
          linkCode,
          linkType: 'payment',
          payerName,
          payerEmail,
          paymentMethod,
        },
      });

      if (error) throw error;

      if (data?.redirect_url) {
        // Show payment in iframe on our domain instead of redirecting
        setPaymentUrl(data.redirect_url);
        setProcessing(false);
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to initiate payment',
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

  // If we have a payment URL, show it in an iframe with full branding
  if (paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Branded Header */}
        <div 
          className="p-6 text-white shadow-xl relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
          }}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-4">
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
                <div className="text-white/80 text-sm mb-1">Invoice #{linkCode?.slice(0, 8).toUpperCase()}</div>
                <div className="text-2xl font-bold">
                  {paymentLink.currency} {parseFloat(paymentLink.amount).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-white/90 font-medium">{paymentLink.product_name}</div>
                {paymentLink.description && (
                  <div className="text-white/70 text-sm mt-1">{paymentLink.description}</div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>

        {/* Payment iframe container with branding */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
            {/* Payment provider notice */}
            <div className="bg-muted/50 px-6 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Powered by {businessName}
              </div>
              <div className="text-xs text-muted-foreground">
                Encrypted & Secure Payment
              </div>
            </div>
            
            {/* Pesapal Payment iFrame */}
            <iframe
              src={paymentUrl}
              className="w-full border-0 bg-background"
              style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
              title="Secure Payment Gateway"
            />
            
            {/* Trust footer */}
            <div className="bg-muted/30 px-6 py-4 border-t border-border">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SSL Encrypted
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  PCI Compliant
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  24/7 Support
                </div>
              </div>
              {invoiceSettings?.invoice_footer && (
                <div className="text-center text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                  {invoiceSettings.invoice_footer}
                </div>
              )}
            </div>
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
          <form onSubmit={handlePayment} className="space-y-6">
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
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'mobile' | 'bank')}>
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-xs text-muted-foreground">Pay via M-Pesa, Airtel Money, etc.</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="h-5 w-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">Pay via bank account</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full text-white" 
              disabled={processing}
              style={{ 
                background: processing 
                  ? undefined 
                  : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
              }}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Proceed to Checkout - ${paymentLink.currency} ${parseFloat(paymentLink.amount).toFixed(2)}`
              )}
            </Button>
          </form>

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
