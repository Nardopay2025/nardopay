import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { usePaymentLinks } from '@/contexts/PaymentLinksContext';
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Pause, 
  Play,
  CreditCard,
  Smartphone
} from 'lucide-react';

interface PaymentLinksFormProps {
  createdLinks: any[];
  setCreatedLinks: (links: any[]) => void;
  setActiveTab: (tab: string) => void;
}

export const PaymentLinksForm = ({ 
  createdLinks, 
  setCreatedLinks, 
  setActiveTab 
}: PaymentLinksFormProps) => {
  const { invoiceSettings } = useInvoiceSettings();
  const { addPaymentLink, paymentLinks } = usePaymentLinks();
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    description: '',
    thankYouMessage: 'Thank you for your payment!',
    redirectUrl: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setLinkFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateLink = () => {
    if (!linkFormData.title || !linkFormData.amount) return;

    const newLink = {
      id: Date.now().toString(),
      productName: linkFormData.title, // Map title to productName
      description: linkFormData.description,
      amount: linkFormData.amount,
      currency: linkFormData.currency,
      thankYouMessage: linkFormData.thankYouMessage,
      redirectUrl: linkFormData.redirectUrl,
      link: `/pay/${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      payments: 0,
      totalAmount: '0'
    };

    addPaymentLink(newLink);
    setCreatedLinks(prev => [...prev, newLink]);
    
    // Reset form
    setLinkFormData({
      title: '',
      amount: '',
      currency: 'USD',
      description: '',
      thankYouMessage: 'Thank you for your payment!',
      redirectUrl: ''
    });
  };

  const copyToClipboard = async (link: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(link);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const deleteLink = (linkId: string) => {
    setCreatedLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const toggleLinkStatus = (linkId: string) => {
    setCreatedLinks(prev => prev.map(link => 
      link.id === linkId 
        ? { ...link, status: link.status === 'active' ? 'paused' : 'active' }
        : link
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveTab('create-link')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Links</h1>
          <p className="text-muted-foreground">Create secure payment links for one-time transactions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Create Payment Link Form */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Create Payment Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Product</Label>
              <Input
                id="title"
                placeholder="Product or service name"
                value={linkFormData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={linkFormData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={linkFormData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
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
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for the payment"
                value={linkFormData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="thankYouMessage">Thank You Message</Label>
              <Textarea
                id="thankYouMessage"
                placeholder="Message to show after successful payment"
                value={linkFormData.thankYouMessage}
                onChange={(e) => handleInputChange('thankYouMessage', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                placeholder="https://yourwebsite.com/success"
                value={linkFormData.redirectUrl}
                onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
              />
            </div>

            <Button onClick={handleCreateLink} className="w-full">
              Create Payment Link
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {invoiceSettings.customLogo && invoiceSettings.logoUrl ? (
                      <img 
                        src={invoiceSettings.logoUrl} 
                        alt={invoiceSettings.businessName} 
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ backgroundColor: invoiceSettings.primaryColor }}
                      >
                        <span className="text-white font-bold text-xs">
                          {(invoiceSettings.businessName || 'N').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span 
                      className="font-semibold text-white text-sm"
                      style={{ color: invoiceSettings.primaryColor }}
                    >
                      {invoiceSettings.businessName || 'Nardopay'}
                    </span>
                  </div>
                  <h1 className="text-lg font-bold text-white mb-1">Complete Your Payment</h1>
                  <p className="text-gray-400 text-xs">Secure payment powered by {invoiceSettings.businessName || 'Nardopay'}</p>
                </div>

                {/* Order Summary */}
                <Card className="bg-gray-800 border-gray-700 mb-4">
                  <CardContent className="p-4">
                    <div className="text-xs font-bold text-white mb-2">Order Summary</div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">
                          {linkFormData.title || 'Product'}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {linkFormData.description || 'Payment for goods or services'}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-white font-bold text-sm">
                          {linkFormData.amount ? `${linkFormData.currency} ${linkFormData.amount}` : 'Enter amount'}
                        </div>
                        <div className="text-gray-400 text-xs">{linkFormData.currency}</div>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 mt-3 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Total</span>
                        <span className="text-white font-bold text-sm">
                          {linkFormData.amount ? `${linkFormData.currency} ${linkFormData.amount}` : 'Enter amount'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-3 border border-gray-600 rounded text-center">
                    <div className="w-4 h-4 mx-auto mb-1" style={{ color: invoiceSettings.primaryColor }}>
                      <CreditCard className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Card</div>
                  </div>
                  <div className="p-3 border border-gray-600 rounded text-center">
                    <div className="w-4 h-4 mx-auto mb-1" style={{ color: invoiceSettings.primaryColor }}>
                      <Smartphone className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Mobile</div>
                  </div>
                </div>

                {/* Pay Button */}
                <div 
                  className="p-3 rounded text-center text-white font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                  }}
                >
                  Pay {linkFormData.amount ? `${linkFormData.currency} ${linkFormData.amount}` : 'Enter amount'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Created Links List */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Created Links</h2>
          {createdLinks.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm p-6 text-center">
              <p className="text-muted-foreground">No payment links created yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {createdLinks.map((link) => (
                <Card key={link.id} className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-medium">{link.productName || link.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {link.amount} {link.currency}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLinkStatus(link.id)}
                        >
                          {link.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
                      <Input
                        value={link.link}
                        readOnly
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(link.link, link.id)}
                          className="flex-1 sm:flex-none"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(link.link, '_blank')}
                          className="flex-1 sm:flex-none"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 