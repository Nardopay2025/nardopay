import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface PaymentLinksFormProps {
  onSuccess: () => void;
}

export const PaymentLinksForm = ({ onSuccess }: PaymentLinksFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userCurrency, setUserCurrency] = useState('');
  const [enableWebhook, setEnableWebhook] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState<{ business_name: string; logo_url: string; primary_color: string; secondary_color: string } | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    amount: '',
    currency: 'KES',
    description: '',
    thank_you_message: '',
    redirect_url: '',
    webhook_url: '',
    image_url: '',
  });

  useEffect(() => {
    fetchUserCurrency();
    fetchBranding();
  }, []);

  const fetchUserCurrency = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.currency) {
        setUserCurrency(data.currency);
        setFormData(prev => ({ ...prev, currency: data.currency }));
      }
    } catch (error) {
      console.error('Error fetching user currency:', error);
    }
  };

  const fetchBranding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('safe_profiles')
        .select('business_name, logo_url, primary_color, secondary_color')
        .eq('id', user.id)
        .single();
      if (data) {
        setInvoiceSettings({
          business_name: data.business_name || 'NardoPay',
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || '#0EA5E9',
          secondary_color: data.secondary_color || '#0284C7',
        });
      } else {
        setInvoiceSettings({ business_name: 'NardoPay', logo_url: '', primary_color: '#0EA5E9', secondary_color: '#0284C7' });
      }
    } catch (_) {
      setInvoiceSettings({ business_name: 'NardoPay', logo_url: '', primary_color: '#0EA5E9', secondary_color: '#0284C7' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check user's country
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('country, email')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Only allow link creation for Zimbabwe users
      if (profile?.country !== 'ZW') {
        // Send notification email
        try {
          await supabase.functions.invoke('send-payment-emails', {
            body: {
              type: 'service-notification',
              to: profile?.email || user.email,
              message: 'We noticed you tried to create a payment link. Our service is currently available in Zimbabwe. We\'ll notify you via email when it becomes available in your country.',
            },
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
        }

        toast({
          title: 'Service Not Available',
          description: 'Our service is currently only available in Zimbabwe. We\'ll notify you via email when it becomes available in your country.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('payment_links').insert({
        user_id: user.id,
        product_name: formData.product_name,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description,
        thank_you_message: formData.thank_you_message,
        redirect_url: formData.redirect_url || null,
        webhook_url: enableWebhook ? formData.webhook_url : null,
        image_url: formData.image_url || null,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Payment link created successfully',
      });
      
      onSuccess();
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
        <h2 className="text-2xl font-bold text-foreground">Create Payment Link</h2>
        <p className="text-muted-foreground mt-1">
          Create a link to receive one-time payments
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Image upload */}
          <Card className="p-6">
            <div className="space-y-3">
              <Label>Product Image</Label>
              {formData.image_url && (
                <div className="rounded-lg overflow-hidden border border-border w-full h-48 flex items-center justify-center bg-muted/40">
                  <img src={formData.image_url} alt="Product" className="w-full h-full object-cover" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!file || !user) return;
                  if (!file.type.startsWith('image/')) {
                    toast({ title: 'Invalid file', description: 'Please upload an image file', variant: 'destructive' });
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    toast({ title: 'File too large', description: 'Please upload an image smaller than 5MB', variant: 'destructive' });
                    return;
                  }
                  try {
                    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
                    const path = `${user.id}/payment-links/${Date.now()}.${ext}`;
                    const { error: uploadError } = await supabase.storage
                      .from('link-images')
                      .upload(path, file, { upsert: true, contentType: file.type || `image/${ext}`, cacheControl: '3600' });
                    if (uploadError) throw uploadError;
                    const { data } = supabase.storage.from('link-images').getPublicUrl(path);
                    setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
                    toast({ title: 'Image uploaded' });
                  } catch (err: any) {
                    toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">PNG/JPG up to 5MB</p>
            </div>
          </Card>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product_name">Product/Service Name *</Label>
            <Input
              id="product_name"
              required
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              placeholder="e.g., Premium Package"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={userCurrency}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Currency is set in your profile settings
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this payment is for"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="thank_you_message">Thank You Message</Label>
            <Textarea
              id="thank_you_message"
              value={formData.thank_you_message}
              onChange={(e) => setFormData({ ...formData, thank_you_message: e.target.value })}
              placeholder="Message shown after successful payment"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="redirect_url">Redirect URL (Optional)</Label>
            <Input
              id="redirect_url"
              type="url"
              value={formData.redirect_url}
              onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
              placeholder="https://example.com/thank-you"
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enable_webhook" 
                checked={enableWebhook}
                onCheckedChange={(checked) => setEnableWebhook(checked as boolean)}
              />
              <Label htmlFor="enable_webhook" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Enable Webhook Notifications
              </Label>
            </div>
            
            {enableWebhook && (
              <div>
                <Label htmlFor="webhook_url">Webhook URL *</Label>
                <Input
                  id="webhook_url"
                  type="url"
                  required={enableWebhook}
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  placeholder="https://your-webhook-endpoint.com/webhook"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send payment notifications to this URL
                </p>
              </div>
            )}
          </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Payment Link
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Live Preview */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div
              className="p-6 md:p-8 text-white"
              style={{ background: `linear-gradient(135deg, ${invoiceSettings?.primary_color || '#0EA5E9'}, ${invoiceSettings?.secondary_color || '#0284C7'})` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  {invoiceSettings?.logo_url ? (
                    <img 
                      src={invoiceSettings.logo_url} 
                      alt={invoiceSettings.business_name} 
                      className="h-10 md:h-12 object-contain mb-2" 
                    />
                  ) : (
                    <div className="text-xl md:text-2xl font-bold mb-2">{invoiceSettings?.business_name || 'NardoPay'}</div>
                  )}
                  <div className="text-white/80 text-xs">Payment • Preview</div>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">INVOICE</p>
                  <p className="text-lg font-bold">#PREVIEW</p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Image */}
                <div className="space-y-6">
                  <div className="rounded-xl overflow-hidden bg-muted/40 border border-border min-h-[260px] flex items-center justify-center">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt={formData.product_name || 'Preview'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
                        <span className="text-muted-foreground">Product image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Top summary, bottom details */}
                <div className="flex flex-col gap-6">
                  {/* Top: Amount and description */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">{formData.product_name || 'Product name'}</h3>
                    {formData.description && (
                      <p className="text-muted-foreground leading-relaxed">{formData.description}</p>
                    )}
                    <div className="text-2xl font-bold text-foreground">
                      {(formData.amount && userCurrency) ? `${userCurrency} ${Number(formData.amount || 0).toFixed(2)}` : ''}
                    </div>
                  </div>

                  {/* Bottom: Details form mimic */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Full Name</Label>
                        <Input className="bg-background" disabled placeholder="John Doe" />
                      </div>
                      <div>
                        <Label className="text-sm">Email Address</Label>
                        <Input className="bg-background" disabled placeholder="john@example.com" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">WhatsApp Number</Label>
                      <Input className="bg-background" disabled placeholder="+27123456789" />
                      <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +27123456789)</p>
                    </div>
                    {/* Pay button preview */}
                    <div>
                      <Button
                        className="w-full text-white border-0 hover:opacity-90 transition-opacity disabled:opacity-50"
                        size="lg"
                        disabled
                        style={{
                          background: `linear-gradient(135deg, ${invoiceSettings?.primary_color || '#0EA5E9'}, ${invoiceSettings?.secondary_color || '#0284C7'})`,
                        }}
                      >
                        {formData.amount && userCurrency
                          ? `Pay ${userCurrency} ${Number(formData.amount).toFixed(2)}`
                          : 'Pay'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};