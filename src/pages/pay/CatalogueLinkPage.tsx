import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Building2, Smartphone, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CatalogueLinkPage() {
  const { linkCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [catalogue, setCatalogue] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'bank'>('mobile');
  const [processing, setProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (linkCode) {
      fetchCatalogue();
    }
  }, [linkCode]);

  const fetchCatalogue = async () => {
    try {
      const { data: catalogueData, error: catalogueError } = await supabase
        .from('catalogues')
        .select('*')
        .eq('link_code', linkCode)
        .limit(1);

      if (catalogueError) throw catalogueError;

      const catalogue = Array.isArray(catalogueData) ? catalogueData[0] : undefined;
      if (!catalogue) {
        navigate('/404');
        return;
      }

      setCatalogue(catalogue);

      // Fetch catalogue items
      const { data: itemsData, error: itemsError } = await supabase
        .from('catalogue_items')
        .select('*')
        .eq('catalogue_id', catalogue.id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

      // Fetch merchant's branding settings
      const { data: profileData } = await supabase
        .from('profiles')
        .select('business_name, business_address, tax_id, invoice_footer, logo_url, primary_color, secondary_color')
        .eq('id', catalogue.user_id)
        .single();

      if (profileData && profileData.business_name) {
        setInvoiceSettings({
          business_name: profileData.business_name || 'NardoPay',
          business_address: profileData.business_address || '',
          tax_id: profileData.tax_id || '',
          invoice_footer: profileData.invoice_footer || '',
          logo_url: profileData.logo_url || '',
          primary_color: profileData.primary_color || '#0EA5E9',
          secondary_color: profileData.secondary_color || '#0284C7',
        });
      } else {
        setInvoiceSettings({
          business_name: 'NardoPay',
          business_address: '',
          tax_id: '',
          invoice_footer: '',
          logo_url: '',
          primary_color: '#0EA5E9',
          secondary_color: '#0284C7',
        });
      }
    } catch (error: any) {
      console.error('Error fetching catalogue:', error);
      toast({ title: 'Error', description: 'Catalogue not found or inactive', variant: 'destructive' });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (itemId: string, quantity: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (quantity <= 0) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = quantity;
      }
      return newCart;
    });
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => {
      const quantity = cart[item.id] || 0;
      return total + (parseFloat(item.price) * quantity);
    }, 0);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(cart).length === 0) {
      toast({ title: 'Empty Cart', description: 'Please add items to your cart', variant: 'destructive' });
      return;
    }

    setProcessing(true);

    try {
      toast({
        title: 'Processing Payment',
        description: 'Redirecting to payment gateway...',
      });

      const cartItems = items
        .filter(item => cart[item.id])
        .map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: cart[item.id],
        }));

      const { data, error } = await supabase.functions.invoke('pesapal-submit-order', {
        body: {
          linkCode,
          linkType: 'catalogue',
          payerName,
          payerEmail,
          paymentMethod,
          cartItems,
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
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to initiate payment',
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

  const primaryColor = invoiceSettings?.primary_color || '#0EA5E9';
  const secondaryColor = invoiceSettings?.secondary_color || '#0284C7';
  const businessName = invoiceSettings?.business_name || 'Business';
  const totalAmount = getTotalAmount();

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
                <div className="text-white/80 text-sm mb-1">Invoice #{linkCode?.slice(0, 8).toUpperCase()}</div>
                <div className="text-2xl font-bold">
                  {catalogue.currency} {totalAmount.toFixed(2)}
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
      <Card className="w-full max-w-4xl overflow-hidden border-border">
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
                <h1 className="text-2xl font-bold mb-2">{businessName}</h1>
              )}
              {invoiceSettings?.business_address && (
                <p className="text-white/80 text-sm">{invoiceSettings.business_address}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">CATALOGUE</p>
              <p className="text-xl font-bold">#{linkCode?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-semibold mb-4">{catalogue.name}</h2>
            {catalogue.description && (
              <p className="text-muted-foreground mb-4">{catalogue.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                  <p className="text-lg font-bold mt-2" style={{ color: primaryColor }}>
                    {catalogue.currency} {parseFloat(item.price).toFixed(2)}
                  </p>
                  {item.stock_quantity !== null && (
                    <p className="text-xs text-muted-foreground">Stock: {item.stock_quantity}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCart(item.id, (cart[item.id] || 0) - 1)}
                    disabled={!cart[item.id]}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{cart[item.id] || 0}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCart(item.id, (cart[item.id] || 0) + 1)}
                    disabled={item.stock_quantity !== null && (cart[item.id] || 0) >= item.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(cart).length > 0 && (
            <form onSubmit={handlePayment} className="space-y-6 border-t border-border pt-6">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span style={{ color: primaryColor }}>
                  {catalogue.currency} {totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
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
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
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
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Proceed to Checkout - {catalogue.currency} {totalAmount.toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          )}

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
