import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatalogue } from '@/contexts/CatalogueContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ShoppingCart, 
  Heart,
  Star,
  Clock,
  Plus,
  Minus,
  CheckCircle,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';
import { useDynamicUrls } from '@/hooks/use-dynamic-urls';

const CataloguePage = () => {
  const { catalogueId } = useParams<{ catalogueId: string }>();
  const navigate = useNavigate();
  const { getCatalogue } = useCatalogue();
  const { invoiceSettings } = useInvoiceSettings();
  const { generateUrl } = useDynamicUrls();
  
  const [catalogueData, setCatalogueData] = useState<any>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolderName: '',
    phone: ''
  });

  const getCurrencySymbol = (currencyCode: string) => {
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'RWF': 'RWF ',
      'ETB': 'ETB ',
      'MAD': 'MAD ',
      'EGP': 'EGP ',
      'XOF': 'CFA ',
      'XAF': 'CFA ',
      'BIF': 'BIF ',
      'CDF': 'CDF ',
      'MWK': 'MWK ',
      'ZMW': 'ZMW ',
      'BWP': 'BWP ',
      'NAD': 'NAD ',
      'LSL': 'LSL ',
      'SZL': 'SZL ',
      'MUR': 'MUR ',
      'SCR': 'SCR ',
      'MGA': 'MGA ',
      'KMF': 'KMF ',
      'DJF': 'DJF ',
      'SOS': 'SOS ',
      'SDG': 'SDG ',
      'SSP': 'SSP ',
      'LYD': 'LYD ',
      'TND': 'TND ',
      'DZD': 'DZD ',
      'MRO': 'MRO ',
      'GMD': 'GMD ',
      'GNF': 'GNF ',
      'SLL': 'SLL ',
      'LRD': 'LRD ',
      'STD': 'STD ',
      'CVE': 'CVE ',
      'AOA': 'AOA ',
      'MZN': 'MZN '
    };
    return currencySymbols[currencyCode] || currencyCode + ' ';
  };

  const formatAmount = (amount: number, currencyCode: string) => {
    const currencySymbol = getCurrencySymbol(currencyCode);
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  // Generate mock data for any catalogue ID (for testing purposes)
  const generateMockData = (id: string) => {
    // Try to get the actual catalogue data first
    const actualCatalogue = getCatalogue(id);
    if (actualCatalogue) {
      return {
        id: actualCatalogue.id,
        title: actualCatalogue.title,
        description: actualCatalogue.description,
        currency: actualCatalogue.currency,
        items: actualCatalogue.items,
        status: actualCatalogue.status || 'ACTIVE'
      };
    }

    // Fallback to default mock data
    return {
      id: id,
      title: 'Premium Products Collection',
      description: 'Discover our curated collection of high-quality products designed to enhance your lifestyle.',
      currency: 'USD',
      items: [
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 199.99,
          currency: 'USD',
          inStock: true
        },
        {
          id: '2',
          name: 'Smart Fitness Watch',
          description: 'Advanced fitness tracking with heart rate monitoring',
          price: 299.99,
          currency: 'USD',
          inStock: true
        },
        {
          id: '3',
          name: 'Portable Power Bank',
          description: '10000mAh fast charging power bank',
          price: 49.99,
          currency: 'USD',
          inStock: true
        }
      ],
      status: 'ACTIVE'
    };
  };

  useEffect(() => {
    if (catalogueId) {
      const data = generateMockData(catalogueId);
      setCatalogueData(data);
    }
  }, [catalogueId, getCatalogue]);

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    if (!catalogueData) return 0;
    return catalogueData.items.reduce((total: number, item: any) => {
      const quantity = cart[item.id] || 0;
      return total + (item.price * quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total: number, quantity: number) => total + quantity, 0);
  };

  const handlePaymentMethodSelect = (method: 'card' | 'mobile') => {
    setPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    const total = getCartTotal();
    if (total <= 0) return;

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = 'https://example.com/success';
      }, 2000);
    }, 2000);
  };

  if (!catalogueData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-400">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          </div>
          <div className="text-sm text-gray-500">
            Redirecting to success page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {invoiceSettings.customLogo && invoiceSettings.logoUrl ? (
              <img
                src={invoiceSettings.logoUrl}
                alt={invoiceSettings.businessName}
                className="w-6 h-6 object-contain"
              />
            ) : (
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: invoiceSettings.primaryColor }}
              >
                <span className="text-white font-bold text-xs">
                  {(invoiceSettings.businessName || 'N').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span
              className="font-semibold text-white text-sm"
              style={{ color: invoiceSettings.primaryColor }}
            >
              {invoiceSettings.businessName || 'Nardopay'}
            </span>
          </div>
          <h1 className="text-lg font-bold text-white mb-1">Product Catalogue</h1>
          <p className="text-gray-400 text-xs">Secure shopping powered by {invoiceSettings.businessName || 'Nardopay'}</p>
        </div>

        {/* Catalogue Info */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardContent className="p-4">
            <div className="text-xs font-bold text-white mb-2">Catalogue</div>
            <div className="space-y-3">
              <div>
                <div className="text-white text-sm font-medium">
                  {catalogueData.title}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {catalogueData.description}
                </div>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Products</span>
                <span className="text-white font-medium">{catalogueData.items.length} items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Product Selection */}
        {currentStep === 1 && (
          <>
            {/* Products List */}
            <div className="space-y-3 mb-4">
              {catalogueData.items.map((item: any) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{item.name}</div>
                        <div className="text-gray-400 text-xs mt-1">{item.description}</div>
                        <div className="text-white font-bold text-sm mt-2">
                          {formatAmount(item.price, catalogueData.currency)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                          disabled={!cart[item.id]}
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </button>
                        <span className="text-white text-sm min-w-[20px] text-center">
                          {cart[item.id] || 0}
                        </span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            {getCartItemCount() > 0 && (
              <Card className="bg-gray-800 border-gray-700 mb-4">
                <CardContent className="p-4">
                  <div className="text-xs font-bold text-white mb-2">Order Summary</div>
                  <div className="space-y-2">
                    {catalogueData.items.map((item: any) => {
                      const quantity = cart[item.id] || 0;
                      if (quantity === 0) return null;
                      return (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="text-gray-400">{item.name} x{quantity}</span>
                          <span className="text-white">{formatAmount(item.price * quantity, catalogueData.currency)}</span>
                        </div>
                      );
                    })}
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-white">{formatAmount(getCartTotal(), catalogueData.currency)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors"
                disabled={getCartItemCount() === 0}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="text-xs text-gray-300">Card</div>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('mobile')}
                className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors"
                disabled={getCartItemCount() === 0}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="text-xs text-gray-300">Mobile</div>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Payment Details Form */}
        {currentStep === 2 && (
          <>
            <Card className="bg-gray-800 border-gray-700 mb-4">
              <CardContent className="p-4">
                <div className="text-sm font-bold text-white mb-3">
                  {paymentMethod === 'card' ? 'Card Details' : 'Mobile Money Details'}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-xs text-gray-300">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={customerData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        maxLength={19}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry" className="text-xs text-gray-300">Expiry Date *</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={customerData.cardExpiry}
                          onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                          maxLength={5}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv" className="text-xs text-gray-300">CVV *</Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          value={customerData.cardCvv}
                          onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                          maxLength={4}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardHolderName" className="text-xs text-gray-300">Cardholder Name *</Label>
                      <Input
                        id="cardHolderName"
                        placeholder="Name on card"
                        value={customerData.cardHolderName}
                        onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs text-gray-300">Mobile Money Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+250 123 456 789"
                        value={customerData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Checkout Button - Only show on step 2 */}
            <div
              className="p-3 rounded text-center text-white font-medium cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
              }}
              onClick={handlePayment}
            >
              {paymentStatus === 'processing' ? 'Processing...' : `Checkout ${formatAmount(getCartTotal(), catalogueData.currency)}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CataloguePage; 