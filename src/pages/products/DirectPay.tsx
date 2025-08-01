import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Globe,
  User,
  Mail,
  Phone,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const DirectPay = () => {
  const [activeTab, setActiveTab] = useState<'pay' | 'deposit'>('pay');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [payFormData, setPayFormData] = useState({
    recipientEmail: '',
    recipientPhone: '',
    amount: '',
    currency: 'USD',
    message: '',
    paymentMethod: 'card'
  });
  const [depositFormData, setDepositFormData] = useState({
    recipientEmail: '',
    recipientPhone: '',
    amount: '',
    currency: 'USD',
    message: '',
    paymentMethod: 'card'
  });

  const handlePayInputChange = (field: string, value: string) => {
    setPayFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDepositInputChange = (field: string, value: string) => {
    setDepositFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDirectPay = async () => {
    if (!payFormData.recipientEmail && !payFormData.recipientPhone) {
      alert('Please enter recipient email or phone number');
      return;
    }
    if (!payFormData.amount || parseFloat(payFormData.amount) <= 0) {
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
        setPayFormData({
          recipientEmail: '',
          recipientPhone: '',
          amount: '',
          currency: 'USD',
          message: '',
          paymentMethod: 'card'
        });
      }, 3000);
    }, 2000);
  };

  const handleDeposit = async () => {
    if (!depositFormData.recipientEmail && !depositFormData.recipientPhone) {
      alert('Please enter recipient email or phone number');
      return;
    }
    if (!depositFormData.amount || parseFloat(depositFormData.amount) <= 0) {
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
        setDepositFormData({
          recipientEmail: '',
          recipientPhone: '',
          amount: '',
          currency: 'USD',
          message: '',
          paymentMethod: 'card'
        });
      }, 3000);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'mobile', name: 'Mobile Money', icon: Smartphone },
    { id: 'bank', name: 'Bank Transfer', icon: Globe },
    { id: 'ecocash', name: 'EcoCash', icon: Smartphone },
    { id: 'innbucks', name: 'InnBucks', icon: Smartphone },
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone },
    { id: 'airtel', name: 'Airtel Money', icon: Smartphone },
    { id: 'tigo', name: 'Tigo Pesa', icon: Smartphone }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Direct Pay</h1>
                <p className="text-sm text-gray-500">Pay anyone with any payment method</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 mb-8">
          <Button
            variant={activeTab === 'pay' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pay')}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            Direct Pay
          </Button>
          <Button
            variant={activeTab === 'deposit' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('deposit')}
            className="flex-1"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Deposit
          </Button>
        </div>

        {/* Direct Pay Tab */}
        {activeTab === 'pay' && (
          <div className="space-y-8">
            {/* Info Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Pay Anyone, Anywhere</h3>
                    <p className="text-blue-100 mb-4">
                      Send money to individuals using their preferred payment method. 
                      Whether they use EcoCash, InnBucks, M-Pesa, or any other payment service, 
                      you can pay them directly from your Nardopay wallet.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white">EcoCash</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">InnBucks</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">M-Pesa</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">Airtel Money</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">Tigo Pesa</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">Bank Transfer</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Recipient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipientEmail" className="text-gray-700 font-medium">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="recipient@example.com"
                      value={payFormData.recipientEmail}
                      onChange={(e) => handlePayInputChange('recipientEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientPhone" className="text-gray-700 font-medium">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="recipientPhone"
                      type="tel"
                      placeholder="+1234567890"
                      value={payFormData.recipientPhone}
                      onChange={(e) => handlePayInputChange('recipientPhone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount" className="text-gray-700 font-medium">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={payFormData.amount}
                      onChange={(e) => handlePayInputChange('amount', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-gray-700 font-medium">Currency</Label>
                    <select
                      id="currency"
                      value={payFormData.currency}
                      onChange={(e) => handlePayInputChange('currency', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="ZAR">ZAR</option>
                      <option value="NGN">NGN</option>
                      <option value="KES">KES</option>
                      <option value="UGX">UGX</option>
                      <option value="TZS">TZS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message..."
                    value={payFormData.message}
                    onChange={(e) => handlePayInputChange('message', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">Recipient's Preferred Payment Method</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant={payFormData.paymentMethod === method.id ? "default" : "outline"}
                        onClick={() => handlePayInputChange('paymentMethod', method.id)}
                        className="h-12 flex flex-col items-center justify-center gap-1"
                      >
                        <method.icon className="w-4 h-4" />
                        <span className="text-xs">{method.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleDirectPay}
                  disabled={paymentStatus === 'processing' || (!payFormData.recipientEmail && !payFormData.recipientPhone) || !payFormData.amount}
                  className="w-full py-4 text-lg font-semibold"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div className="space-y-8">
            {/* Info Card */}
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Deposit to Nardopay Account</h3>
                    <p className="text-green-100 mb-4">
                      Deposit money to any Nardopay account holder. No account required for you - 
                      just send money to someone who has a Nardopay account using any payment method.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white">No Account Needed</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">Instant Transfer</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">Any Payment Method</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deposit Form */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Deposit Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="depositEmail" className="text-gray-700 font-medium">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Recipient Email
                    </Label>
                    <Input
                      id="depositEmail"
                      type="email"
                      placeholder="nardopay-user@example.com"
                      value={depositFormData.recipientEmail}
                      onChange={(e) => handleDepositInputChange('recipientEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="depositPhone" className="text-gray-700 font-medium">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Recipient Phone
                    </Label>
                    <Input
                      id="depositPhone"
                      type="tel"
                      placeholder="+1234567890"
                      value={depositFormData.recipientPhone}
                      onChange={(e) => handleDepositInputChange('recipientPhone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="depositAmount" className="text-gray-700 font-medium">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Amount
                    </Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      placeholder="0.00"
                      value={depositFormData.amount}
                      onChange={(e) => handleDepositInputChange('amount', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="depositCurrency" className="text-gray-700 font-medium">Currency</Label>
                    <select
                      id="depositCurrency"
                      value={depositFormData.currency}
                      onChange={(e) => handleDepositInputChange('currency', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="ZAR">ZAR</option>
                      <option value="NGN">NGN</option>
                      <option value="KES">KES</option>
                      <option value="UGX">UGX</option>
                      <option value="TZS">TZS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="depositMessage" className="text-gray-700 font-medium">Message (Optional)</Label>
                  <Textarea
                    id="depositMessage"
                    placeholder="Add a personal message..."
                    value={depositFormData.message}
                    onChange={(e) => handleDepositInputChange('message', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">Your Payment Method</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant={depositFormData.paymentMethod === method.id ? "default" : "outline"}
                        onClick={() => handleDepositInputChange('paymentMethod', method.id)}
                        className="h-12 flex flex-col items-center justify-center gap-1"
                      >
                        <method.icon className="w-4 h-4" />
                        <span className="text-xs">{method.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleDeposit}
                  disabled={paymentStatus === 'processing' || (!depositFormData.recipientEmail && !depositFormData.recipientPhone) || !depositFormData.amount}
                  className="w-full py-4 text-lg font-semibold"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Deposit...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Make Deposit
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success/Error Messages */}
        {paymentStatus === 'success' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    {activeTab === 'pay' ? 'Payment Sent Successfully!' : 'Deposit Completed!'}
                  </h3>
                  <p className="text-green-700">
                    {activeTab === 'pay' 
                      ? 'The recipient will receive the payment through their preferred method.'
                      : 'The money has been deposited to the Nardopay account.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStatus === 'error' && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Transaction Failed</h3>
                  <p className="text-red-700">Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DirectPay; 