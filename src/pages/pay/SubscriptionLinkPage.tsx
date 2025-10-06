import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Smartphone, RefreshCw, Check } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'bank'>('mobile');
  const [processing, setProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (linkCode) {
      fetchSubscriptionLink();
    }
  }, [linkCode]);

  const fetchSubscriptionLink = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_links')
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
        .from('profiles')
        .select('business_name, business_address, tax_id, invoice_footer, logo_url, primary_color, secondary_color')
        .eq('id', row.user_id)
        .single();

      if (profileData && profileData.business_name) {
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: profileData.business_address || '',
          tax_id: profileData.tax_id || '',
          invoice_footer: profileData.invoice_footer || '',
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

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      toast({
        title: 'Processing Subscription',
        description: 'Redirecting to payment gateway...',
      });

      const { data, error } = await supabase.functions.invoke('pesapal-submit-order', {
        body: {
          linkCode,
          linkType: 'subscription',
          payerName: subscriberName,
          payerEmail: subscriberEmail,
          paymentMethod,
        },
      });

      if (error) throw error;

      if (data?.redirect_url) {
        setPaymentUrl(data.redirect_url);
        setProcessing(false);
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Failed',
        description: error.message || 'Failed to initiate subscription',
        variant: 'destructive',
      });
      setProcessing(false);
    }
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

  if (paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div 
          className="p-6 text-white shadow-xl relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {invoiceSettings?.logo_url ? (
                  <img 
                    src={invoiceSettings.logo_url} 
                    alt={businessName}
                    className="h-12 object-contain bg-white/10 backdrop-blur-sm rounded-lg p-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{businessName}</h1>
                )}
              </div>
              <div className="text-right">
                <div className="text-white/80 text-sm mb-1">Subscription #{linkCode?.slice(0, 8).toUpperCase()}</div>
                <div className="text-2xl font-bold">
                  {subscriptionLink.currency} {parseFloat(subscriptionLink.amount).toFixed(2)} / {subscriptionLink.billing_cycle}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
            <div className="bg-muted/50 px-6 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Powered by NardoPay
              </div>
              <div className="text-xs text-muted-foreground">
                Encrypted & Secure Payment
              </div>
            </div>
            
            <iframe
              src={paymentUrl}
              className="w-full border-0 bg-background"
              style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
              title="Secure Payment Gateway"
            />
          </div>
        </div>
      </div>
    );
  }

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

            <div className="space-y-4">
              <h3 className="font-semibold">Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'mobile' | 'bank')}>
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-xs text-muted-foreground">Pay via M-Pesa, Airtel Money, etc.</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="h-5 w-5" style={{ color: primaryColor }} />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">Pay via bank account</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
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
