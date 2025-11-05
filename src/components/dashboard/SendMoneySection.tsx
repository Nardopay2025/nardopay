import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { COUNTRIES, getCountryByCode } from '@/lib/countries';

export const SendMoneySection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientMobile, setRecipientMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const quickAmounts = [200, 500, 1000];
  const [showNardoEmail, setShowNardoEmail] = useState(false);
  const rateCacheRef = useRef<Record<string, number>>({});
  const debounceTimerRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('country, currency')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (!recipientCountry || !profile?.currency) {
      setExchangeRate(null);
      return;
    }
    // Debounce exchange rate fetch to avoid rapid calls while user is selecting
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchExchangeRate();
    }, 300);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [recipientCountry, profile?.currency]);

  const fetchExchangeRate = async () => {
    if (!profile?.currency || !recipientCountry) return;

    const recipientCountryObj = getCountryByCode(recipientCountry);
    const recipientCurrency = recipientCountryObj?.currency;

    if (!recipientCurrency) return;

    // If same currency, rate is 1
    if (profile.currency === recipientCurrency) {
      setExchangeRate(1);
      return;
    }

    // Use in-memory cache for the currency pair
    const cacheKey = `${profile.currency}-${recipientCurrency}`;
    if (rateCacheRef.current[cacheKey]) {
      setExchangeRate(rateCacheRef.current[cacheKey]);
      return;
    }

    setLoadingRate(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-exchange-rate', {
        body: {
          fromCurrency: profile.currency,
          toCurrency: recipientCurrency,
        },
      });

      if (error) throw error;

      if (data?.rate) {
        rateCacheRef.current[cacheKey] = data.rate;
        setExchangeRate(data.rate);
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      toast({
        title: 'Exchange Rate Error',
        description: 'Could not fetch current exchange rate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingRate(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Send Money</h2>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile?.country) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Send Money</h2>
          <p className="text-muted-foreground mt-1">
            Send money to mobile numbers
          </p>
        </div>

        <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Account Not Set Up</h3>
              <p className="text-sm text-muted-foreground">
                Please go to Settings to configure your country before sending money.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const recipientCountryObj = getCountryByCode(recipientCountry);
  const recipientCurrency = recipientCountryObj?.currency || 'USD';
  
  // Pricing model (simple, Remitly-like presentation)
  const transferFeePercent = 0; // percent fee hidden; we'll show a flat fee and discount below
  const flatFee = 1.99; // in sender currency
  const promoDiscount = 1.99; // equal to fee for "Special rate" promo
  const amountNum = parseFloat(amount) || 0;
  const percentFeeAmount = amountNum * (transferFeePercent / 100);
  const amountAfterFee = amountNum - percentFeeAmount;
  
  // Calculate recipient amount with exchange rate
  const recipientReceives = exchangeRate 
    ? amountAfterFee * exchangeRate 
    : amountAfterFee;

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!amount || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }
      if (!recipientCountry) {
        throw new Error('Please select recipient country');
      }
      if (!recipientName.trim()) {
        throw new Error('Please enter recipient name');
      }
      if (!recipientMobile.trim()) {
        throw new Error('Please enter recipient mobile number');
      }

      // TODO: Implement actual send money logic with backend
      toast({
        title: 'Transfer Initiated',
        description: `Sending ${recipientCurrency} ${recipientReceives.toFixed(2)} to ${recipientName}`,
      });

      // Reset form
      setAmount('');
      setRecipientCountry('');
      setRecipientName('');
      setRecipientMobile('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Send Money</h2>
        <p className="text-muted-foreground mt-1">Fast transfers to mobile money</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: Send directly to Nardo, borderless and centered; email shown after button press */}
        <div className="lg:order-1 flex items-center justify-center">
          <div className="w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Send directly to Nardo</h3>
            <p className="text-sm text-muted-foreground mb-4">Send funds to a Nardopay account.</p>
            {!showNardoEmail ? (
              <Button className="mx-auto" onClick={() => setShowNardoEmail(true)}>Send to email</Button>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col items-center">
                  <Label htmlFor="nardo_email" className="mb-1">Recipient email</Label>
                  <Input id="nardo_email" type="email" placeholder="name@example.com" className="h-9 text-sm w-64 text-center" />
                </div>
                <Button className="h-9 text-sm px-4 mx-auto block w-fit">Continue</Button>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Main transfer form, aligned right and compact to avoid scroll */}
        <Card className="p-4 lg:p-5 lg:order-2 lg:ml-auto lg:max-w-xl w-full">
          <form onSubmit={handleSendMoney} className="space-y-4">
          {/* Top inputs like Remitly: You send / They receive */}
          <div className="grid gap-4">
            {/* You send */}
            <div className="space-y-2">
              <Label>You send</Label>
              <div className="flex items-stretch gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100.00"
                    className="h-10 text-base"
                  />
                </div>
                <div className="w-40">
                  <Button type="button" variant="outline" className="w-full h-10 justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{getCountryByCode(profile.country)?.flag}</span>
                      <span className="font-medium">{profile.currency}</span>
                    </span>
                  </Button>
                </div>
              </div>
              {/* Quick amounts */}
              <div className="flex flex-wrap gap-2 pt-2">
                {quickAmounts.map((qa) => (
                  <Button key={qa} type="button" variant="secondary" onClick={() => setAmount(String(qa))} className="rounded-full shadow-sm h-8 text-xs px-3">
                    {profile.currency} {qa.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* They receive */}
            <div className="space-y-2">
              <Label>They receive</Label>
              <div className="flex items-stretch gap-3">
                <div className="flex-1">
                  <Input
                    readOnly
                    value={recipientReceives > 0 ? recipientReceives.toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                    placeholder={loadingRate ? 'Fetching rate…' : '0.00'}
                    className="h-10 text-base bg-muted/40"
                  />
                </div>
                <div className="w-52">
                  <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.filter(c => c.mobileProviders.length > 0).map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-medium">{country.currency}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Special rate + summary */}
          <div className="space-y-3">
            {profile.currency !== recipientCurrency && recipientCountry && (
              <div className="text-xs">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">Special rate</span>
                <span className="ml-2">1 {profile.currency} = {loadingRate ? '…' : exchangeRate ? exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'} {recipientCurrency}</span>
              </div>
            )}
          </div>

          {/* Recipient details (compact) */}
          <div className="grid gap-2">
            <div>
              <Label htmlFor="recipient_name">Recipient name</Label>
              <Input id="recipient_name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Full name" className="h-10 text-sm" />
            </div>
            <div>
              <Label htmlFor="recipient_mobile">Recipient mobile number</Label>
              <Input id="recipient_mobile" type="tel" value={recipientMobile} onChange={(e) => setRecipientMobile(e.target.value)} placeholder="e.g., +2507…" className="h-10 text-sm" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !amount || amountNum <= 0 || !recipientCountry || !recipientName || !recipientMobile}
            className="w-full h-10 text-sm rounded-full"
          >
            {loading ? 'Processing…' : 'Send'}
          </Button>
        </form>
        </Card>
      </div>
    </div>
  );
};
