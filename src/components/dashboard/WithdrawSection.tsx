import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowUpRight, 
  Smartphone 
} from 'lucide-react';

interface WithdrawSectionProps {
  setActiveTab: (tab: string) => void;
}

export const WithdrawSection = ({ setActiveTab }: WithdrawSectionProps) => {
  const [bankAmount, setBankAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [mobileAmount, setMobileAmount] = useState('');
  const [mobileProvider, setMobileProvider] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');

  const bankAccounts = [
    { value: 'account1', label: 'Bank of Rwanda - ****1234' },
    { value: 'account2', label: 'Equity Bank - ****5678' },
    { value: 'account3', label: 'KCB Bank - ****9012' }
  ];

  const mobileProviders = [
    { value: 'mtn', label: 'MTN Mobile Money' },
    { value: 'airtel', label: 'Airtel Money' },
    { value: 'mpesa', label: 'M-Pesa' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Withdraw</h1>
        <p className="text-muted-foreground">Withdraw funds from your Nardopay account</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Withdraw to Bank */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              Withdraw to Bank
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bank-amount">Amount</Label>
              <Input
                id="bank-amount"
                type="number"
                placeholder="0.00"
                value={bankAmount}
                onChange={(e) => setBankAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bank-account">Bank Account</Label>
              <Select value={bankAccount} onValueChange={setBankAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.value} value={account.value}>
                      {account.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Withdraw to Bank</Button>
          </CardContent>
        </Card>

        {/* Withdraw to Mobile Money */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Withdraw to Mobile Money
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mobile-amount">Amount</Label>
              <Input
                id="mobile-amount"
                type="number"
                placeholder="0.00"
                value={mobileAmount}
                onChange={(e) => setMobileAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mobile-provider">Mobile Provider</Label>
              <Select value={mobileProvider} onValueChange={setMobileProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {mobileProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mobile-phone">Phone Number</Label>
              <Input
                id="mobile-phone"
                placeholder="Enter phone number"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
              />
            </div>
            <Button className="w-full">Withdraw to Mobile Money</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 