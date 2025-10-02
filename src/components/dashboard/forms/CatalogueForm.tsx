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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'KES',
    webhook_url: '',
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
  );
};