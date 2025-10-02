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

interface SubscriptionLinksFormProps {
  onSuccess: () => void;
}

export const SubscriptionLinksForm = ({ onSuccess }: SubscriptionLinksFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userCurrency, setUserCurrency] = useState('');
  const [enableWebhook, setEnableWebhook] = useState(false);
  const [formData, setFormData] = useState({
    plan_name: '',
    amount: '',
    currency: 'KES',
    billing_cycle: 'monthly',
    trial_days: '0',
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

      const { error } = await supabase.from('subscription_links').insert({
        user_id: user.id,
        plan_name: formData.plan_name,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        billing_cycle: formData.billing_cycle,
        trial_days: parseInt(formData.trial_days),
        description: formData.description,
        thank_you_message: formData.thank_you_message,
        redirect_url: formData.redirect_url || null,
        webhook_url: enableWebhook ? formData.webhook_url : null,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Subscription plan created successfully',
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
        <h2 className="text-2xl font-bold text-foreground">Create Subscription Plan</h2>
        <p className="text-muted-foreground mt-1">
          Set up recurring billing for your services
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plan_name">Plan Name *</Label>
            <Input
              id="plan_name"
              required
              value={formData.plan_name}
              onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
              placeholder="e.g., Premium Plan"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing_cycle">Billing Cycle *</Label>
              <Select
                value={formData.billing_cycle}
                onValueChange={(value) => setFormData({ ...formData, billing_cycle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="trial_days">Trial Days</Label>
              <Input
                id="trial_days"
                type="number"
                min="0"
                value={formData.trial_days}
                onChange={(e) => setFormData({ ...formData, trial_days: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what's included in this plan"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="thank_you_message">Thank You Message</Label>
            <Textarea
              id="thank_you_message"
              value={formData.thank_you_message}
              onChange={(e) => setFormData({ ...formData, thank_you_message: e.target.value })}
              placeholder="Message shown after subscription"
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
              placeholder="https://example.com/welcome"
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
                  We'll send subscription notifications to this URL
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Subscription Plan
          </Button>
        </form>
      </Card>
    </div>
  );
};