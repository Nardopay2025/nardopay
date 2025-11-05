import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/lib/paymentRouter';

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
  const [whatsappNumber, setWhatsappNumber] = useState('');
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

  const handleCheckout = async () => {
    if (!payerName || !payerEmail || !whatsappNumber) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name, email address, and WhatsApp number',
        variant: 'destructive',
      });
      return;
    }

    // Validate WhatsApp number format
    if (!/^\+?[1-9]\d{1,14}$/.test(whatsappNumber)) {
      toast({
        title: 'Invalid WhatsApp Number',
        description: 'Please enter a valid WhatsApp number with country code (e.g., +27123456789)',
        variant: 'destructive',
      });
      return;
    }
    
    setProcessing(true);

    try {
      const result = await processPayment({
        linkType: 'payment',
        linkCode: linkCode!,
        paymentMethod: 'mobile_money', // Default payment method - gateway will handle method selection
        merchantCountry,
        customerDetails: {
          name: payerName,
          email: payerEmail,
          phone: whatsappNumber,
        },
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
      <div
        className="min-h-screen w-full flex"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
      >
        {/* Left branding panel (hidden on small screens) */}
        <div
          className="hidden lg:flex w-1/5 xl:w-1/4 items-center justify-center text-white"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="p-6 text-center">
            {invoiceSettings?.logo_url ? (
              <img src={invoiceSettings.logo_url} alt={businessName} className="mx-auto h-14 object-contain mb-4" />
            ) : (
              <div className="text-2xl font-bold mb-2">{businessName}</div>
            )}
            <div className="text-white/80 text-sm">Payment #{linkCode?.slice(0, 8).toUpperCase()}</div>
            <div className="text-2xl font-bold mt-2">{paymentLink.currency} {parseFloat(paymentLink.amount).toFixed(2)}</div>
          </div>
        </div>

        {/* Center content: full-height iframe */}
        <div className="flex-1 min-w-0">
          <iframe
            src={paymentUrl}
            title="Secure Payment Gateway"
            className="w-full h-screen border-0 bg-background"
          />
        </div>

        {/* Right branding panel (hidden on small screens) */}
        <div
          className="hidden lg:flex w-1/5 xl:w-1/4 items-center justify-center text-white"
          style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }}
        >
          <div className="p-6 text-center">
            <div className="text-xs uppercase tracking-wide text-white/80 mb-2">Secured by</div>
            <div className="text-lg font-semibold">NardoPay</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-7xl">
        <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-2 shadow-2xl rounded-xl">
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

          {/* Two Column Layout aligned with hero preview */}
          <div className="p-8">
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Left: Product image and description */}
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden bg-muted/40 border border-border min-h-[260px] flex items-center justify-center">
                  {paymentLink.image_url ? (
                    <img
                      src={paymentLink.image_url}
                      alt={paymentLink.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
                      <span className="text-muted-foreground">Product image</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">{paymentLink.product_name}</h3>
                  {paymentLink.description && (
                    <p className="text-muted-foreground leading-relaxed">{paymentLink.description}</p>
                  )}
                </div>
              </div>

              {/* Right: Order summary and client details */}
              <div className="space-y-6">
                {/* Order summary panel */}
                <div className="rounded-xl bg-foreground/5 dark:bg-white/5 p-6 border border-border">
                  <div className="text-foreground font-semibold mb-4">Order Summary</div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-lg font-semibold">{paymentLink.product_name}</div>
                      {paymentLink.description && (
                        <div className="text-sm text-muted-foreground">{paymentLink.description}</div>
                      )}
                    </div>
                    <div className="text-xl font-bold">{paymentLink.currency} {parseFloat(paymentLink.amount).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-xl font-bold">{paymentLink.currency} {parseFloat(paymentLink.amount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Client details (replaces payment option buttons) */}
                <div className="space-y-4">
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
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+27123456789"
                      required
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +27123456789)</p>
                  </div>
                </div>

                {/* Pay button */}
                <div>
                  <Button
                    onClick={handleCheckout}
                    disabled={processing || !payerName || !payerEmail || !whatsappNumber}
                    className="w-full text-white border-0 hover:opacity-90 transition-opacity disabled:opacity-50"
                    size="lg"
                    style={{
                      background:
                        processing || !payerName || !payerEmail || !whatsappNumber
                          ? `${primaryColor}80`
                          : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    }}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${paymentLink.currency} ${parseFloat(paymentLink.amount).toFixed(2)}`
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            {invoiceSettings?.invoice_footer && (
              <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border mb-4">
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
    </div>
  );
}
