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
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface CatalogueFormProps {
  onSuccess: () => void;
}

interface CatalogueItem {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  image_url: string;
  sku: string;
}

export const CatalogueForm = ({ onSuccess }: CatalogueFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userCurrency, setUserCurrency] = useState('');
  const [enableWebhook, setEnableWebhook] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState<{ business_name: string; logo_url: string; primary_color: string; secondary_color: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'KES',
    webhook_url: '',
    cover_image_url: '',
  });
  const [items, setItems] = useState<CatalogueItem[]>([
    {
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      image_url: '',
      sku: '',
    },
  ]);

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

  const addItem = () => {
    setItems([
      ...items,
      {
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        image_url: '',
        sku: '',
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof CatalogueItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create catalogue
      const { data: catalogue, error: catalogueError } = await supabase
        .from('catalogues')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          currency: formData.currency,
          webhook_url: enableWebhook ? formData.webhook_url : null,
          cover_image_url: formData.cover_image_url || null,
        })
        .select()
        .single();

      if (catalogueError) throw catalogueError;

      // Create items
      const itemsToInsert = items.map((item) => ({
        catalogue_id: catalogue.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        stock_quantity: parseInt(item.stock_quantity) || 0,
        image_url: item.image_url || null,
        sku: item.sku || null,
      }));

      const { error: itemsError } = await supabase
        .from('catalogue_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: 'Success!',
        description: 'Catalogue created successfully',
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
        <h2 className="text-2xl font-bold text-foreground">Create Product Catalogue</h2>
        <p className="text-muted-foreground mt-1">
          Create a catalogue with multiple products
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Cover image upload */}
          <div className="space-y-3">
            <Label>Catalogue Cover Image</Label>
            {formData.cover_image_url && (
              <div className="rounded-lg overflow-hidden border border-border w-full h-48 flex items-center justify-center bg-muted/40">
                <img src={formData.cover_image_url} alt="Catalogue Cover" className="w-full h-full object-cover" />
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
                  const path = `${user.id}/catalogues/${Date.now()}.${ext}`;
                  const { error: uploadError } = await supabase.storage
                    .from('link-images')
                    .upload(path, file, { upsert: true, contentType: file.type || `image/${ext}`, cacheControl: '3600' });
                  if (uploadError) throw uploadError;
                  const { data } = supabase.storage.from('link-images').getPublicUrl(path);
                  setFormData((prev) => ({ ...prev, cover_image_url: data.publicUrl }));
                  toast({ title: 'Image uploaded' });
                } catch (err: any) {
                  toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
                }
              }}
            />
            <p className="text-xs text-muted-foreground">PNG/JPG up to 5MB</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Catalogue Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Catalogue Details</h3>
                
                <div>
                  <Label htmlFor="name">Catalogue Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., My Product Store"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your catalogue"
                    rows={3}
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
                        We'll send order notifications to this URL
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">Items</h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {items.map((item, index) => (
                  <Card key={index} className="p-4 bg-accent/50">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-foreground">Item {index + 1}</h4>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Item Name *</Label>
                          <Input
                            required
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            placeholder="Product name"
                          />
                        </div>

                        <div>
                          <Label>Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            required
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label>Stock Quantity</Label>
                          <Input
                            type="number"
                            value={item.stock_quantity}
                            onChange={(e) => updateItem(index, 'stock_quantity', e.target.value)}
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <Label>SKU</Label>
                          <Input
                            value={item.sku}
                            onChange={(e) => updateItem(index, 'sku', e.target.value)}
                            placeholder="Product code"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Item description"
                            rows={2}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label>Image URL</Label>
                          <Input
                            type="url"
                            value={item.image_url}
                            onChange={(e) => updateItem(index, 'image_url', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Catalogue
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
                    <img src={invoiceSettings.logo_url} alt={invoiceSettings.business_name} className="h-10 md:h-12 object-contain mb-2" />
                  ) : (
                    <div className="text-xl md:text-2xl font-bold mb-2">{invoiceSettings?.business_name || 'NardoPay'}</div>
                  )}
                  <div className="text-white/80 text-xs">Catalogue • Preview</div>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">INVOICE</p>
                  <p className="text-lg font-bold">#PREVIEW</p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Cover Image */}
                <div className="space-y-6">
                  <div className="rounded-xl overflow-hidden bg-muted/40 border border-border min-h-[260px] flex items-center justify-center">
                    {formData.cover_image_url ? (
                      <img src={formData.cover_image_url} alt={formData.name || 'Catalogue'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">Catalogue cover preview</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Items + button */}
                <div className="flex flex-col gap-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">{formData.name || 'Catalogue name'}</h3>
                    {formData.description && (
                      <p className="text-muted-foreground leading-relaxed">{formData.description}</p>
                    )}
                  </div>
                  <div className="space-y-2 pt-2">
                    {items.slice(0, 3).map((it, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-foreground truncate max-w-[60%]">{it.name || 'Item name'}</span>
                        <span className="text-muted-foreground">{it.price ? `${it.price} ${userCurrency}` : ''}</span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{items.length - 3} more</div>
                    )}
                  </div>
                  <div>
                    <Button
                      className="w-full text-white border-0 hover:opacity-90 transition-opacity disabled:opacity-50"
                      size="lg"
                      disabled
                      style={{
                        background: `linear-gradient(135deg, ${invoiceSettings?.primary_color || '#0EA5E9'}, ${invoiceSettings?.secondary_color || '#0284C7'})`,
                      }}
                    >
                      Checkout
                    </Button>
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