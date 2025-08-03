import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, ExternalLink, Trash2, Pause, Play, Repeat, Calendar, Users } from 'lucide-react';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { useSubscriptionLinks } from '@/contexts/SubscriptionLinksContext';

interface SubscriptionLinksFormProps {
  createdSubscriptionLinks: any[];
  setCreatedSubscriptionLinks: (links: any[]) => void;
  setActiveTab: (tab: string) => void;
}

export const SubscriptionLinksForm = ({ 
  createdSubscriptionLinks, 
  setCreatedSubscriptionLinks, 
  setActiveTab 
}: SubscriptionLinksFormProps) => {
  const { invoiceSettings } = useInvoiceSettings();
  const { addSubscriptionLink } = useSubscriptionLinks();
  
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    billingCycle: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    trialDays: 0,
    thankYouMessage: 'Thank you for subscribing!',
    redirectUrl: 'https://yourwebsite.com/success'
  });

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
      title: linkFormData.title,
      description: linkFormData.description,
      amount: linkFormData.amount,
      currency: linkFormData.currency,
      billingCycle: linkFormData.billingCycle,
      trialDays: parseInt(linkFormData.trialDays.toString()),
      thankYouMessage: linkFormData.thankYouMessage,
      redirectUrl: linkFormData.redirectUrl,
      link: `/subscribe/${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      subscribers: 0,
      totalRevenue: '0',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    addSubscriptionLink(newLink);
    setCreatedSubscriptionLinks(prev => [...prev, newLink]);
    
    // Reset form
    setLinkFormData({
      title: '',
      description: '',
      amount: '',
      currency: 'USD',
      billingCycle: 'monthly',
      trialDays: 0,
      thankYouMessage: 'Thank you for subscribing!',
      redirectUrl: 'https://yourwebsite.com/success'
    });
  };

  const copyToClipboard = async (link: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${link}`);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const deleteLink = (linkId: string) => {
    setCreatedSubscriptionLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const toggleLinkStatus = (linkId: string) => {
    setCreatedSubscriptionLinks(prev => prev.map(link => 
      link.id === linkId 
        ? { ...link, status: link.status === 'active' ? 'paused' : 'active' }
        : link
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: string) => {
    return `${linkFormData.currency} ${amount}`;
  };

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      case 'quarterly': return 'quarter';
      case 'yearly': return 'year';
      default: return 'month';
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
          <h1 className="text-3xl font-bold text-foreground">Subscription Links</h1>
          <p className="text-muted-foreground">Create recurring payment subscriptions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Create Subscription Link Form */}
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="w-5 h-5" />
                Create Subscription Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Subscription Name</Label>
                <Input
                  id="title"
                  placeholder="Premium Plan"
                  value={linkFormData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="29.99"
                  value={linkFormData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={linkFormData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-background text-foreground"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="RWF">RWF - Rwandan Franc</option>
                </select>
              </div>

              <div>
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <select
                  id="billingCycle"
                  value={linkFormData.billingCycle}
                  onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-background text-foreground"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <Label htmlFor="trialDays">Trial Days (Optional)</Label>
                <Input
                  id="trialDays"
                  type="number"
                  placeholder="0"
                  value={linkFormData.trialDays}
                  onChange={(e) => handleInputChange('trialDays', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what subscribers get with this plan"
                  value={linkFormData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="thankYouMessage">Thank You Message</Label>
                <Textarea
                  id="thankYouMessage"
                  placeholder="Thank you for subscribing!"
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

              <Button 
                onClick={handleCreateLink}
                disabled={!linkFormData.title || !linkFormData.amount}
                className="w-full"
              >
                Create Subscription Link
              </Button>
            </CardContent>
          </Card>
        </div>

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
                  <h1 className="text-lg font-bold text-white mb-1">Subscribe to Our Service</h1>
                  <p className="text-gray-400 text-xs">Secure subscription powered by {invoiceSettings.businessName || 'Nardopay'}</p>
                </div>

                {/* Subscription Plan */}
                <Card className="bg-gray-800 border-gray-700 mb-4">
                  <CardContent className="p-4">
                    <div className="text-xs font-bold text-white mb-2">Subscription Plan</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-white text-sm font-medium">
                          {linkFormData.title || 'Subscription Name'}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {linkFormData.description || 'Premium features and benefits'}
                        </div>
                      </div>
                      
                      {/* Pricing */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Price</span>
                          <div className="text-right">
                            <div className="text-white font-bold text-sm">
                              {linkFormData.amount ? formatAmount(linkFormData.amount) : 'Enter amount'}
                            </div>
                            <div className="text-gray-400 text-xs">
                              per {getBillingCycleText(linkFormData.billingCycle)}
                            </div>
                          </div>
                        </div>
                        
                        {linkFormData.trialDays > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs">Trial</span>
                            <span className="text-green-400 text-xs font-medium">
                              {linkFormData.trialDays} days free
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscribe Button */}
                <div 
                  className="p-3 rounded text-center text-white font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                  }}
                >
                  Subscribe Now
                </div>
                
                <div className="text-center mt-2">
                  <p className="text-gray-400 text-xs">
                    Cancel anytime • Secure payment
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Created Links List */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Created Subscriptions</h2>
          {createdSubscriptionLinks.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm p-6 text-center">
              <p className="text-muted-foreground">No subscription plans created yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {createdSubscriptionLinks.map((link) => (
                <Card key={link.id} className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{link.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {link.amount} {link.currency} per {getBillingCycleText(link.billingCycle)}
                          {link.trialDays > 0 && ` • ${link.trialDays} days trial`}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {link.subscribers} subscribers
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {link.totalRevenue} revenue
                          </span>
                        </div>
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