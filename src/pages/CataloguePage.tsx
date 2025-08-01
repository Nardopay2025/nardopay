import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatalogue } from '@/contexts/CatalogueContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, 
  Heart,
  Star,
  CheckCircle,
  Clock,
  ArrowLeft,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  Globe,
  X
} from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';

const CataloguePage = () => {
  const { catalogueId } = useParams<{ catalogueId: string }>();
  const navigate = useNavigate();
  const { getCatalogue } = useCatalogue();
  const { invoiceSettings } = useInvoiceSettings();
  
  // Helper function to ensure button visibility
  const getButtonStyle = (customColor: string) => {
    return {
      backgroundColor: customColor || '#3B82F6',
      borderColor: customColor || '#3B82F6',
      color: 'white',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    };
  };
  

  
  const [catalogueData, setCatalogueData] = useState<any>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    bankName: '',
    accountNumber: '',
    email: '',
    name: '',
    address: ''
  });

  useEffect(() => {
    if (catalogueId) {
      const catalogue = getCatalogue(catalogueId);
      if (catalogue) {
        setCatalogueData(catalogue);
      } else {
        // Generate mock data for demo purposes
        setCatalogueData({
          id: catalogueId,
          title: 'Fashion Store',
          description: 'Discover the latest trends in fashion. Quality clothing for every occasion.',
          category: 'Fashion',
          items: [
            {
              id: '1',
              name: 'Premium Cotton T-Shirt',
              description: 'High-quality cotton t-shirt with custom design. Available in multiple colors.',
              price: 29.99,
              currency: 'USD',
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
              category: 'Clothing',
              inStock: true
            },
            {
              id: '2',
              name: 'Designer Jeans',
              description: 'Comfortable and stylish jeans perfect for any casual occasion.',
              price: 89.99,
              currency: 'USD',
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
              category: 'Clothing',
              inStock: true
            },
            {
              id: '3',
              name: 'Leather Jacket',
              description: 'Classic leather jacket that never goes out of style.',
              price: 199.99,
              currency: 'USD',
              image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
              category: 'Clothing',
              inStock: false
            },
            {
              id: '4',
              name: 'Running Shoes',
              description: 'Comfortable running shoes for your daily workouts.',
              price: 129.99,
              currency: 'USD',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
              category: 'Footwear',
              inStock: true
            }
          ],
          status: 'ACTIVE',
          createdAt: '2 days ago',
          totalSales: 47,
          totalRevenue: '$3,456.78',
          link: `${getBaseUrl()}/catalogue/${catalogueId}`
        });
      }
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
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = catalogueData.items.find((i: any) => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const handleCheckout = async () => {
    if (getCartItemCount() === 0) return;

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Clear cart after successful payment
      setTimeout(() => {
        setCart({});
        setShowCheckout(false);
        setPaymentStatus('idle');
      }, 3000);
    }, 2000);
  };

  if (!catalogueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                style={{ borderTopColor: invoiceSettings.primaryColor || '#3B82F6' }}
              ></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Loading Catalogue</h3>
            <p className="text-gray-300">Preparing your shopping experience...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: invoiceSettings.primaryColor || '#3B82F6' }}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Order Successful!</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Thank you for your purchase! You'll receive a confirmation email shortly with your order details.
            </p>
            <Button 
              onClick={() => setPaymentStatus('idle')}
              className="px-8 py-3 shadow-lg hover:shadow-xl transition-shadow text-white"
              style={getButtonStyle(invoiceSettings.primaryColor)}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              {invoiceSettings.logoUrl ? (
                <img src={invoiceSettings.logoUrl} alt="Logo" className="w-10 h-10 rounded-lg shadow-sm" />
              ) : (
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  style={{ backgroundColor: invoiceSettings.primaryColor || '#3B82F6' }}
                >
                  {invoiceSettings.businessName?.charAt(0) || 'N'}
                </div>
              )}
              <div>
                <h1 className="font-bold text-xl text-white">
                  {invoiceSettings.businessName || 'Nardopay'}
                </h1>
                <p className="text-sm text-gray-400">Online Store</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Main Content */}
          <div className="w-full">
            {/* Catalogue Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 text-white">
                {catalogueData.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {catalogueData.description}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{catalogueData.items.length} products available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Instant delivery</span>
                </div>
              </div>
            </div>

            {/* Products in Rows */}
            <div className="max-w-4xl mx-auto space-y-6">
              {catalogueData.items.map((item: any) => (
                <Card key={item.id} className="group bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-lg">📷</span>
                              </div>
                              <p className="text-xs">No Image</p>
                            </div>
                          </div>
                        )}
                        {!item.inStock && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                        {item.inStock && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                              In Stock
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-gray-700/90 text-gray-300 px-2 py-1 text-xs border border-gray-600">
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-white">
                              ${item.price}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              {cart[item.id] > 0 && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeFromCart(item.id)}
                                    disabled={!item.inStock}
                                    className="w-8 h-8 p-0 border-gray-600 hover:border-gray-500 text-white"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-lg font-semibold text-white w-8 text-center">
                                    {cart[item.id]}
                                  </span>
                                </>
                              )}
                              <Button
                                onClick={() => addToCart(item.id)}
                                disabled={!item.inStock}
                                size="sm"
                                className="px-6 py-2 shadow-md hover:shadow-lg transition-shadow text-white"
                                style={getButtonStyle(invoiceSettings.primaryColor)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                {cart[item.id] > 0 ? 'Add More' : 'Add to Cart'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Checkout Button */}
        {getCartItemCount() > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={() => setShowCheckout(!showCheckout)}
              className="relative w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 text-white"
              style={getButtonStyle(invoiceSettings.primaryColor)}
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {getCartItemCount()}
              </Badge>
            </Button>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: invoiceSettings.primaryColor || '#3B82F6' }}>
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold">Checkout</div>
                      <div className="text-sm font-normal text-gray-500">Complete your order</div>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Cart Summary */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Order Summary</h4>
                    <Badge className="bg-blue-100 text-blue-700 px-2 py-1">
                      {Object.keys(cart).length} items
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Object.entries(cart).map(([itemId, quantity]) => {
                      const item = catalogueData.items.find((i: any) => i.id === itemId);
                      if (!item) return null;
                      
                      return (
                        <div key={itemId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-400 text-xs">IMG</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                            <p className="text-gray-500 text-xs">Qty: {quantity}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-sm text-gray-900">${(item.price * quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-2xl" style={{ color: invoiceSettings.primaryColor || '#3B82F6' }}>
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: invoiceSettings.primaryColor || '#3B82F6' }}></div>
                    <h4 className="font-semibold text-gray-900">Customer Details</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="customerName" className="text-gray-700 font-medium">Full Name *</Label>
                      <Input
                        id="customerName"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerEmail" className="text-gray-700 font-medium">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerAddress" className="text-gray-700 font-medium">Shipping Address</Label>
                      <Textarea
                        id="customerAddress"
                        placeholder="Enter your shipping address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: invoiceSettings.primaryColor || '#3B82F6' }}></div>
                    <h4 className="font-semibold text-gray-900">Payment Method</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={paymentMethod === 'card' ? "default" : "outline"}
                      onClick={() => setPaymentMethod('card')}
                      className={`h-12 ${paymentMethod === 'card' ? 'shadow-md text-white' : 'border-gray-300 hover:border-gray-400'}`}
                      style={paymentMethod === 'card' ? getButtonStyle(invoiceSettings.primaryColor) : {}}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Card
                    </Button>
                    <Button
                      variant={paymentMethod === 'mobile' ? "default" : "outline"}
                      onClick={() => setPaymentMethod('mobile')}
                      className={`h-12 ${paymentMethod === 'mobile' ? 'shadow-md text-white' : 'border-gray-300 hover:border-gray-400'}`}
                      style={paymentMethod === 'mobile' ? getButtonStyle(invoiceSettings.primaryColor) : {}}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Mobile
                    </Button>
                    <Button
                      variant={paymentMethod === 'bank' ? "default" : "outline"}
                      onClick={() => setPaymentMethod('bank')}
                      className={`h-12 ${paymentMethod === 'bank' ? 'shadow-md text-white' : 'border-gray-300 hover:border-gray-400'}`}
                      style={paymentMethod === 'bank' ? getButtonStyle(invoiceSettings.primaryColor) : {}}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Bank
                    </Button>
                  </div>
                </div>

                {/* Payment Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="cardNumber" className="text-gray-700 font-medium">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                          className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate" className="text-gray-700 font-medium">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                          className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-700 font-medium">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+1234567890"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label htmlFor="bankName" className="text-gray-700 font-medium">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="Enter bank name"
                        value={formData.bankName}
                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber" className="text-gray-700 font-medium">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter account number"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={paymentStatus === 'processing' || !formData.name || !formData.email}
                  className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow text-white"
                  style={getButtonStyle(invoiceSettings.primaryColor)}
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ${getCartTotal().toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CataloguePage; 