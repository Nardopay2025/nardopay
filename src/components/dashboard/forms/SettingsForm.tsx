import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, User, FileText, Palette, X, Settings2, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { COUNTRIES, getCountryByCode } from '@/lib/countries';
import { UpgradePlanDialog } from '@/components/dashboard/UpgradePlanDialog';

// Preset color palettes
const COLOR_PRESETS = [
  { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#0284C7' },
  { name: 'Forest Green', primary: '#10B981', secondary: '#059669' },
  { name: 'Sunset Orange', primary: '#F97316', secondary: '#EA580C' },
  { name: 'Royal Purple', primary: '#8B5CF6', secondary: '#7C3AED' },
  { name: 'Cherry Red', primary: '#EF4444', secondary: '#DC2626' },
  { name: 'Midnight Dark', primary: '#1F2937', secondary: '#111827' },
];

// Function to extract dominant colors from an image
const extractColorsFromImage = (imageElement: HTMLImageElement): Promise<string[]> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(['#3B82F6', '#1E40AF']);
      return;
    }

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorMap: { [key: string]: number } = {};

    // Sample pixels and count occurrences
    for (let i = 0; i < data.length; i += 4 * 10) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent and very light/dark pixels
      if (a < 125 || (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;

      const color = `${r},${g},${b}`;
      colorMap[color] = (colorMap[color] || 0) + 1;
    }

    // Get top 2 most common colors
    const sortedColors = Object.entries(colorMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);

    const colors = sortedColors.map(([rgb]) => {
      const [r, g, b] = rgb.split(',').map(Number);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    });

    resolve(colors.length === 2 ? colors : ['#3B82F6', '#1E40AF']);
  });
};

