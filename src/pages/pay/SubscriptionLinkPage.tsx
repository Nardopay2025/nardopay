import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionLinkPage() {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscriptionLink, setSubscriptionLink] = useState<any>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (linkCode) {
      fetchSubscriptionLink();
    }
  }, [linkCode]);

  const fetchSubscriptionLink = async () => {
    try {
      // Use secure public view to avoid exposing sensitive fields
      const { data, error } = await supabase
        .from('public_subscription_links')
        .select('*')
        .eq('link_code', linkCode)
        .limit(1);

      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : undefined;
      if (!row) {
        navigate('/404');
        return;
      }

      setSubscriptionLink(row);

      const { data: profileData } = await supabase
        .from('safe_profiles')
        .select('business_name, logo_url, primary_color, secondary_color')
        .eq('id', row.user_id)
        .single();

      if (profileData && profileData.business_name) {
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: profileData.logo_url || '',
          primary_color: profileData.primary_color || '#8B5CF6',
          secondary_color: profileData.secondary_color || '#7C3AED',
        });
      } else {
        setInvoiceSettings({
          business_name: 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: '',
          primary_color: '#8B5CF6',
          secondary_color: '#7C3AED',
        });
      }
    } catch (error: any) {
      console.error('Error fetching subscription link:', error);
      toast({ title: 'Error', description: 'Subscription link not found or inactive', variant: 'destructive' });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();

    // Navigate to checkout page with customer details
    const params = new URLSearchParams({
      name: subscriberName,
      email: subscriberEmail,
    });
    
    navigate(`/pay/subscribe/${linkCode}/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const primaryColor = invoiceSettings?.primary_color || '#8B5CF6';
  const secondaryColor = invoiceSettings?.secondary_color || '#7C3AED';
  const businessName = invoiceSettings?.business_name || 'Business';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl overflow-hidden border-border">
        <div 
          className="p-8 text-white"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="flex justify-between items-start">
            <div>
              {invoiceSettings?.logo_url ? (
                <img 
                  src={invoiceSettings.logo_url} 
                  alt={businessName}
                  className="h-12 mb-4 object-contain"
                />
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">{businessName}</h1>
                </div>
              )}
              {invoiceSettings?.business_address && (
                <p className="text-white/80 text-sm">{invoiceSettings.business_address}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">SUBSCRIPTION</p>
              <p className="text-xl font-bold">#{linkCode?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="border-b border-border pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{subscriptionLink.plan_name}</h2>
              <Badge variant="secondary" className="text-sm">
                {subscriptionLink.billing_cycle}
              </Badge>
            </div>
            {subscriptionLink.description && (
              <p className="text-muted-foreground mb-4">{subscriptionLink.description}</p>
            )}
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subscription Amount</span>
                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {subscriptionLink.currency} {parseFloat(subscriptionLink.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span className="font-medium capitalize">{subscriptionLink.billing_cycle}</span>
              </div>
              {subscriptionLink.trial_days > 0 && (
                <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    {subscriptionLink.trial_days} days free trial included
                  </span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubscription} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Subscriber Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="bg-background"
                  />
                </div>
              </div>
            </div>


            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  By subscribing, you agree to automatic {subscriptionLink.billing_cycle} payments of {subscriptionLink.currency} {parseFloat(subscriptionLink.amount).toFixed(2)}. You can cancel anytime.
                </span>
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full text-white" 
              disabled={processing}
              style={{ 
                background: processing ? undefined : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
              }}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Subscribe Now - ${subscriptionLink.currency} ${parseFloat(subscriptionLink.amount).toFixed(2)}/${subscriptionLink.billing_cycle}`
              )}
            </Button>
          </form>

          {invoiceSettings?.invoice_footer && (
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              {invoiceSettings.invoice_footer}
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Secured by NardoPay • Your payment information is encrypted
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
