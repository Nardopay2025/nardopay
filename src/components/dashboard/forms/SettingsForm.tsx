import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Upload, Palette, Building2, Image, Sparkles } from 'lucide-react';

interface SettingsFormProps {
  invoiceSettings: any;
  updateInvoiceSettings: (settings: any) => void;
  setActiveTab: (tab: string) => void;
}

export const SettingsForm = ({ 
  invoiceSettings, 
  updateInvoiceSettings, 
  setActiveTab 
}: SettingsFormProps) => {
  const presetThemes = [
    {
      name: 'Ocean Blue',
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      description: 'Professional blue theme'
    },
    {
      name: 'Emerald Green',
      primary: '#10B981',
      secondary: '#059669',
      description: 'Fresh green theme'
    },
    {
      name: 'Purple Dream',
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      description: 'Modern purple theme'
    },
    {
      name: 'Sunset Orange',
      primary: '#F59E0B',
      secondary: '#D97706',
      description: 'Warm orange theme'
    },
    {
      name: 'Rose Pink',
      primary: '#EC4899',
      secondary: '#DB2777',
      description: 'Elegant pink theme'
    },
    {
      name: 'Slate Gray',
      primary: '#64748B',
      secondary: '#475569',
      description: 'Minimal gray theme'
    },
    {
      name: 'Fire Red',
      primary: '#EF4444',
      secondary: '#DC2626',
      description: 'Bold red theme'
    },
    {
      name: 'Teal Blue',
      primary: '#14B8A6',
      secondary: '#0D9488',
      description: 'Calm teal theme'
    }
  ];

  const [formData, setFormData] = useState({
    businessName: invoiceSettings.businessName || '',
    logoUrl: invoiceSettings.logoUrl || '',
    primaryColor: invoiceSettings.primaryColor || '#3B82F6',
    secondaryColor: invoiceSettings.secondaryColor || '#1D4ED8',
    customLogo: invoiceSettings.customLogo || false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      updateInvoiceSettings(formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // You could add a success toast here
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('logoUrl', result);
        handleInputChange('customLogo', true);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTheme = (theme: { primary: string; secondary: string }) => {
    handleInputChange('primaryColor', theme.primary);
    handleInputChange('secondaryColor', theme.secondary);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveTab('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and invoice settings</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Your Company Name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Logo & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="customLogo"
                  checked={formData.customLogo}
                  onCheckedChange={(checked) => handleInputChange('customLogo', checked)}
                />
                <Label htmlFor="customLogo">Use Custom Logo</Label>
              </div>
              
              {formData.customLogo && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      placeholder="https://yourwebsite.com/logo.png"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Upload Logo</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload logo</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      id="primaryColor"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      placeholder="#1D4ED8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Preset Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Choose from our curated collection of professional themes
              </p>
              <div className="grid grid-cols-2 gap-3">
                {presetThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => applyTheme(theme)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                        }}
                      />
                      <span className="text-sm font-medium">{theme.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                    <div className="flex gap-1 mt-2">
                      <div 
                        className="w-3 h-3 rounded border"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded border"
                        style={{ backgroundColor: theme.secondary }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave} 
            className="w-full" 
            disabled={isLoading || !formData.businessName}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                <div className="w-full max-w-md">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {formData.customLogo && formData.logoUrl ? (
                        <img 
                          src={formData.logoUrl} 
                          alt={formData.businessName} 
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center"
                          style={{ backgroundColor: formData.primaryColor }}
                        >
                          <span className="text-white font-bold text-xs">
                            {formData.businessName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span 
                        className="font-semibold text-white text-sm"
                        style={{ color: formData.primaryColor }}
                      >
                        {formData.businessName || 'Your Company'}
                      </span>
                    </div>
                    <h1 className="text-lg font-bold text-white mb-1">Complete Your Payment</h1>
                    <p className="text-gray-400 text-xs">Secure payment powered by {formData.businessName || 'Your Company'}</p>
                  </div>

                  {/* Order Summary */}
                  <Card className="bg-gray-800 border-gray-700 mb-4">
                    <CardContent className="p-4">
                      <div className="text-xs font-bold text-white mb-2">Order Summary</div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Sample Product</div>
                          <div className="text-gray-400 text-xs mt-1">Sample description</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-white font-bold text-sm">$50.00</div>
                          <div className="text-gray-400 text-xs">USD</div>
                        </div>
                      </div>
                      <div className="border-t border-gray-700 mt-3 pt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-xs">Total</span>
                          <span className="text-white font-bold text-sm">$50.00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 border border-gray-600 rounded text-center">
                      <div className="w-4 h-4 mx-auto mb-1" style={{ color: formData.primaryColor }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                        </svg>
                      </div>
                      <div className="text-xs text-gray-300">Card</div>
                    </div>
                    <div className="p-3 border border-gray-600 rounded text-center">
                      <div className="w-4 h-4 mx-auto mb-1" style={{ color: formData.primaryColor }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-1.99zM17 19H7V5h10v14z"/>
                        </svg>
                      </div>
                      <div className="text-xs text-gray-300">Mobile</div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <div 
                    className="p-3 rounded text-center text-white font-medium"
                    style={{ 
                      background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})`
                    }}
                  >
                    Pay $50.00
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 