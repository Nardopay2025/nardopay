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
  Clock,
  Plus,
  Minus
} from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';
import { useDynamicUrls } from '@/hooks/use-dynamic-urls';

const CataloguePage = () => {
  const { catalogueId } = useParams<{ catalogueId: string }>();
  const navigate = useNavigate();
  const { getCatalogue } = useCatalogue();
  const { invoiceSettings } = useInvoiceSettings();
  const { generateUrl } = useDynamicUrls();
  
  // Helper function to ensure button visibility
  const getButtonStyle = (customColor: string) => {
    return {
      backgroundColor: customColor || '#3B82F6',
      borderColor: customColor || '#3B82F6',
      color: 'white',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    };
  };

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
  

  
  const [catalogueData, setCatalogueData] = useState<any>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});

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
          currency: 'RWF',
          items: [
            {
              id: '1',
              name: 'Premium Cotton T-Shirt',
              description: 'High-quality cotton t-shirt with custom design. Available in multiple colors.',
              price: 29990,
              currency: 'RWF',
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
              inStock: true
            },
            {
              id: '2',
              name: 'Designer Jeans',
              description: 'Comfortable and stylish jeans perfect for any casual occasion.',
              price: 89990,
              currency: 'RWF',
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
              inStock: true
            },
            {
              id: '3',
              name: 'Leather Jacket',
              description: 'Classic leather jacket that never goes out of style.',
              price: 199990,
              currency: 'RWF',
              image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
              inStock: false
            },
            {
              id: '4',
              name: 'Running Shoes',
              description: 'Comfortable running shoes for your daily workouts.',
              price: 129990,
              currency: 'RWF',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
              inStock: true
            }
          ],
          status: 'ACTIVE',
          createdAt: '2 days ago',
          totalSales: 47,
          totalRevenue: 'RWF 3,456,780',
          link: generateUrl(`/catalogue/${catalogueId}`)
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
                              {formatAmount(item.price, item.currency)}
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
              onClick={() => navigate(`/catalogue/${catalogueId}/checkout`, { state: { cart, catalogueData } })}
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


      </div>
    </div>
  );
};

export default CataloguePage; 