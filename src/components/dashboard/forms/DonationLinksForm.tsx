import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, ExternalLink, Trash2, Pause, Play, Heart, Target, Users } from 'lucide-react';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { useDonationLinks } from '@/contexts/DonationLinksContext';

interface DonationLinksFormProps {
  createdDonationLinks: any[];
  setCreatedDonationLinks: (links: any[]) => void;
  setActiveTab: (tab: string) => void;
}

export const DonationLinksForm = ({ 
  createdDonationLinks, 
  setCreatedDonationLinks, 
  setActiveTab 
}: DonationLinksFormProps) => {
  const { invoiceSettings } = useInvoiceSettings();
  const { addDonationLink } = useDonationLinks();
  
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    currency: 'USD',
    thankYouMessage: 'Thank you for your donation!',
    redirectUrl: 'https://yourwebsite.com/success'
  });

  const handleInputChange = (field: string, value: string) => {
    setLinkFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateLink = () => {
    if (!linkFormData.title || !linkFormData.goalAmount) return;

    const newLink = {
      id: Date.now().toString(),
      title: linkFormData.title,
      description: linkFormData.description,
      goalAmount: linkFormData.goalAmount,
      currency: linkFormData.currency,
      thankYouMessage: linkFormData.thankYouMessage,
      redirectUrl: linkFormData.redirectUrl,
      link: `/donate/${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      donations: 0,
      totalAmount: '0',
      goalProgress: 0
    };

    addDonationLink(newLink);
    setCreatedDonationLinks(prev => [...prev, newLink]);
    
    // Reset form
    setLinkFormData({
      title: '',
      description: '',
      goalAmount: '',
      currency: 'USD',
      thankYouMessage: 'Thank you for your donation!',
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
    setCreatedDonationLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const toggleLinkStatus = (linkId: string) => {
    setCreatedDonationLinks(prev => prev.map(link => 
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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveTab('create-link')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donation Links</h1>
          <p className="text-muted-foreground">Create donation links to accept contributions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Create Donation Link Form */}
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Create Donation Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  placeholder="Help us build a school"
                  value={linkFormData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="goalAmount">Goal Amount</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  placeholder="1000"
                  value={linkFormData.goalAmount}
                  onChange={(e) => handleInputChange('goalAmount', e.target.value)}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell donors about your cause and how their contribution will help"
                  value={linkFormData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="thankYouMessage">Thank You Message</Label>
                <Textarea
                  id="thankYouMessage"
                  placeholder="Thank you for your donation!"
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
                disabled={!linkFormData.title || !linkFormData.goalAmount}
                className="w-full"
              >
                Create Donation Link
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
                  <h1 className="text-lg font-bold text-white mb-1">Support Our Cause</h1>
                  <p className="text-gray-400 text-xs">Secure donation powered by {invoiceSettings.businessName || 'Nardopay'}</p>
                </div>

                {/* Campaign Info */}
                <Card className="bg-gray-800 border-gray-700 mb-4">
                  <CardContent className="p-4">
                    <div className="text-xs font-bold text-white mb-2">Campaign</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-white text-sm font-medium">
                          {linkFormData.title || 'Campaign Title'}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {linkFormData.description || 'Help us make a difference'}
                        </div>
                      </div>
                      
                      {/* Goal Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Goal</span>
                          <span className="text-gray-400 font-medium">
                            {linkFormData.goalAmount ? formatAmount(linkFormData.goalAmount) : 'Enter goal'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: '0%',
                              background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">$0 raised</span>
                          <span className="text-gray-400">0%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                            {/* Donation Amount Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {['10', '25', '50', '100', '250', '500'].map((amount) => (
                    <button
                      key={amount}
                      className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors"
                    >
                      <div className="text-white font-medium text-sm">
                        {formatAmount(amount)}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-4">
                  <Input
                    placeholder="Enter custom amount"
                    className="bg-gray-700 border-gray-600 text-white text-center"
                  />
                </div>

                {/* Donate Button */}
                <div 
                  className="p-3 rounded text-center text-white font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                  }}
                >
                  Donate Now
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Created Links List */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Created Campaigns</h2>
          {createdDonationLinks.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm p-6 text-center">
              <p className="text-muted-foreground">No donation campaigns created yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {createdDonationLinks.map((link) => (
                <Card key={link.id} className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{link.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Goal: {link.goalAmount} {link.currency}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {link.donations} donors
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {link.goalProgress}% raised
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