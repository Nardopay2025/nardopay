import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { PaymentDetailsForm } from '@/components/checkout/PaymentDetailsForm';
import { processPayment, PaymentMethod, LinkType } from '@/lib/paymentRouter';
import { z } from 'zod';

// Input validation schemas
const customerDetailsSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name contains invalid characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  amount: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 1000000;
    }, { message: "Amount must be a positive number less than 1,000,000" }),
});

export default function CheckoutPage() {
  const { linkType, linkCode } = useParams<{ linkType: string; linkCode: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [linkData, setLinkData] = useState<any>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<any>(null);
  const [merchantCountry, setMerchantCountry] = useState<string>('KE');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Get and validate customer details from URL params
  const rawCustomerName = searchParams.get('name') || '';
  const rawCustomerEmail = searchParams.get('email') || '';
  const rawDonationAmount = searchParams.get('amount') || '';

  // Validate customer inputs
  const validateCustomerInputs = () => {
    try {
      customerDetailsSchema.parse({
        name: rawCustomerName,
        email: rawCustomerEmail,
        amount: rawDonationAmount,
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Invalid Input',
          description: firstError.message,
          variant: 'destructive',
        });
      }
      return false;
    }
  };

  // Sanitized values
  const customerName = rawCustomerName.trim().slice(0, 100);
  const customerEmail = rawCustomerEmail.trim().toLowerCase().slice(0, 255);
  const donationAmount = rawDonationAmount;

  useEffect(() => {
    if (linkCode && linkType) {
      fetchLinkData();
    }
  }, [linkCode, linkType]);

  const fetchLinkData = async () => {
    try {
      let tableName = '';
      
      switch (linkType) {
        case 'pay':
          tableName = 'payment_links';
          break;
        case 'donate':
          tableName = 'donation_links';
          break;
        case 'catalogue':
        case 'shop':
          tableName = 'catalogues';
          break;
        case 'subscribe':
          tableName = 'subscription_links';
          break;
        default:
          throw new Error('Invalid link type');
      }

      const { data: linkDataResult, error } = await supabase
        .from(tableName as any)
        .select('*')
        .eq('link_code', linkCode)
        .limit(1)
        .single();

      if (error) throw error;

      if (!linkDataResult) {
        navigate('/404');
        return;
      }

      setLinkData(linkDataResult);

      // Fetch merchant profile for branding and country (using safe_profiles view)
      const userId = (linkDataResult as any).user_id;
      if (userId) {
        const { data: profileData } = await supabase
          .from('safe_profiles')
          .select('country, business_name, business_address, logo_url, primary_color, secondary_color')
          .eq('id', userId)
          .single();

        if (profileData) {
          setMerchantCountry(profileData.country || 'KE');
          setInvoiceSettings({
            business_name: profileData.business_name || 'NardoPay',
            business_address: profileData.business_address || '',
            logo_url: profileData.logo_url || '',
            primary_color: profileData.primary_color || '#0EA5E9',
            secondary_color: profileData.secondary_color || '#0284C7',
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching link data:', error);
      toast({
        title: 'Error',
        description: 'Payment link not found',
        variant: 'destructive',
      });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const getAmount = () => {
    if (linkType === 'donate' && donationAmount) {
      const amount = parseFloat(donationAmount);
      // Validate amount is positive and reasonable
      if (isNaN(amount) || amount <= 0 || amount > 1000000) {
        return 0;
      }
      return amount;
    }
    if (linkData?.amount) {
      return parseFloat(linkData.amount);
    }
    return 0;
  };

  const handlePaymentSubmit = async (paymentDetails: any) => {
    // Validate customer inputs before processing
    if (!validateCustomerInputs()) {
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (paymentDetails.phoneNumber && !phoneRegex.test(paymentDetails.phoneNumber)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      // Map link type to payment router format
      let routerLinkType: LinkType = 'payment';
      switch (linkType) {
        case 'pay':
          routerLinkType = 'payment';
          break;
        case 'donate':
          routerLinkType = 'donation';
          break;
        case 'catalogue':
        case 'shop':
          routerLinkType = 'catalogue';
          break;
        case 'subscribe':
          routerLinkType = 'subscription';
          break;
      }

      const result = await processPayment({
        linkType: routerLinkType,
        linkCode: linkCode!,
        paymentMethod: selectedMethod!,
        merchantCountry,
        customerDetails: {
          name: customerName,
          email: customerEmail,
          phone: paymentDetails.phoneNumber,
        },
        donationAmount: linkType === 'donate' ? donationAmount : undefined,
        cardDetails: paymentDetails.cardDetails,
      });

      if (result.success && result.redirect_url) {
        setPaymentUrl(result.redirect_url);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Extract user-friendly error message
      let errorMessage = 'Failed to process payment';
      let errorTitle = 'Payment Failed';
      
      if (error.message) {
        if (error.message.includes('COUNTRY_NOT_SUPPORTED')) {
          errorTitle = 'Country Not Supported';
          // Extract the country-specific message after the colon
          errorMessage = error.message.split(':')[1]?.trim() || 'This payment method is not available in your region. Please contact support.';
        } else if (error.message.includes('INVALID_INPUT')) {
          errorMessage = 'Please check your payment details and try again';
        } else if (error.message.includes('invalid_api_credentials')) {
          errorMessage = 'Payment service temporarily unavailable. Please contact support.';
        } else if (error.message.includes('Invalid Access Token')) {
          errorMessage = 'Payment service configuration error. Please contact merchant.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
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
  const amount = getAmount();
  const currency = linkData?.currency || 'KES';

  // Show payment iframe if we have the URL
  if (paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div
          className="p-6 text-white shadow-xl relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
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
                <div className="text-white/80 text-sm mb-1">
                  Payment #{linkCode?.slice(0, 8).toUpperCase()}
                </div>
                <div className="text-2xl font-bold">
                  {currency} {amount.toFixed(2)}
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
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Powered by NardoPay
              </div>
              <div className="text-xs text-muted-foreground">Encrypted & Secure Payment</div>
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="overflow-hidden border-border">
          {/* Header */}
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
                <p className="text-white/80 text-sm uppercase">{linkType}</p>
                <p className="text-xl font-bold">#{linkCode?.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            {/* Payment Method Selection */}
            {!selectedMethod && (
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
                merchantCountry={merchantCountry}
                primaryColor={primaryColor}
              />
            )}

            {/* Payment Details Form */}
            {selectedMethod && (
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMethod(null)}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Change payment method
                </Button>

                <PaymentDetailsForm
                  paymentMethod={selectedMethod}
                  amount={amount}
                  currency={currency}
                  onSubmit={handlePaymentSubmit}
                  processing={processing}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
