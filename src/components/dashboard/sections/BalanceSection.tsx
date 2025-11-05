import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BalanceSectionProps {
  onWithdraw: () => void;
}

export const BalanceSection = ({ onWithdraw }: BalanceSectionProps) => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('np_currency') || 'KES';
    } catch {
      return 'KES';
    }
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchBalanceAndCurrency();
    }
  }, [user]);

  const fetchBalanceAndCurrency = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('currency, balance')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data?.currency) {
        setCurrency(data.currency);
        try {
          localStorage.setItem('np_currency', data.currency);
        } catch {}
      }
      if (data?.balance !== null) {
        setBalance(Number(data.balance));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-blue-100 text-sm mb-1">Available Balance</p>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold">
              {showBalance ? `${currency} ${balance.toFixed(2)}` : '••••••'}
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-green-300">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">+0%</span>
          </div>
          <p className="text-xs text-blue-100 mt-1">vs last month</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={onWithdraw}
          className="w-full bg-white text-blue-600 hover:bg-blue-50"
        >
          Withdraw
        </Button>
      </div>
    </Card>
  );
};