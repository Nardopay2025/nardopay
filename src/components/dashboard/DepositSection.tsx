import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PiggyBank, 
  Link2 
} from 'lucide-react';

interface DepositSectionProps {
  setActiveTab: (tab: string) => void;
}

export const DepositSection = ({ setActiveTab }: DepositSectionProps) => {
  const [directAmount, setDirectAmount] = useState('');
  const [directCurrency, setDirectCurrency] = useState('USD');
  const [directPaymentMethod, setDirectPaymentMethod] = useState('mobile');

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'ZAR', name: 'South African Rand' }
  ];

  const paymentMethods = [
    { value: 'mobile', label: 'Mobile Money' },
    { value: 'card', label: 'Credit/Debit Card' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deposit</h1>
        <p className="text-muted-foreground">Add funds to your Nardopay account</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Deposit Directly */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5" />
              Deposit Directly
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="direct-amount">Amount</Label>
              <Input
                id="direct-amount"
                type="number"
                placeholder="0.00"
                value={directAmount}
                onChange={(e) => setDirectAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="direct-currency">Currency</Label>
              <Select value={directCurrency} onValueChange={setDirectCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="direct-payment-method">Payment Method</Label>
              <Select value={directPaymentMethod} onValueChange={setDirectPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Deposit Funds</Button>
          </CardContent>
        </Card>

        {/* Create Deposit Link */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Create Deposit Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a shareable link that allows others to deposit funds directly into your account.
            </p>
            <Button className="w-full" onClick={() => setActiveTab('create-link')}>
              Create Deposit Link
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 