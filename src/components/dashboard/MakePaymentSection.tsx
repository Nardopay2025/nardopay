import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Code 
} from 'lucide-react';

interface MakePaymentSectionProps {
  setActiveTab: (tab: string) => void;
}

export const MakePaymentSection = ({ setActiveTab }: MakePaymentSectionProps) => {
  const [virtualCardAmount, setVirtualCardAmount] = useState('');
  const [virtualCardCurrency, setVirtualCardCurrency] = useState('USD');
  const [merchantCode, setMerchantCode] = useState('');
  const [merchantAmount, setMerchantAmount] = useState('');
  const [merchantCurrency, setMerchantCurrency] = useState('USD');
  const [merchantReference, setMerchantReference] = useState('');

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Make Payment</h1>
        <p className="text-muted-foreground">Choose your payment method</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Virtual Card Payment */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Virtual Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Virtual Card</span>
                <span className="text-sm">Nardopay</span>
              </div>
              <div className="text-lg font-mono mb-2">**** **** **** 1234</div>
              <div className="flex justify-between items-center text-sm">
                <span>John Doe</span>
                <span>12/25</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="virtual-amount">Amount</Label>
                <Input
                  id="virtual-amount"
                  type="number"
                  placeholder="0.00"
                  value={virtualCardAmount}
                  onChange={(e) => setVirtualCardAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="virtual-currency">Currency</Label>
                <Select value={virtualCardCurrency} onValueChange={setVirtualCardCurrency}>
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
              <Button className="w-full">Pay with Virtual Card</Button>
            </div>
          </CardContent>
        </Card>

        {/* Merchant Code Payment */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Merchant Code Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="merchant-code">Merchant Code</Label>
              <Input
                id="merchant-code"
                placeholder="Enter merchant code"
                value={merchantCode}
                onChange={(e) => setMerchantCode(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="merchant-amount">Amount</Label>
              <Input
                id="merchant-amount"
                type="number"
                placeholder="0.00"
                value={merchantAmount}
                onChange={(e) => setMerchantAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="merchant-currency">Currency</Label>
              <Select value={merchantCurrency} onValueChange={setMerchantCurrency}>
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
              <Label htmlFor="merchant-reference">Reference</Label>
              <Input
                id="merchant-reference"
                placeholder="Payment reference"
                value={merchantReference}
                onChange={(e) => setMerchantReference(e.target.value)}
              />
            </div>
            <Button className="w-full">Pay Merchant</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 