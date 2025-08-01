import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDonationLinks } from '@/contexts/DonationLinksContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
  Heart,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

const DonationPage = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { getDonationLink, updateDonationProgress } = useDonationLinks();
  const { invoiceSettings } = useInvoiceSettings();
  
  const [donationData, setDonationData] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    bankName: '',
    accountNumber: ''
  });

  const presetAmounts = ['10', '25', '50', '100', '250', '500'];

  useEffect(() => {
    if (linkId) {
      const link = getDonationLink(linkId);
      if (link) {
        setDonationData(link);
      } else {
        // Generate mock data for demo purposes
        setDonationData({
          id: linkId,
          title: 'Help Build a School',
          description: 'We are raising funds to build a new school in rural Kenya. Your donation will help provide education to 200 children who currently walk 5km to the nearest school.',
          goalAmount: '$10,000',
          currency: 'USD',
          thankYouMessage: 'Thank you for your generous donation! Your support will make a real difference in these children\'s lives.',
          redirectUrl: 'https://example.com/thank-you',
          donations: 47,
          totalAmount: '$7,350',
          goalProgress: 73.5
        });
      }
    }
  }, [linkId, getDonationLink]);

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount('');
  };

  const getAmountToCharge = () => {
    return customAmount || selectedAmount;
  };

  const handlePayment = async () => {
    const amount = getAmountToCharge();
    if (!amount || parseFloat(amount) <= 0) return;

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Update donation progress
      if (donationData) {
        updateDonationProgress(donationData.id, parseFloat(amount));
      }
      
      // Redirect after 3 seconds
      setTimeout(() => {
        if (donationData?.redirectUrl) {
          const redirectUrl = donationData.redirectUrl.startsWith('http') 
            ? donationData.redirectUrl 
            : `https://${donationData.redirectUrl}`;
          window.location.href = redirectUrl;
        }
      }, 3000);
    }, 2000);
  };

  if (!donationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading donation page...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Successful!</h2>
            <p className="text-gray-600 mb-6">{donationData.thankYouMessage}</p>
            <p className="text-sm text-gray-500">Redirecting you shortly...</p>
            <Button 
              onClick={() => window.location.href = donationData.redirectUrl || '/'}
              className="mt-4"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {invoiceSettings.logo ? (
              <img src={invoiceSettings.logo} alt="Logo" className="w-8 h-8 rounded" />
            ) : (
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: invoiceSettings.primaryColor || '#3b82f6' }}
              >
                {invoiceSettings.businessName?.charAt(0) || 'N'}
              </div>
            )}
            <span 
              className="font-semibold text-lg"
              style={{ color: invoiceSettings.primaryColor || '#3b82f6' }}
            >
              {invoiceSettings.businessName || 'Nardopay'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{donationData.title}</h1>
          <p className="text-gray-600 mb-6">{donationData.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Make a Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Selection */}
              <div className="space-y-4">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amount)}
                      className="h-12"
                      style={{
                        backgroundColor: selectedAmount === amount ? (invoiceSettings.primaryColor || '#3b82f6') : undefined,
                        borderColor: selectedAmount === amount ? (invoiceSettings.primaryColor || '#3b82f6') : undefined
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customAmount">Or enter custom amount</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paymentMethod === 'card' ? "default" : "outline"}
                    onClick={() => setPaymentMethod('card')}
                    className="h-12"
                    style={{
                      backgroundColor: paymentMethod === 'card' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined,
                      borderColor: paymentMethod === 'card' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === 'mobile' ? "default" : "outline"}
                    onClick={() => setPaymentMethod('mobile')}
                    className="h-12"
                    style={{
                      backgroundColor: paymentMethod === 'mobile' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined,
                      borderColor: paymentMethod === 'mobile' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined
                    }}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                  <Button
                    variant={paymentMethod === 'bank' ? "default" : "outline"}
                    onClick={() => setPaymentMethod('bank')}
                    className="h-12"
                    style={{
                      backgroundColor: paymentMethod === 'bank' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined,
                      borderColor: paymentMethod === 'bank' ? (invoiceSettings.primaryColor || '#3b82f6') : undefined
                    }}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Bank
                  </Button>
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="Enter bank name"
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter account number"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={!getAmountToCharge() || paymentStatus === 'processing'}
                className="w-full h-12 text-lg"
                style={{
                  backgroundColor: invoiceSettings.primaryColor || '#3b82f6',
                  borderColor: invoiceSettings.primaryColor || '#3b82f6'
                }}
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Donate $${getAmountToCharge() || '0'}`
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Raised</span>
                  <span className="font-semibold">{donationData.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Goal</span>
                  <span className="font-semibold">{donationData.goalAmount}</span>
                </div>
                <Progress value={donationData.goalProgress} className="h-3" />
                <p className="text-sm text-gray-600">
                  {donationData.goalProgress.toFixed(1)}% of goal reached
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Donations</span>
                  <span className="font-semibold">{donationData.donations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Days Left</span>
                  <span className="font-semibold">15</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Secure payment powered by Nardopay</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationPage; 