import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DonationLinkPage() {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donationLink, setDonationLink] = useState<any>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (linkCode) {
      fetchDonationLink();
    }
  }, [linkCode]);

  const fetchDonationLink = async () => {
    try {
      // Use secure public view to avoid exposing sensitive fields
      const { data, error } = await supabase
        .from('public_donation_links')
        .select('*')
        .eq('link_code', linkCode)
        .limit(1);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      const row = Array.isArray(data) ? data[0] : undefined;
      if (!row) {
        console.warn('No donation link found for code:', linkCode);
        navigate('/404');
        return;
      }

      console.log('Donation link found:', row);
      setDonationLink(row);
      
      // Fetch merchant's branding settings from safe_profiles view (no PII exposure)
      const { data: profileData, error: profileError } = await supabase
        .from('safe_profiles')
        .select('business_name, logo_url, primary_color, secondary_color')
        .eq('id', row.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      if (profileData && profileData.business_name) {
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: profileData.logo_url || '',
          primary_color: profileData.primary_color || '#EF4444',
          secondary_color: profileData.secondary_color || '#DC2626',
        });
      } else {
        // Default to NardoPay branding
        setInvoiceSettings({
          business_name: 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: '',
          primary_color: '#EF4444',
          secondary_color: '#DC2626',
        });
      }
    } catch (error: any) {
      console.error('Error fetching donation link:', error);
      toast({ title: 'Error', description: 'Donation link not found or inactive', variant: 'destructive' });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid donation amount',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to checkout page with customer details and donation amount
    const params = new URLSearchParams({
      name: donorName,
      email: donorEmail,
      amount: donationAmount,
    });
    
    navigate(`/pay/donate/${linkCode}/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progress = (parseFloat(donationLink.current_amount || 0) / parseFloat(donationLink.goal_amount)) * 100;
  const primaryColor = invoiceSettings?.primary_color || '#EF4444';
  const secondaryColor = invoiceSettings?.secondary_color || '#DC2626';
  const businessName = invoiceSettings?.business_name || 'Organization';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl overflow-hidden border-border">
        {/* Invoice Header with Brand Colors */}
        <div 
          className="p-8 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
          }}
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
                  <Heart className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">{businessName}</h1>
                </div>
              )}
              {invoiceSettings?.business_address && (
                <p className="text-white/80 text-sm">{invoiceSettings.business_address}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">DONATION</p>
              <p className="text-xl font-bold">#{linkCode?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 space-y-6">
          {/* Campaign Details */}
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-2">{donationLink.title}</h2>
            {donationLink.description && (
              <p className="text-muted-foreground mb-4">{donationLink.description}</p>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">
                  {donationLink.currency} {parseFloat(donationLink.current_amount || 0).toFixed(2)} of {donationLink.currency} {parseFloat(donationLink.goal_amount).toFixed(2)}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {donationLink.donations_count || 0} donations received
              </p>
            </div>
          </div>

          {/* Donation Form */}
          <form onSubmit={handleDonation} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Donation Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="bg-background text-lg font-semibold"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setDonationAmount('10')}>
                    {donationLink.currency} 10
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDonationAmount('50')}>
                    {donationLink.currency} 50
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDonationAmount('100')}>
                    {donationLink.currency} 100
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
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
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="bg-background"
                  />
                </div>
              </div>
            </div>


            <Button 
              type="submit" 
              className="w-full text-white" 
              disabled={processing || !donationAmount}
              style={{ 
                background: processing || !donationAmount
                  ? undefined 
                  : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
              }}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Proceed to Checkout${donationAmount ? ` - ${donationLink.currency} ${parseFloat(donationAmount).toFixed(2)}` : ''}`
              )}
            </Button>
          </form>

          {/* Footer */}
          {invoiceSettings?.invoice_footer && (
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              {invoiceSettings.invoice_footer}
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Secured by NardoPay • Your donation is encrypted and secure
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
