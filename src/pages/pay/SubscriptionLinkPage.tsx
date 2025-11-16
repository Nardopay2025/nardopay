import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/lib/paymentRouter';
import { getCurrencyForCountry } from '@/lib/countries';

export default function SubscriptionLinkPage() {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscriptionLink, setSubscriptionLink] = useState<any>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberPhone, setSubscriberPhone] = useState('');
  const [merchantCountry, setMerchantCountry] = useState<string>('KE');
  const [processing, setProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [customerCountry, setCustomerCountry] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [fxLoading, setFxLoading] = useState<boolean>(false);

  useEffect(() => {
    if (linkCode) {
      fetchSubscriptionLink();
    }
  }, [linkCode]);

  const fetchSubscriptionLink = async () => {
    try {
      // Use secure public view to avoid exposing sensitive fields
      const { data, error } = await supabase
        .from('public_subscription_links')
        .select('*')
        .eq('link_code', linkCode)
        .limit(1);

      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : undefined;
      if (!row) {
        navigate('/404');
        return;
      }

      setSubscriptionLink(row);

      const { data: profileData } = await supabase
        .from('safe_profiles')
        .select('business_name, logo_url, primary_color, secondary_color, country')
        .eq('id', row.user_id)
        .single();

      if (profileData && profileData.business_name) {
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: profileData.logo_url || '',
          primary_color: profileData.primary_color || '#8B5CF6',
          secondary_color: profileData.secondary_color || '#7C3AED',
        });
        setMerchantCountry(profileData.country || 'KE');
      } else {
        setInvoiceSettings({
          business_name: 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: '',
          primary_color: '#8B5CF6',
          secondary_color: '#7C3AED',
        });
        setMerchantCountry('KE');
      }

      // Detect customer country via IP and set display currency / converted amount
      try {
        setFxLoading(true);
        const ipRes = await fetch('https://ipapi.co/json');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          const ipCountry = ipData?.country || null; // ISO2
          setCustomerCountry(ipCountry);

          const baseCurrency = row.currency;
          const amountNum =
            typeof row.amount === 'string' ? parseFloat(row.amount) : Number(row.amount);

          // Special rule: RWF subscriptions opened in Zimbabwe should convert to USD
          if (ipCountry === 'ZW' && baseCurrency === 'RWF') {
            const { data: fxData, error: fxError } = await supabase.functions.invoke(
              'get-exchange-rate',
              {
                body: { fromCurrency: 'RWF', toCurrency: 'USD' },
              },
            );
            if (!fxError && fxData?.rate) {
              const rate = Number(fxData.rate);
              if (!Number.isNaN(rate) && !Number.isNaN(amountNum) && amountNum > 0) {
                setDisplayCurrency('USD');
                setConvertedAmount(amountNum * rate);
              } else {
                setDisplayCurrency(baseCurrency);
                setConvertedAmount(amountNum);
              }
            } else {
              setDisplayCurrency(baseCurrency);
              setConvertedAmount(amountNum);
            }
          } else {
            // General rule: convert to customer's local currency where supported
            const localCurrency = getCurrencyForCountry(ipCountry || '');
            if (localCurrency && baseCurrency && localCurrency !== baseCurrency) {
              const { data: fxData, error: fxError } = await supabase.functions.invoke(
                'get-exchange-rate',
                { body: { fromCurrency: baseCurrency, toCurrency: localCurrency } },
              );
              if (!fxError && fxData?.rate) {
                const rate = Number(fxData.rate);
                if (!Number.isNaN(rate) && !Number.isNaN(amountNum) && amountNum > 0) {
                  setDisplayCurrency(localCurrency);
                  setConvertedAmount(amountNum * rate);
                } else {
                  setDisplayCurrency(baseCurrency);
                  setConvertedAmount(amountNum);
                }
              } else {
                setDisplayCurrency(baseCurrency);
                setConvertedAmount(amountNum);
              }
            } else {
              setDisplayCurrency(baseCurrency);
              setConvertedAmount(amountNum);
            }
          }
        } else {
          const amountNum =
            typeof row.amount === 'string' ? parseFloat(row.amount) : Number(row.amount);
          setDisplayCurrency(row.currency);
          setConvertedAmount(amountNum);
        }
      } catch (fxError) {
        console.error('Error determining FX for subscription link:', fxError);
        const amountNum =
          typeof row.amount === 'string' ? parseFloat(row.amount) : Number(row.amount);
        setDisplayCurrency(row.currency);
        setConvertedAmount(amountNum);
      } finally {
        setFxLoading(false);
      }
    } catch (error: any) {
      console.error('Error fetching subscription link:', error);
      toast({ title: 'Error', description: 'Subscription link not found or inactive', variant: 'destructive' });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subscriberName || !subscriberEmail || !subscriberPhone) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name, email address, and mobile number',
        variant: 'destructive',
      });
      return;
    }

    // Basic E.164-ish phone validation
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    if (!phoneRegex.test(subscriberPhone.trim())) {
      toast({
        title: 'Invalid Phone Number',
        description:
          'Enter a valid mobile number with country code (e.g., +254712345678)',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      // Decide whether to send converted amount to backend
      const baseCurrency = subscriptionLink.currency;
      const amountNum =
        typeof subscriptionLink.amount === 'string'
          ? parseFloat(subscriptionLink.amount)
          : Number(subscriptionLink.amount);

      const hasFx =
        convertedAmount !== null &&
        displayCurrency &&
        displayCurrency !== baseCurrency &&
        !Number.isNaN(convertedAmount);

      const result = await processPayment({
        linkType: 'subscription',
        linkCode: linkCode!,
        paymentMethod: 'mobile_money', // recurring handled by provider, we just start the mandate
        merchantCountry,
        customerDetails: {
          name: subscriberName,
          email: subscriberEmail,
          phone: subscriberPhone,
        },
        convertedAmount: hasFx ? convertedAmount || undefined : undefined,
        convertedCurrency: hasFx ? displayCurrency || undefined : undefined,
      });

      if (result.success && result.redirect_url) {
        setPaymentUrl(result.redirect_url);
      } else {
        throw new Error(result.error || 'Subscription payment failed');
      }
    } catch (error: any) {
      console.error('Subscription payment error:', error);
      toast({
        title: 'Payment Failed',
        description:
          error.message || 'Failed to start subscription payment. Please try again.',
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

  const primaryColor = invoiceSettings?.primary_color || '#8B5CF6';
  const secondaryColor = invoiceSettings?.secondary_color || '#7C3AED';
  const businessName = invoiceSettings?.business_name || 'Business';
  const amountCurrency = displayCurrency || subscriptionLink.currency;
  const amountValue =
    convertedAmount ??
    (subscriptionLink ? parseFloat(subscriptionLink.amount) : 0);

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
              <img
                src={invoiceSettings.logo_url}
                alt={businessName}
                className="mx-auto h-14 object-contain mb-4"
              />
            ) : (
              <div className="text-2xl font-bold mb-2">{businessName}</div>
            )}
            <div className="text-white/80 text-sm">
              Subscription #{linkCode?.slice(0, 8).toUpperCase()}
            </div>
            <div className="text-2xl font-bold mt-2">
              {amountCurrency} {amountValue.toFixed(2)}
              {fxLoading ? ' …' : ''}
            </div>
          </div>
        </div>

        {/* Center content: full-height iframe */}
        <div className="flex-1 min-w-0">
          <iframe
            src={paymentUrl}
            title="Secure Subscription Gateway"
            className="w-full h-screen border-0 bg-background"
          />
        </div>

        {/* Right branding panel (hidden on small screens) */}
        <div
          className="hidden lg:flex w-1/5 xl:w-1/4 items-center justify-center text-white"
          style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }}
        >
          <div className="p-6 text-center">
            <div className="text-xs uppercase tracking-wide text-white/80 mb-2">
              Secured by
            </div>
            <div className="text-lg font-semibold">NardoPay</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl overflow-hidden border-border">
        <div 
          className="p-8 text-white"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
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
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">{businessName}</h1>
                </div>
              )}
              {invoiceSettings?.business_address && (
                <p className="text-white/80 text-sm">{invoiceSettings.business_address}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">SUBSCRIPTION</p>
              <p className="text-xl font-bold">#{linkCode?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="border-b border-border pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{subscriptionLink.plan_name}</h2>
              <Badge variant="secondary" className="text-sm">
                {subscriptionLink.billing_cycle}
              </Badge>
            </div>
            {subscriptionLink.description && (
              <p className="text-muted-foreground mb-4">{subscriptionLink.description}</p>
            )}
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subscription Amount</span>
                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {amountCurrency} {amountValue.toFixed(2)}
                  {fxLoading ? ' …' : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span className="font-medium capitalize">{subscriptionLink.billing_cycle}</span>
              </div>
              {subscriptionLink.trial_days > 0 && (
                <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    {subscriptionLink.trial_days} days free trial included
                  </span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubscription} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Subscriber Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
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
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Mobile Number (for Subscription Payments)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={subscriberPhone}
                  onChange={(e) => setSubscriberPhone(e.target.value)}
                  placeholder="+254712345678"
                  required
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +2547…)
                </p>
              </div>
            </div>


            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  By subscribing, you agree to automatic {subscriptionLink.billing_cycle} payments of{' '}
                  {amountCurrency} {amountValue.toFixed(2)}. You can cancel anytime.
                </span>
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full text-white" 
              disabled={processing}
              style={{ 
                background: processing ? undefined : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
              }}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Subscribe Now - ${amountCurrency} ${amountValue.toFixed(2)}/${subscriptionLink.billing_cycle}${fxLoading ? ' …' : ''}`
              )}
            </Button>
          </form>

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
