import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
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
    if (recipientCountry && profile?.currency) {
      fetchExchangeRate();
    } else {
      setExchangeRate(null);
    }
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
  
  const transferFeePercent = 5;
  const amountNum = parseFloat(amount) || 0;
  const feeAmount = amountNum * (transferFeePercent / 100);
  const amountAfterFee = amountNum - feeAmount;
  
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
        <p className="text-muted-foreground mt-1">
          Transfer funds to mobile money accounts
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSendMoney} className="space-y-6">
          {/* Sender Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Sending from</p>
            <p className="text-sm text-muted-foreground">
              {getCountryByCode(profile.country)?.name} ({profile.currency})
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">Amount to Send</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Available balance: {profile.currency} 0.00
            </p>
          </div>

          {/* Recipient Country */}
          <div>
            <Label htmlFor="recipient_country">Recipient Country</Label>
            <Select value={recipientCountry} onValueChange={setRecipientCountry}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.filter(c => c.mobileProviders.length > 0).map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name} ({country.currency})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipient Name */}
          <div>
            <Label htmlFor="recipient_name">Recipient Name</Label>
            <Input
              id="recipient_name"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          {/* Recipient Mobile Number */}
          <div>
            <Label htmlFor="recipient_mobile">Recipient Mobile Number</Label>
            <Input
              id="recipient_mobile"
              type="tel"
              value={recipientMobile}
              onChange={(e) => setRecipientMobile(e.target.value)}
              placeholder="e.g., +254712345678"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Include country code
            </p>
          </div>

          {/* Transfer Summary */}
          {amountNum > 0 && recipientCountry && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You send:</span>
                <span className="font-medium">{profile.currency} {amountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transfer fee ({transferFeePercent}%):</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{profile.currency} {feeAmount.toFixed(2)}
                </span>
              </div>
              {profile.currency !== recipientCurrency && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange rate:</span>
                  {loadingRate ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : exchangeRate ? (
                    <span className="font-medium">
                      1 {profile.currency} = {exchangeRate.toFixed(4)} {recipientCurrency}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Fetching...</span>
                  )}
                </div>
              )}
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                <div className="flex justify-between">
                  <span className="font-semibold">Recipient receives:</span>
                  {loadingRate && profile.currency !== recipientCurrency ? (
                    <Loader2 className="h-5 w-5 animate-spin text-green-600 dark:text-green-400" />
                  ) : (
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      {recipientCurrency} {recipientReceives.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || !amount || amountNum <= 0 || !recipientCountry || !recipientName || !recipientMobile} 
            className="w-full"
          >
            {loading ? 'Processing...' : 'Send Money'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-foreground mb-2">Transfer Information</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Transfers are processed instantly to mobile money accounts</li>
          <li>• A {transferFeePercent}% fee applies to all transfers</li>
          <li>• Make sure the recipient's mobile number is correct</li>
        </ul>
      </Card>
    </div>
  );
};
