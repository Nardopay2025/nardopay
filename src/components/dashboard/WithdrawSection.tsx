import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Building, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCountryByCode } from '@/lib/countries';

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
        .select('id, country, currency, withdrawal_account_type, balance')
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
  const withdrawalFeePercent = 5;
  const amountNum = parseFloat(amount) || 0;
  const feeAmount = amountNum * (withdrawalFeePercent / 100);
  const youReceive = amountNum - feeAmount;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!amount || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // TODO: Implement actual withdrawal logic with backend
      toast({
        title: 'Withdrawal Initiated',
        description: `Processing withdrawal of ${profile.currency} ${amountNum.toFixed(2)}`,
      });

      setAmount('');
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

  // Display withdrawal method type only, not sensitive account details
  const withdrawalMethod = profile.withdrawal_account_type === 'mobile' 
    ? 'Mobile Money Account'
    : 'Bank Account';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Withdraw Funds</h2>
        <p className="text-muted-foreground mt-1">
          Transfer money to your {profile.withdrawal_account_type === 'mobile' ? 'mobile money' : 'bank'} account
        </p>
      </div>

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

      <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-foreground mb-2">Processing Time</h3>
        <p className="text-sm text-muted-foreground">
          {profile.withdrawal_account_type === 'mobile' 
            ? 'Mobile money withdrawals are processed instantly.'
            : 'Bank transfers may take 1-2 business days.'}
        </p>
      </Card>
    </div>
  );
};