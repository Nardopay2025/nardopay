import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/lib/paymentRouter';
import { getCurrencyForCountry } from '@/lib/countries';

export default function DonationLinkPage() {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donationLink, setDonationLink] = useState<any>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [merchantCountry, setMerchantCountry] = useState<string>('KE');
  const [processing, setProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [customerCountry, setCustomerCountry] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string | null>(null);
  const [fxRate, setFxRate] = useState<number | null>(null);
  const [fxLoading, setFxLoading] = useState<boolean>(false);

  useEffect(() => {
    if (linkCode) {
      fetchDonationLink();
    }
  }, [linkCode]);

  const fetchDonationLink = async () => {
    try {
      // Use secure public view to avoid exposing sensitive fields
      const { data, error } = await supabase
        .from('public_donation_links')
        .select('*')
        .eq('link_code', linkCode)
        .limit(1);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      const row = Array.isArray(data) ? data[0] : undefined;
      if (!row) {
        console.warn('No donation link found for code:', linkCode);
        navigate('/404');
        return;
      }

      setDonationLink(row);
      
      // Fetch merchant's branding settings from safe_profiles view (no PII exposure)
      const { data: profileData, error: profileError } = await supabase
        .from('safe_profiles')
        .select('business_name, logo_url, primary_color, secondary_color, country')
        .eq('id', row.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      if (profileData && profileData.business_name) {
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: profileData.logo_url || '',
          primary_color: profileData.primary_color || '#EF4444',
          secondary_color: profileData.secondary_color || '#DC2626',
        });
        setMerchantCountry(profileData.country || 'KE');
      } else {
        // Default to NardoPay branding
        setInvoiceSettings({
          business_name: 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: '',
          primary_color: '#EF4444',
          secondary_color: '#DC2626',
        });
        setMerchantCountry('KE');
      }

      // Detect customer country via IP and set display currency / FX rate
      try {
        setFxLoading(true);
        const ipRes = await fetch('https://ipapi.co/json');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          const ipCountry = ipData?.country || null; // ISO2
          setCustomerCountry(ipCountry);

          // Special rule: RWF donation links opened in Zimbabwe should convert to USD
          if (ipCountry === 'ZW' && row?.currency === 'RWF') {
            const { data: fxData, error: fxError } = await supabase.functions.invoke('get-exchange-rate', {
              body: { fromCurrency: 'RWF', toCurrency: 'USD' },
            });
            if (!fxError && fxData?.rate) {
              const rate = Number(fxData.rate);
              if (!Number.isNaN(rate) && rate > 0) {
                setDisplayCurrency('USD');
                setFxRate(rate);
              } else {
                setDisplayCurrency(row.currency);
                setFxRate(null);
              }
            } else {
              setDisplayCurrency(row.currency);
              setFxRate(null);
            }
          } else {
            // General rule: convert to customer's local currency where supported
            const localCurrency = getCurrencyForCountry(ipCountry || '');
            if (localCurrency && row?.currency && localCurrency !== row.currency) {
              const { data: fxData, error: fxError } = await supabase.functions.invoke('get-exchange-rate', {
                body: { fromCurrency: row.currency, toCurrency: localCurrency },
              });
              if (!fxError && fxData?.rate) {
                const rate = Number(fxData.rate);
                if (!Number.isNaN(rate) && rate > 0) {
                  setDisplayCurrency(localCurrency);
                  setFxRate(rate);
                } else {
                  setDisplayCurrency(row.currency);
                  setFxRate(null);
                }
              } else {
                setDisplayCurrency(row.currency);
                setFxRate(null);
              }
            } else {
              setDisplayCurrency(row.currency);
              setFxRate(null);
            }
          }
        } else {
          setDisplayCurrency(row.currency);
          setFxRate(null);
        }
      } catch (fxError) {
        console.error('Error determining FX for donation link:', fxError);
        setDisplayCurrency(row.currency);
        setFxRate(null);
      } finally {
        setFxLoading(false);
      }
    } catch (error: any) {
      console.error('Error fetching donation link:', error);
      toast({ title: 'Error', description: 'Donation link not found or inactive', variant: 'destructive' });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!donationAmount || isNaN(parseFloat(donationAmount)) || parseFloat(donationAmount) <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid donation amount', variant: 'destructive' });
      return;
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!donorPhone || !phoneRegex.test(donorPhone)) {
      toast({ title: 'Invalid Phone Number', description: 'Enter a valid mobile number with country code (e.g., +2507...)', variant: 'destructive' });
      return;
    }

    setProcessing(true);

    try {
      const amountNum = parseFloat(donationAmount);

      // Decide if we should send converted amount to backend
      const isRwfToUsdInZw =
        customerCountry === 'ZW' &&
        donationLink?.currency === 'RWF' &&
        fxRate &&
        displayCurrency === 'USD';

      const shouldSendConverted =
        fxRate &&
        displayCurrency &&
        displayCurrency !== donationLink?.currency &&
        amountNum > 0;

      const convertedAmountToSend =
        shouldSendConverted && fxRate ? amountNum * fxRate : undefined;

      const result = await processPayment({
        linkType: 'donation',
        linkCode: linkCode!,
        paymentMethod: 'mobile_money',
        merchantCountry,
        customerDetails: {
          name: donorName,
          email: donorEmail,
          phone: donorPhone,
        },
        donationAmount,
        convertedAmount: convertedAmountToSend,
        convertedCurrency: shouldSendConverted ? displayCurrency : undefined,
      });

      if (result.success && result.redirect_url) {
        setPaymentUrl(result.redirect_url);
      } else {
        throw new Error(result.error || 'Payment failed: No redirect URL returned by provider');
      }
    } catch (error: any) {
      console.error('Donation payment error:', error);
      toast({ title: 'Payment Failed', description: error.message || 'Failed to start donation payment', variant: 'destructive' });
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

  const progress = (parseFloat(donationLink.current_amount || 0) / parseFloat(donationLink.goal_amount)) * 100;
  const primaryColor = invoiceSettings?.primary_color || '#EF4444';
  const secondaryColor = invoiceSettings?.secondary_color || '#DC2626';
  const businessName = invoiceSettings?.business_name || 'Organization';

  const baseCurrency = donationLink.currency;
  const amountNum = donationAmount ? parseFloat(donationAmount) : 0;
  const effectiveCurrency = displayCurrency || baseCurrency;
  const effectiveAmount = fxRate && amountNum > 0 ? amountNum * fxRate : amountNum;

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
            <div className="text-white/80 text-sm">Donation #{linkCode?.slice(0, 8).toUpperCase()}</div>
            <div className="text-2xl font-bold mt-2">
              {effectiveCurrency} {effectiveAmount.toFixed(2)}
              {fxLoading ? ' …' : ''}
            </div>
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-5xl overflow-hidden border-border">
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
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">{businessName}</h1>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">DONATION</p>
              <p className="text-xl font-bold">#{linkCode?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left: Campaign image */}
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden bg-muted/40 border border-border min-h-[260px] flex items-center justify-center">
                {donationLink?.image_url ? (
                  <img
                    src={donationLink.image_url}
                    alt={donationLink.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
                    <span className="text-muted-foreground">Campaign image</span>
                  </div>
                )}
              </div>

              {/* Goal details under picture */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">{donationLink.title}</h2>
                {donationLink.description && (
                  <p className="text-muted-foreground">{donationLink.description}</p>
                )}
                <div className="text-sm">
                  <span className="text-muted-foreground">Raised</span>{' '}
                  <span className="font-semibold">
                    {donationLink.currency} {parseFloat(donationLink.current_amount || 0).toFixed(2)}
                  </span>{' '}
                  <span className="text-muted-foreground">of</span>{' '}
                  <span className="font-semibold">
                    {donationLink.currency} {parseFloat(donationLink.goal_amount).toFixed(2)}
                  </span>{' '}
                  <span className="text-muted-foreground">({Math.min(100, Math.max(0, Math.round(progress)))}%)</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Right: Details and form */}
            <div className="space-y-6">
              {/* Donation Form */}
              <form onSubmit={handleDonation} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Donation Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      className="bg-background text-lg font-semibold"
                    />
                    {amountNum > 0 && effectiveCurrency !== baseCurrency && (
                      <p className="text-xs text-muted-foreground mt-1">
                        You will be charged approximately {effectiveCurrency} {effectiveAmount.toFixed(2)} (base currency {baseCurrency} {amountNum.toFixed(2)})
                        {fxLoading ? ' …' : ''}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
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
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Mobile Number (for Mobile Money)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+2507XXXXXXXX"
                      required
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +2507…)</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-white border-0 hover:opacity-90 transition-opacity disabled:opacity-50" 
                  disabled={processing}
                  style={{ 
                    background: processing
                      ? `${primaryColor}80` 
                      : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
                  }}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Donate ${effectiveCurrency} ${amountNum > 0 ? effectiveAmount.toFixed(2) : ''}${fxLoading ? ' …' : ''}`
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Footer */}
          {invoiceSettings?.invoice_footer && (
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border mt-8">
              {invoiceSettings.invoice_footer}
            </div>
          )}
          <div className="text-center mt-2">
            <p className="text-xs text-muted-foreground">
              Secured by NardoPay • Your donation is encrypted and secure
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
