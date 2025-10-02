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

interface DonationLinksFormProps {
  onSuccess: () => void;
}

export const DonationLinksForm = ({ onSuccess }: DonationLinksFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userCurrency, setUserCurrency] = useState('');
  const [enableWebhook, setEnableWebhook] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    goal_amount: '',
    currency: 'KES',
    description: '',
    thank_you_message: '',
    redirect_url: '',
    webhook_url: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('donation_links').insert({
        user_id: user.id,
        title: formData.title,
        goal_amount: parseFloat(formData.goal_amount),
        currency: formData.currency,
        description: formData.description,
        thank_you_message: formData.thank_you_message,
        redirect_url: formData.redirect_url || null,
        webhook_url: enableWebhook ? formData.webhook_url : null,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Donation link created successfully',
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
        <h2 className="text-2xl font-bold text-foreground">Create Donation Campaign</h2>
        <p className="text-muted-foreground mt-1">
          Start a fundraising campaign with goal tracking
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Community Water Project"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal_amount">Goal Amount *</Label>
              <Input
                id="goal_amount"
                type="number"
                step="0.01"
                required
                value={formData.goal_amount}
                onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
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
            <Label htmlFor="description">Campaign Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell people about your campaign"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="thank_you_message">Thank You Message</Label>
            <Textarea
              id="thank_you_message"
              value={formData.thank_you_message}
              onChange={(e) => setFormData({ ...formData, thank_you_message: e.target.value })}
              placeholder="Message shown after donation"
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
                  We'll send donation notifications to this URL
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Donation Campaign
          </Button>
        </form>
      </Card>
    </div>
  );
};