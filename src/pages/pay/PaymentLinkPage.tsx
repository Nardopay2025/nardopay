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

  // If we have a payment URL, show it in an iframe
  if (paymentUrl) {
    return (
      <div className="min-h-screen bg-background">
        {/* Branded Header */}
        <div 
          className="p-6 text-white shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {invoiceSettings?.logo_url ? (
                <img 
                  src={invoiceSettings.logo_url} 
                  alt={businessName}
                  className="h-10 object-contain"
                />
              ) : (
                <h1 className="text-xl font-bold">{businessName}</h1>
              )}
              <div className="text-white/80 text-sm">
                Secure Checkout
              </div>
            </div>
            <div className="text-right text-sm text-white/80">
              {paymentLink.currency} {parseFloat(paymentLink.amount).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Pesapal Payment iFrame */}
        <iframe
          src={paymentUrl}
          className="w-full border-0"
          style={{ height: 'calc(100vh - 80px)' }}
          title="Secure Payment"
        />
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
