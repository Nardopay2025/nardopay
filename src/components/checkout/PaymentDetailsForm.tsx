import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { PaymentMethod } from '@/lib/paymentRouter';

interface PaymentDetailsFormProps {
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  onSubmit: (details: any) => void;
  processing: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

export function PaymentDetailsForm({
  paymentMethod,
  amount,
  currency,
  onSubmit,
  processing,
  primaryColor = '#0EA5E9',
  secondaryColor = '#0284C7',
}: PaymentDetailsFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const details: any = {};
    
    if (paymentMethod === 'mobile_money') {
      details.phoneNumber = phoneNumber;
      details.mobileProvider = mobileProvider;
    } else if (paymentMethod === 'bank_transfer') {
      details.bankName = bankName;
      details.accountNumber = accountNumber;
    }
    
    onSubmit(details);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {paymentMethod === 'mobile_money' && (
        <div className="space-y-4">
          <h3 className="font-semibold">Mobile Money Details</h3>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+254 712 345 678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter your mobile money phone number
            </p>
          </div>

          <div>
            <Label htmlFor="provider">Mobile Money Provider</Label>
            <Select value={mobileProvider} onValueChange={setMobileProvider} required>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="airtel">Airtel Money</SelectItem>
                <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                <SelectItem value="tigopesa">Tigo Pesa</SelectItem>
                <SelectItem value="equitel">Equitel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {paymentMethod === 'bank_transfer' && (
        <div className="space-y-4">
          <h3 className="font-semibold">Bank Transfer Details</h3>
          
          <div>
            <Label htmlFor="bank">Bank Name</Label>
            <Select value={bankName} onValueChange={setBankName} required>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equity">Equity Bank</SelectItem>
                <SelectItem value="kcb">KCB Bank</SelectItem>
                <SelectItem value="cooperative">Co-operative Bank</SelectItem>
                <SelectItem value="standard">Standard Chartered</SelectItem>
                <SelectItem value="absa">Absa Bank</SelectItem>
                <SelectItem value="ncba">NCBA Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="account">Account Number</Label>
            <Input
              id="account"
              type="text"
              placeholder="1234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="bg-background"
            />
          </div>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <h3 className="font-semibold">Card Details</h3>
          <p className="text-sm text-muted-foreground">
            Card payments coming soon via Stripe integration
          </p>
        </div>
      )}

      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="text-2xl font-bold" style={{ color: primaryColor }}>
            {currency} {amount.toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full text-white"
        disabled={processing}
        style={{
          background: processing ? undefined : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ${currency} ${amount.toFixed(2)}`
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Secured by NardoPay • Your payment is encrypted and secure
      </p>
    </form>
  );
}
