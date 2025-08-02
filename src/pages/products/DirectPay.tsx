import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Globe,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Flag
} from 'lucide-react';

const DirectPay = () => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    recipient: '',
    sendAmount: '100.00',
    receiveAmount: '0',
    sendCurrency: 'USD',
    receiveCurrency: 'RWF',
    paymentMethod: 'card'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmountSelect = (amount: string) => {
    setFormData(prev => ({ 
      ...prev, 
      sendAmount: amount,
      receiveAmount: calculateReceiveAmount(amount, prev.sendCurrency, prev.receiveCurrency)
    }));
  };

  const calculateReceiveAmount = (sendAmount: string, sendCurrency: string, receiveCurrency: string) => {
    // Mock exchange rates
    const rates: { [key: string]: number } = {
      'USD-RWF': 1300,
      'USD-EUR': 0.85,
      'USD-GBP': 0.73,
      'EUR-RWF': 1530,
      'GBP-RWF': 1780
    };
    
    const rate = rates[`${sendCurrency}-${receiveCurrency}`] || 1;
    return (parseFloat(sendAmount) * rate).toFixed(2);
  };

  const handleDirectPay = async () => {
    if (!formData.recipient) {
      alert('Please enter recipient email or phone number');
      return;
    }
    if (!formData.sendAmount || parseFloat(formData.sendAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setPaymentStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      setPaymentStatus('success');
      // Reset form after success
      setTimeout(() => {
        setPaymentStatus('idle');
        setFormData({
          recipient: '',
          sendAmount: '100.00',
          receiveAmount: '0',
          sendCurrency: 'USD',
          receiveCurrency: 'RWF',
          paymentMethod: 'card'
        });
      }, 3000);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'equity', name: 'EQUITY', icon: '🏠', color: 'bg-red-500' },
    { id: 'mtn', name: 'MoMo from MTN', icon: '📱', color: 'bg-yellow-500' },
    { id: 'airtel', name: 'airtel', icon: '📞', color: 'bg-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-gray-300 hover:text-white"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Direct Pay</h1>
                <p className="text-sm text-gray-400">Pay anyone with any payment method</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Transfer Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
          <div className="space-y-8">
              {/* You Send Section */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium">You send</Label>
                <div className="relative">
                    <Input
                      type="number"
                    value={formData.sendAmount}
                    onChange={(e) => {
                      handleInputChange('sendAmount', e.target.value);
                      handleInputChange('receiveAmount', calculateReceiveAmount(e.target.value, formData.sendCurrency, formData.receiveCurrency));
                    }}
                    className="w-full p-4 bg-background border-border text-foreground text-lg font-semibold pr-20"
                      placeholder="0.00"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-foreground">
                    <span className="text-sm">🇺🇸</span>
                    <span className="font-medium">{formData.sendCurrency}</span>
                  </div>
                </div>
                </div>

              {/* Amount Selection Buttons */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium">Or select an amount</Label>
                <div className="flex gap-3">
                  {['200', '500', '1000'].map((amount) => (
                      <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleAmountSelect(amount)}
                      className={`flex-1 py-3 ${
                        formData.sendAmount === amount 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-muted/50 border-border hover:bg-muted'
                      }`}
                    >
                      ${amount}
                      </Button>
                    ))}
                  </div>
                </div>

              {/* They Receive Section */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium">They receive</Label>
                <div className="relative">
                    <Input
                    type="text"
                    value={formData.receiveAmount === '0' ? 'Loading...' : formData.receiveAmount}
                    readOnly
                    className="w-full p-4 bg-background border-border text-foreground text-lg font-semibold pr-20"
                    placeholder="Loading..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-foreground">
                    <span className="text-sm">🇷🇼</span>
                    <span className="font-medium">{formData.receiveCurrency}</span>
                  </div>
                  </div>
                </div>

              {/* Fee and Total Cost */}
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Fee</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total cost</span>
                  <span>-</span>
                </div>
                </div>

              {/* Get Rate Button */}
                <Button
                variant="default" 
                  className="w-full py-4 text-lg font-semibold"
                onClick={handleDirectPay}
                disabled={paymentStatus === 'processing'}
                >
                  {paymentStatus === 'processing' ? (
                    <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                    </>
                  ) : (
                  'Get this rate'
                  )}
                </Button>

              {/* Payment Method Logos */}
              <div className="flex justify-center gap-6 pt-4 border-t border-border">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${method.color}`}>
                      {method.icon}
                    </div>
                    <span className="text-xs text-muted-foreground text-center">
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
              </CardContent>
            </Card>

        {/* Success/Error Messages */}
        {paymentStatus === 'success' && (
          <Card className="bg-green-success/10 border-green-success/30 mt-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Transfer completed successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStatus === 'error' && (
          <Card className="bg-destructive/10 border-destructive/30 mt-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Transfer failed. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DirectPay; 