export const SettingsForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [upgradePlanOpen, setUpgradePlanOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    currency: 'KES',
    country: '',
    plan: 'free',
    withdrawal_account_type: '',
    mobile_provider: '',
    mobile_number: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_name: '',
  });
  const [invoiceSettings, setInvoiceSettings] = useState({
    business_name: '',
    business_address: '',
    tax_id: '',
    invoice_footer: '',
    logo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchInvoiceSettings();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          currency: data.currency || 'KES',
          country: data.country || '',
          plan: data.plan || 'free',
          withdrawal_account_type: data.withdrawal_account_type || '',
          mobile_provider: data.mobile_provider || '',
          mobile_number: data.mobile_number || '',
          bank_name: data.bank_name || '',
          bank_account_number: data.bank_account_number || '',
          bank_account_name: data.bank_account_name || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchInvoiceSettings = async () => {
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('business_name, business_address, tax_id, invoice_footer, logo_url, primary_color, secondary_color')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setInvoiceSettings({
            business_name: data.business_name || '',
            business_address: data.business_address || '',
            tax_id: data.tax_id || '',
            invoice_footer: data.invoice_footer || '',
            logo_url: data.logo_url || '',
            primary_color: data.primary_color || '#3B82F6',
            secondary_color: data.secondary_color || '#1E40AF',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching invoice settings:', error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingLogo(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      // Extract colors from the image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        const colors = await extractColorsFromImage(img);
        setInvoiceSettings(prev => ({
          ...prev,
          logo_url: publicUrl,
          primary_color: colors[0],
          secondary_color: colors[1],
        }));
        
        toast({
          title: 'Success!',
          description: 'Logo uploaded and colors extracted',
        });
      };
      img.src = publicUrl;
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setInvoiceSettings(prev => ({ ...prev, logo_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setInvoiceSettings(prev => ({
      ...prev,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
    }));
  };

  const getInitials = () => {
    if (!invoiceSettings.business_name) return 'BN';
    return invoiceSettings.business_name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save invoice settings to the database (profiles table)
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            business_name: invoiceSettings.business_name,
            business_address: invoiceSettings.business_address,
            tax_id: invoiceSettings.tax_id,
            invoice_footer: invoiceSettings.invoice_footer,
            logo_url: invoiceSettings.logo_url,
            primary_color: invoiceSettings.primary_color,
            secondary_color: invoiceSettings.secondary_color,
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      toast({
        title: 'Success!',
        description: 'Invoice settings updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your account and invoice settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 bg-muted p-1">
          <TabsTrigger value="profile" className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-background">
            <User className="h-4 w-4" />
            <span className="text-sm">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="withdrawal" className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-background">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">Withdrawal</span>
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-background">
            <Settings2 className="h-4 w-4" />
            <span className="text-sm">Plan</span>
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-background">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Invoice</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-background">
            <Palette className="h-4 w-4" />
            <span className="text-sm">Branding</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Email cannot be changed here
                </p>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={getCountryByCode(profileData.country)?.name || 'Not set'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  To change your country, please{' '}
                  <a href="/contact" className="text-primary hover:underline">
                    contact support
                  </a>
                </p>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={profileData.currency}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your currency is set based on your country
                </p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </Card>
        </TabsContent>

        {/* Withdrawal Account Settings */}
        <TabsContent value="withdrawal">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Withdrawal Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your funds will be sent to this account when you withdraw
                </p>
              </div>

              {profileData.withdrawal_account_type ? (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Type</span>
                    <span className="text-sm capitalize">{profileData.withdrawal_account_type === 'mobile' ? 'Mobile Money' : 'Bank Account'}</span>
                  </div>
                  
                  {profileData.withdrawal_account_type === 'mobile' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Provider</span>
                        <span className="text-sm">{profileData.mobile_provider}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Phone Number</span>
                        <span className="text-sm">{profileData.mobile_number}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bank</span>
                        <span className="text-sm">{profileData.bank_name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Account Number</span>
                        <span className="text-sm">{profileData.bank_account_number}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Account Name</span>
                        <span className="text-sm">{profileData.bank_account_name}</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-muted-foreground">
                    No withdrawal account configured
                  </p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> To change your withdrawal account, please{' '}
                  <a href="/contact" className="text-primary hover:underline">
                    contact support
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Plan Settings */}
        <TabsContent value="plan">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Plan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Current subscription plan and features
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold capitalize">{profileData.plan} Plan</h4>
                    <p className="text-blue-100 text-sm mt-1">
                      {profileData.plan === 'free' && 'Perfect for getting started'}
                      {profileData.plan === 'starter' && 'Great for small businesses'}
                      {profileData.plan === 'professional' && 'Advanced features for growing teams'}
                      {profileData.plan === 'enterprise' && 'Full power for large organizations'}
                    </p>
                  </div>
                </div>

                {profileData.plan === 'free' && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="bg-white text-blue-600 hover:bg-blue-50"
                      onClick={() => setUpgradePlanOpen(true)}
                    >
                      Upgrade Plan
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold mb-1">Unlimited</div>
                  <div className="text-sm text-muted-foreground">Payment Links</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold mb-1">5%</div>
                  <div className="text-sm text-muted-foreground">Transaction Fee</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <UpgradePlanDialog
          open={upgradePlanOpen}
          onOpenChange={setUpgradePlanOpen}
          currentPlan={profileData.plan}
        />

        {/* Invoice Settings */}
        <TabsContent value="invoice">
          <Card className="p-6">
            <form onSubmit={handleInvoiceSettingsUpdate} className="space-y-4">
              <div>
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  required
                  value={invoiceSettings.business_name}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, business_name: e.target.value })}
                  placeholder="Your Business Ltd."
                />
              </div>

              <div>
                <Label htmlFor="business_address">Business Address</Label>
                <Textarea
                  id="business_address"
                  value={invoiceSettings.business_address}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, business_address: e.target.value })}
                  placeholder="123 Business Street, City, Country"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tax_id">Tax ID / Registration Number</Label>
                <Input
                  id="tax_id"
                  value={invoiceSettings.tax_id}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, tax_id: e.target.value })}
                  placeholder="e.g., VAT123456789"
                />
              </div>

              <div>
                <Label htmlFor="invoice_footer">Invoice Footer Text</Label>
                <Textarea
                  id="invoice_footer"
                  value={invoiceSettings.invoice_footer}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoice_footer: e.target.value })}
                  placeholder="Thank you for your business!"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This text will appear at the bottom of all invoices
                </p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Invoice Settings
              </Button>
            </form>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <Card className="p-6">
            <form onSubmit={handleInvoiceSettingsUpdate} className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label htmlFor="logo">Business Logo</Label>
                <div className="mt-2 space-y-4">
                  {/* Logo Preview or Initials */}
                  <div className="flex items-center gap-4">
                    {invoiceSettings.logo_url ? (
                      <div className="relative">
                        <img
                          src={invoiceSettings.logo_url}
                          alt="Business Logo"
                          className="h-20 w-20 object-contain border border-border rounded-lg p-2"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="h-20 w-20 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                        style={{ backgroundColor: invoiceSettings.primary_color }}
                      >
                        {getInitials()}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingLogo}
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            {invoiceSettings.logo_url ? 'Change Logo' : 'Upload Logo'}
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-1">
                        Max size: 5MB. Colors will be auto-extracted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Color Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyColorPreset(preset)}
                      className="p-3 border border-border rounded-lg hover:border-primary transition-colors text-left"
                    >
                      <div className="flex gap-2 mb-2">
                        <div
                          className="h-8 w-8 rounded"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="h-8 w-8 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <p className="text-sm font-medium text-foreground">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Custom Colors</h3>
                <p className="text-sm text-muted-foreground">
                  Override auto-extracted colors or choose your own
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={invoiceSettings.primary_color}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, primary_color: e.target.value })}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={invoiceSettings.primary_color}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, primary_color: e.target.value })}
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={invoiceSettings.secondary_color}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, secondary_color: e.target.value })}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={invoiceSettings.secondary_color}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, secondary_color: e.target.value })}
                        placeholder="#1E40AF"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="p-6 border border-border rounded-lg space-y-3">
                  <p className="text-sm font-medium text-foreground">Preview</p>
                  <div className="flex gap-3">
                    <div
                      className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: invoiceSettings.primary_color }}
                    >
                      Primary
                    </div>
                    <div
                      className="flex-1 h-20 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: invoiceSettings.secondary_color }}
                    >
                      Secondary
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Branding Settings
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};