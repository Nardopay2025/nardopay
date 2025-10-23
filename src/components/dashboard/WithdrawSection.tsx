import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Building, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCountryByCode } from '@/lib/countries';
import { 
  selectWithdrawalProvider, 
  getWithdrawalEdgeFunction, 
  getProviderDisplayName,
  getProcessingTime,
  type WithdrawalAccountType
} from '@/lib/withdrawalRouter';

export const WithdrawSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Only fetch non-sensitive fields needed for withdrawal UI
      const { data, error } = await supabase
        .from('profiles')
        .select('id, country, currency, withdrawal_account_type, balance, plan')
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

  if (loadingProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Withdraw Funds</h2>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile?.country || !profile?.withdrawal_account_type) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Withdraw Funds</h2>
          <p className="text-muted-foreground mt-1">
            Transfer money from your account
          </p>
        </div>

        <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Withdrawal Account Not Set Up</h3>
              <p className="text-sm text-muted-foreground">
                Please go to Settings to configure your country and withdrawal account before making withdrawals.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const country = getCountryByCode(profile.country);
  const withdrawalFeePercent = profile?.plan === 'business' ? 1 : profile?.plan === 'professional' ? 2 : 5;
  const amountNum = parseFloat(amount) || 0;
  const feeAmount = amountNum * (withdrawalFeePercent / 100);
  const totalRequired = amountNum + feeAmount;
  const youReceive = amountNum;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!amount || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Check sufficient balance including fee
      const totalRequired = amountNum + feeAmount;

      if (Number(profile.balance) < totalRequired) {
        throw new Error(`Insufficient balance. You need ${profile.currency} ${totalRequired.toFixed(2)} (including ${withdrawalFeePercent}% fee) but have ${profile.currency} ${Number(profile.balance).toFixed(2)}`);
      }

      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to withdraw funds');
      }

      // Determine which provider to use based on country and account type
      const provider = selectWithdrawalProvider({
        country: profile.country,
        accountType: profile.withdrawal_account_type,
        mobileProvider: profile.mobile_provider,
      });

      const edgeFunction = getWithdrawalEdgeFunction(provider);
      const providerName = getProviderDisplayName(provider);

      console.log(`Processing withdrawal via ${providerName} (${edgeFunction})`);

      // Call withdrawal edge function with auth header
      const { data, error } = await supabase.functions.invoke(edgeFunction, {
        body: { amount: amountNum },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Withdrawal Initiated',
        description: data.message || `Processing withdrawal of ${profile.currency} ${amountNum.toFixed(2)} via ${providerName}. You will receive ${profile.currency} ${youReceive.toFixed(2)}.`,
      });

      setAmount('');
      // Refresh profile to update balance
      await fetchProfile();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Failed to process withdrawal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Display withdrawal method type only, not sensitive account details
  const withdrawalMethod = profile.withdrawal_account_type === 'mobile' 
    ? 'Mobile Money Account'
    : 'Bank Account';

  // Check if we're using MTN MoMo in sandbox mode (for EUR warning)
  const provider = profile ? selectWithdrawalProvider({
    country: profile.country || '',
    accountType: profile.withdrawal_account_type as WithdrawalAccountType,
  }) : null;
  const isMTNMoMo = provider === 'mtn_momo';
  const showSandboxWarning = isMTNMoMo && profile?.currency !== 'EUR';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Withdraw Funds</h2>
        <p className="text-muted-foreground mt-1">
          Transfer money to your {profile.withdrawal_account_type === 'mobile' ? 'mobile money' : 'bank'} account
        </p>
      </div>

      {/* Sandbox Mode Warning */}
      {showSandboxWarning && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm">
            <strong>Sandbox Mode:</strong> MTN MoMo sandbox only accepts EUR currency. 
            In production, withdrawals will use your account currency ({profile.currency}).
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleWithdraw} className="space-y-6">
          {/* Withdrawal Account Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              {profile.withdrawal_account_type === 'mobile' ? (
                <Smartphone className="h-4 w-4" />
              ) : (
                <Building className="h-4 w-4" />
              )}
              <span>Withdrawal Destination</span>
            </div>
            <p className="text-sm text-muted-foreground">{withdrawalMethod}</p>
            <p className="text-xs text-muted-foreground">
              Account details are securely stored. To change, go to Settings.
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">Withdrawal Amount</Label>
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
              Available balance: {profile.currency} {Number(profile.balance || 0).toFixed(2)}
            </p>
          </div>

          {/* Fee Breakdown */}
          {amountNum > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Withdrawal amount:</span>
                <span className="font-medium">{profile.currency} {amountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing fee ({withdrawalFeePercent}%):</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{profile.currency} {feeAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total deducted:</span>
                <span className="font-medium">{profile.currency} {totalRequired.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                <div className="flex justify-between">
                  <span className="font-semibold">You will receive:</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    {profile.currency} {youReceive.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading || !amount || amountNum <= 0} className="w-full">
            {loading ? 'Processing...' : 'Confirm Withdrawal'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-foreground mb-2">Processing Time & Provider</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Provider:</span>{' '}
            {getProviderDisplayName(
              selectWithdrawalProvider({
                country: profile.country,
                accountType: profile.withdrawal_account_type,
                mobileProvider: profile.mobile_provider,
              })
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Processing Time:</span>{' '}
            {getProcessingTime(
              selectWithdrawalProvider({
                country: profile.country,
                accountType: profile.withdrawal_account_type,
                mobileProvider: profile.mobile_provider,
              }),
              profile.withdrawal_account_type
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};