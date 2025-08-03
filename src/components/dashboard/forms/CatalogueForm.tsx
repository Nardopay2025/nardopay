import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, ExternalLink, Trash2, Pause, Play, ShoppingBag, Plus, Package, DollarSign } from 'lucide-react';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { useCatalogue } from '@/contexts/CatalogueContext';

interface CatalogueFormProps {
  createdCatalogues: any[];
  setCreatedCatalogues: (catalogues: any[]) => void;
  setActiveTab: (tab: string) => void;
}

interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  inStock: boolean;
}

export const CatalogueForm = ({ 
  createdCatalogues, 
  setCreatedCatalogues, 
  setActiveTab 
}: CatalogueFormProps) => {
  const { invoiceSettings } = useInvoiceSettings();
  const { addCatalogue } = useCatalogue();
  
  const [catalogueFormData, setCatalogueFormData] = useState({
    title: '',
    description: '',
    currency: 'USD'
  });

  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [currentItem, setCurrentItem] = useState<CatalogueItem>({
    id: '',
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    inStock: true
  });

  const handleInputChange = (field: string, value: string) => {
    setCatalogueFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemInputChange = (field: string, value: string | number | boolean) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    if (!currentItem.name || currentItem.price <= 0) return;

    const newItem: CatalogueItem = {
      ...currentItem,
      id: Date.now().toString(),
      currency: catalogueFormData.currency
    };

    setItems(prev => [...prev, newItem]);
    setCurrentItem({
      id: '',
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      inStock: true
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCreateCatalogue = () => {
    if (!catalogueFormData.title || items.length === 0) return;

    const newCatalogue = {
      id: Date.now().toString(),
      title: catalogueFormData.title,
      description: catalogueFormData.description,
      currency: catalogueFormData.currency,
      items: items,
      status: 'active',
      createdAt: new Date().toISOString(),
      totalSales: 0,
      totalRevenue: '0',
      link: `/catalogue/${Date.now()}`
    };

    addCatalogue(newCatalogue);
    setCreatedCatalogues(prev => [...prev, newCatalogue]);
    
    // Reset form
    setCatalogueFormData({
      title: '',
      description: '',
      currency: 'USD'
    });
    setItems([]);
  };

  const copyToClipboard = async (link: string, catalogueId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${link}`);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const deleteCatalogue = (catalogueId: string) => {
    setCreatedCatalogues(prev => prev.filter(catalogue => catalogue.id !== catalogueId));
  };

  const toggleCatalogueStatus = (catalogueId: string) => {
    setCreatedCatalogues(prev => prev.map(catalogue => 
      catalogue.id === catalogueId 
        ? { ...catalogue, status: catalogue.status === 'active' ? 'paused' : 'active' }
        : catalogue
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number) => {
    return `${catalogueFormData.currency} ${amount.toFixed(2)}`;
  };

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveTab('create-link')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catalogue</h1>
          <p className="text-muted-foreground">Create product catalogues for multiple items</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Create Catalogue Form */}
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Create Catalogue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Catalogue Title</Label>
                <Input
                  id="title"
                  placeholder="My Product Collection"
                  value={catalogueFormData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={catalogueFormData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-background text-foreground"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="RWF">RWF - Rwandan Franc</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product collection"
                  value={catalogueFormData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Add Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="itemName">Product Name</Label>
                <Input
                  id="itemName"
                  placeholder="Product name"
                  value={currentItem.name}
                  onChange={(e) => handleItemInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="itemPrice">Price</Label>
                <Input
                  id="itemPrice"
                  type="number"
                  placeholder="29.99"
                  value={currentItem.price}
                  onChange={(e) => handleItemInputChange('price', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="itemDescription">Description</Label>
                <Textarea
                  id="itemDescription"
                  placeholder="Product description"
                  value={currentItem.description}
                  onChange={(e) => handleItemInputChange('description', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={currentItem.inStock}
                  onChange={(e) => handleItemInputChange('inStock', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>

              <Button 
                onClick={addItem}
                disabled={!currentItem.name || currentItem.price <= 0}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>

          {/* Products List */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Products ({items.length})</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Total: {formatAmount(totalValue)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                        <div className="text-sm font-medium text-green-600">
                          {formatAmount(item.price)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.inStock ? "default" : "secondary"}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Catalogue Button - Now at the bottom */}
          <Button 
            onClick={handleCreateCatalogue}
            disabled={!catalogueFormData.title || items.length === 0}
            className="w-full"
          >
            Create Catalogue
          </Button>
        </div>

        {/* Preview */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              <div className="w-full max-w-md">
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
                          {catalogueFormData.title || 'Catalogue Title'}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {catalogueFormData.description || 'Browse our products'}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Products</span>
                        <span className="text-white font-medium">{items.length} items</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Products */}
                {items.slice(0, 2).map((item) => (
                  <Card key={item.id} className="bg-gray-800 border-gray-700 mb-3">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{item.name}</div>
                          <div className="text-gray-400 text-xs mt-1">{item.description}</div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-bold text-sm">
                            {formatAmount(item.price)}
                          </div>
                          <Badge variant={item.inStock ? "default" : "secondary"} className="text-xs">
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {items.length > 2 && (
                  <div className="text-center text-gray-400 text-xs mb-4">
                    +{items.length - 2} more products
                  </div>
                )}

                {/* Browse Button */}
                <div 
                  className="p-3 rounded text-center text-white font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                  }}
                >
                  Browse Products
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Created Catalogues List */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Created Catalogues</h2>
          {createdCatalogues.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm p-6 text-center">
              <p className="text-muted-foreground">No catalogues created yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {createdCatalogues.map((catalogue) => (
                <Card key={catalogue.id} className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{catalogue.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {catalogue.items.length} products • {catalogue.currency}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {catalogue.totalSales} sales
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {catalogue.totalRevenue} revenue
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(catalogue.status)}>
                          {catalogue.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCatalogueStatus(catalogue.id)}
                        >
                          {catalogue.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCatalogue(catalogue.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
                      <Input
                        value={catalogue.link}
                        readOnly
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(catalogue.link, catalogue.id)}
                          className="flex-1 sm:flex-none"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(catalogue.link, '_blank')}
                          className="flex-1 sm:flex-none"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(catalogue.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 