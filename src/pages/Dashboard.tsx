import { useAuth } from '@/contexts/AuthContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { usePaymentLinks } from '@/contexts/PaymentLinksContext';
import { useDonationLinks } from '@/contexts/DonationLinksContext';
import { useSubscriptionLinks } from '@/contexts/SubscriptionLinksContext';
import { useCatalogue } from '@/contexts/CatalogueContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Link2, 
  FileText, 
  CreditCard, 
  Send, 
  Code, 
  Settings, 
  Eye,
  User,
  LogOut,

  Search,
  Download,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Copy,
  ExternalLink,
  DollarSign,
  Smartphone,
  Globe,
  Heart,
  Zap,
  ShoppingBag,
  Plus,
  Trash2,
  PieChart,
  Wallet,
  Users,
  Target,
  PiggyBank,
  Gift,
  RefreshCw,
  TrendingDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBaseUrl } from '@/lib/utils';
import { useDynamicUrls } from '@/hooks/use-dynamic-urls';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { invoiceSettings, updateInvoiceSettings } = useInvoiceSettings();
  const { paymentLinks, addPaymentLink } = usePaymentLinks();
  const { donationLinks, addDonationLink } = useDonationLinks();
  const { subscriptionLinks, addSubscriptionLink } = useSubscriptionLinks();
  const { catalogues, addCatalogue, deleteCatalogue, addItemToCatalogue, removeItemFromCatalogue } = useCatalogue();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [addFundsLink, setAddFundsLink] = useState('https://nardopay.com/add-funds/user123');
  const [copiedAddFundsLink, setCopiedAddFundsLink] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const { generateUrl } = useDynamicUrls();
  
  // Update URLs after component mounts
  useEffect(() => {
    if (generateUrl) {
      // Update payment links
      setCreatedLinks(prev => prev.map(link => ({
        ...link,
        link: link.link.startsWith('/') ? generateUrl(link.link) : link.link
      })));
      
      // Update donation links
      setCreatedDonationLinks(prev => prev.map(link => ({
        ...link,
        link: link.link.startsWith('/') ? generateUrl(link.link) : link.link
      })));
      
      // Update subscription links
      setCreatedSubscriptionLinks(prev => prev.map(link => ({
        ...link,
        link: link.link.startsWith('/') ? generateUrl(link.link) : link.link
      })));
      
      // Update catalogue links
      setCreatedCatalogues(prev => prev.map(catalogue => ({
        ...catalogue,
        link: catalogue.link.startsWith('/') ? generateUrl(catalogue.link) : catalogue.link
      })));
    }
  }, [generateUrl]);
  
  // Payment Links State
  const [linkFormData, setLinkFormData] = useState({
    amount: '',
    currency: 'USD',
    productName: '',
    description: '',
    thankYouMessage: '',
    redirectUrl: ''
  });

  // Donation Links State
  const [donationFormData, setDonationFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    currency: 'USD',
    thankYouMessage: '',
    redirectUrl: ''
  });

  // Subscription Links State
  const [subscriptionFormData, setSubscriptionFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    billingCycle: 'monthly',
    trialDays: 0,
    thankYouMessage: '',
    redirectUrl: ''
  });

  // Send Money State
  const [sendFormData, setSendFormData] = useState({
    recipient: '',
    amount: '',
    currency: 'USD',
    message: ''
  });

  const [transfers, setTransfers] = useState([
    {
      id: '1',
      recipient: 'john@example.com',
      amount: 50.00,
      currency: 'USD',
      message: 'Payment for services',
      status: 'COMPLETED',
      date: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      recipient: '+2508012345678',
      amount: 25.00,
      currency: 'USD',
      message: 'Lunch payment',
      status: 'COMPLETED',
      date: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      recipient: 'sarah@example.com',
      amount: 100.00,
      currency: 'USD',
      message: 'Project payment',
      status: 'COMPLETED',
      date: '2024-01-13T09:15:00Z'
    }
  ]);

  const [sendStatus, setSendStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [sendError, setSendError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [refundStatus, setRefundStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);

  // Catalogue State
  const [catalogueFormData, setCatalogueFormData] = useState({
    title: '',
    description: '',
    currency: 'USD'
  });

  const [catalogueItems, setCatalogueItems] = useState<Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    inStock: boolean;
  }>>([]);

  const [newItemForm, setNewItemForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    inStock: true
  });
  
  const [createdLinks, setCreatedLinks] = useState(paymentLinks.length > 0 ? paymentLinks : [
    {
      id: '1',
      amount: '$100.00',
      currency: 'USD',
      productName: 'Premium T-Shirt',
      description: 'High-quality cotton t-shirt with custom design',
      thankYouMessage: 'Thank you for your purchase!',
      redirectUrl: 'https://my-store.com/success',
      link: '/pay/abc123',
      status: 'ACTIVE',
      createdAt: '2 hours ago',
      payments: 1,
      totalAmount: '$100.00'
    },
    {
      id: '2',
      amount: '$250.00',
      currency: 'USD',
      productName: 'Consultation Service',
      description: 'One-hour business consultation session',
      thankYouMessage: 'Thank you for booking! We\'ll contact you soon.',
      redirectUrl: '',
      link: '/pay/def456',
      status: 'ACTIVE',
      createdAt: '1 day ago',
      payments: 0,
      totalAmount: '$0.00'
    },
    {
      id: '3',
      amount: '$75.00',
      currency: 'USD',
      productName: 'Digital Course',
      description: 'Complete web development course with lifetime access',
      thankYouMessage: 'Welcome to the course! Check your email for access.',
      redirectUrl: 'https://course-platform.com/welcome',
      link: '/pay/ghi789',
      status: 'EXPIRED',
      createdAt: '3 days ago',
      payments: 2,
      totalAmount: '$150.00'
    }
  ]);
  
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  const [createdDonationLinks, setCreatedDonationLinks] = useState(donationLinks.length > 0 ? donationLinks : [
    {
      id: '1',
      title: 'Help Build a School',
      description: 'We are raising funds to build a new school in rural Kenya. Your donation will help provide education to 200 children who currently walk 5km to the nearest school.',
      goalAmount: '$10,000',
      currency: 'USD',
      thankYouMessage: 'Thank you for your generous donation! Your support will make a real difference in these children\'s lives.',
      redirectUrl: 'https://example.com/thank-you',
      link: '/donate/abc123',
      status: 'ACTIVE',
      createdAt: '1 day ago',
      donations: 47,
      totalAmount: '$7,350',
      goalProgress: 73.5
    },
    {
      id: '2',
      title: 'Medical Supplies for Hospital',
      description: 'Help us provide essential medical supplies to rural hospitals in Tanzania. Every donation helps save lives.',
      goalAmount: '$5,000',
      currency: 'USD',
      thankYouMessage: 'Thank you for helping us provide medical care to those in need!',
      redirectUrl: 'https://example.com/medical-thanks',
      link: '/donate/def456',
      status: 'ACTIVE',
      createdAt: '3 days ago',
      donations: 23,
      totalAmount: '$2,150',
      goalProgress: 43.0
    }
  ]);

  const [createdSubscriptionLinks, setCreatedSubscriptionLinks] = useState(subscriptionLinks.length > 0 ? subscriptionLinks : [
    {
      id: '1',
      title: 'Premium Membership',
      description: 'Get access to exclusive content, priority support, and advanced features. Cancel anytime.',
      amount: '$29.99',
      currency: 'USD',
      billingCycle: 'monthly',
      trialDays: 7,
      thankYouMessage: 'Welcome to Premium! Your subscription is now active. You\'ll receive a confirmation email shortly.',
      redirectUrl: 'https://example.com/welcome',
      link: '/subscribe/abc123',
      status: 'ACTIVE',
      createdAt: '2 days ago',
      subscribers: 156,
      totalRevenue: '$4,678.44',
      nextBillingDate: 'September 15, 2024'
    },
    {
      id: '2',
      title: 'Pro Plan',
      description: 'Advanced features for power users. Includes API access, custom integrations, and dedicated support.',
      amount: '$99.99',
      currency: 'USD',
      billingCycle: 'monthly',
      trialDays: 14,
      thankYouMessage: 'Welcome to Pro! You now have access to all advanced features.',
      redirectUrl: 'https://example.com/pro-welcome',
      link: '/subscribe/def456',
      status: 'ACTIVE',
      createdAt: '1 week ago',
      subscribers: 42,
      totalRevenue: '$4,199.58',
      nextBillingDate: 'September 10, 2024'
    }
  ]);

  const [createdCatalogues, setCreatedCatalogues] = useState(catalogues.length > 0 ? catalogues : [
    {
      id: '1',
      title: 'Fashion Store',
      description: 'Discover the latest trends in fashion. Quality clothing for every occasion.',
      category: 'Fashion',
      items: [
        {
          id: '1',
          name: 'Premium Cotton T-Shirt',
          description: 'High-quality cotton t-shirt with custom design.',
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
        }
      ],
      status: 'ACTIVE',
      createdAt: '2 days ago',
      totalSales: 47,
      totalRevenue: '$3,456.78',
      link: '/catalogue/abc123'
    },
    {
      id: '2',
      title: 'Electronics Store',
      description: 'Latest gadgets and electronics for tech enthusiasts.',
      category: 'Electronics',
      items: [
        {
          id: '3',
          name: 'Wireless Headphones',
          description: 'Premium wireless headphones with noise cancellation.',
          price: 199.99,
          currency: 'USD',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
          category: 'Audio',
          inStock: true
        }
      ],
      status: 'ACTIVE',
      createdAt: '1 week ago',
      totalSales: 23,
      totalRevenue: '$1,234.56',
      link: '/catalogue/def456'
    }
  ]);
  

  
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
    { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
    { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
    { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$" },
    { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
    { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
    { code: "MAD", name: "Moroccan Dirham", symbol: "MAD" },
    { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
    { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
    { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" },
    { code: "BIF", name: "Burundian Franc", symbol: "FBu" },
    { code: "CDF", name: "Congolese Franc", symbol: "FC" },
    { code: "MWK", name: "Malawian Kwacha", symbol: "MK" },
    { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
    { code: "BWP", name: "Botswana Pula", symbol: "P" },
    { code: "NAD", name: "Namibian Dollar", symbol: "N$" },
    { code: "LSL", name: "Lesotho Loti", symbol: "L" },
    { code: "SZL", name: "Eswatini Lilangeni", symbol: "E" },
    { code: "MUR", name: "Mauritian Rupee", symbol: "₨" },
    { code: "SCR", name: "Seychellois Rupee", symbol: "₨" },
    { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" },
    { code: "KMF", name: "Comorian Franc", symbol: "CF" },
    { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj" },
    { code: "SOS", name: "Somali Shilling", symbol: "Sh.So." },
    { code: "SDG", name: "Sudanese Pound", symbol: "ج.س." },
    { code: "SSP", name: "South Sudanese Pound", symbol: "SSP" },
    { code: "LYD", name: "Libyan Dinar", symbol: "ل.د" },
    { code: "TND", name: "Tunisian Dinar", symbol: "د.ت" },
    { code: "DZD", name: "Algerian Dinar", symbol: "د.ج" },
    { code: "MRO", name: "Mauritanian Ouguiya", symbol: "UM" },
    { code: "GMD", name: "Gambian Dalasi", symbol: "D" },
    { code: "GNF", name: "Guinean Franc", symbol: "FG" },
    { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le" },
    { code: "LRD", name: "Liberian Dollar", symbol: "L$" },
    { code: "STD", name: "São Tomé and Príncipe Dobra", symbol: "Db" },
    { code: "CVE", name: "Cape Verdean Escudo", symbol: "Esc" },
    { code: "AOA", name: "Angolan Kwanza", symbol: "Kz" },
    { code: "MZN", name: "Mozambican Metical", symbol: "MT" }
  ];

  // Payment Link Functions
  const handleLinkInputChange = (field: string, value: string) => {
    setLinkFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Donation Link Functions
  const handleDonationInputChange = (field: string, value: string) => {
    setDonationFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Subscription Link Functions
  const handleSubscriptionInputChange = (field: string, value: string) => {
    setSubscriptionFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Catalogue Functions
  const handleSendInputChange = (field: string, value: string) => {
    setSendFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (sendError) {
      setSendError('');
    }
  };

  const handleCatalogueInputChange = (field: string, value: string) => {
    setCatalogueFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewItemInputChange = (field: string, value: string | boolean) => {
    setNewItemForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItemToCatalogueForm = () => {
    if (!newItemForm.name || !newItemForm.price) return;
    
    const newItem = {
      id: Math.random().toString(36).substring(2, 15),
      name: newItemForm.name,
      description: newItemForm.description,
      price: parseFloat(newItemForm.price),
      currency: catalogueFormData.currency,
      image: newItemForm.image,
      inStock: newItemForm.inStock
    };
    
    setCatalogueItems(prev => [...prev, newItem]);
    
    // Reset form
    setNewItemForm({
      name: '',
      description: '',
      price: '',
      image: '',
      inStock: true
    });
  };

  const removeItemFromCatalogueForm = (itemId: string) => {
    setCatalogueItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCreateLink = () => {
    if (!linkFormData.amount || !linkFormData.productName) return;
    
    const linkId = Math.random().toString(36).substring(2, 15);
    const newLink = {
      id: linkId,
      amount: `${currencies.find(c => c.code === linkFormData.currency)?.symbol}${linkFormData.amount}`,
      currency: linkFormData.currency,
      productName: linkFormData.productName,
      description: linkFormData.description,
      thankYouMessage: linkFormData.thankYouMessage,
      redirectUrl: linkFormData.redirectUrl,
      link: generateUrl(`/pay/${linkId}`),
      status: 'ACTIVE',
      createdAt: 'Just now',
      payments: 0,
      totalAmount: '$0.00'
    };
    
    setCreatedLinks(prev => [newLink, ...prev]);
    addPaymentLink(newLink);
    
    // Reset form
    setLinkFormData({
      amount: '',
      currency: 'USD',
      productName: '',
      description: '',
      thankYouMessage: '',
      redirectUrl: ''
    });
  };

  const handleCreateDonationLink = () => {
    if (!donationFormData.title || !donationFormData.goalAmount) return;
    
    const linkId = Math.random().toString(36).substring(2, 15);
    const newDonationLink = {
      id: linkId,
      title: donationFormData.title,
      description: donationFormData.description,
      goalAmount: `${currencies.find(c => c.code === donationFormData.currency)?.symbol}${donationFormData.goalAmount}`,
      currency: donationFormData.currency,
      thankYouMessage: donationFormData.thankYouMessage,
      redirectUrl: donationFormData.redirectUrl,
      link: generateUrl(`/donate/${linkId}`),
      status: 'ACTIVE',
      createdAt: 'Just now',
      donations: 0,
      totalAmount: '$0.00',
      goalProgress: 0
    };
    
    setCreatedDonationLinks(prev => [newDonationLink, ...prev]);
    addDonationLink(newDonationLink);
    
    // Reset form
    setDonationFormData({
      title: '',
      description: '',
      goalAmount: '',
      currency: 'USD',
      thankYouMessage: '',
      redirectUrl: ''
    });
  };

  const handleCreateSubscriptionLink = () => {
    if (!subscriptionFormData.title || !subscriptionFormData.amount) return;
    
    const linkId = Math.random().toString(36).substring(2, 15);
    const newSubscriptionLink = {
      id: linkId,
      title: subscriptionFormData.title,
      description: subscriptionFormData.description,
      amount: `${currencies.find(c => c.code === subscriptionFormData.currency)?.symbol}${subscriptionFormData.amount}`,
      currency: subscriptionFormData.currency,
      billingCycle: subscriptionFormData.billingCycle as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
      trialDays: parseInt(subscriptionFormData.trialDays.toString()),
      thankYouMessage: subscriptionFormData.thankYouMessage,
      redirectUrl: subscriptionFormData.redirectUrl,
      link: generateUrl(`/subscribe/${linkId}`),
      status: 'ACTIVE',
      createdAt: 'Just now',
      subscribers: 0,
      totalRevenue: '$0.00',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    setCreatedSubscriptionLinks(prev => [newSubscriptionLink, ...prev]);
    addSubscriptionLink(newSubscriptionLink);
    
    // Reset form
    setSubscriptionFormData({
      title: '',
      description: '',
      amount: '',
      currency: 'USD',
      billingCycle: 'monthly',
      trialDays: 0,
      thankYouMessage: '',
      redirectUrl: ''
    });
  };

  const handleSendMoney = async () => {
    // Validate required fields
    if (!sendFormData.recipient || !sendFormData.amount || parseFloat(sendFormData.amount) <= 0) {
      setSendError('Please enter a valid email or phone number and amount');
      return;
    }

    setSendStatus('processing');
    setSendError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create new transfer
      const newTransfer = {
        id: Date.now().toString(),
        recipient: sendFormData.recipient,
        amount: parseFloat(sendFormData.amount),
        currency: sendFormData.currency,
        message: sendFormData.message,
        status: 'COMPLETED',
        date: new Date().toISOString()
      };

      // Add to transfers list
      setTransfers(prev => [newTransfer, ...prev]);

      // Reset form
      setSendFormData({
        recipient: '',
        amount: '',
        currency: 'USD',
        message: ''
      });

      setSendStatus('success');

      // Reset success status after 3 seconds
      setTimeout(() => {
        setSendStatus('idle');
      }, 3000);

    } catch (error) {
      setSendStatus('error');
      setSendError('Transfer failed. Please try again.');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSendStatus('idle');
        setSendError('');
      }, 5000);
    }
  };

  const handleRefund = async (paymentId: number) => {
    setRefundStatus('processing');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment data to mark as refunded
      const updatedPaymentData = paymentData.map(payment => 
        payment.id === paymentId 
          ? { ...payment, refunded: true, status: 'REFUNDED' }
          : payment
      );
      
      // In a real app, you'd update the state here
      // For now, we'll just show success
      setRefundStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setRefundStatus('idle');
        setShowPaymentDetails(false);
      }, 3000);
      
    } catch (error) {
      setRefundStatus('error');
      setTimeout(() => {
        setRefundStatus('idle');
      }, 3000);
    }
  };

  const handleCreateCatalogue = () => {
    if (!catalogueFormData.title || catalogueItems.length === 0) return;
    
    const catalogueId = Math.random().toString(36).substring(2, 15);
    const newCatalogue = {
      id: catalogueId,
      title: catalogueFormData.title,
      description: catalogueFormData.description,
      currency: catalogueFormData.currency,
      items: catalogueItems,
      status: 'ACTIVE',
      createdAt: 'Just now',
      totalSales: 0,
      totalRevenue: '$0.00',
      link: generateUrl(`/catalogue/${catalogueId}`)
    };
    
    setCreatedCatalogues(prev => [newCatalogue, ...prev]);
    addCatalogue(newCatalogue);
    
    // Reset forms
    setCatalogueFormData({
      title: '',
      description: '',
      currency: 'USD'
    });
    setCatalogueItems([]);
  };

  const copyToClipboard = async (link: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyAddFundsLink = async () => {
    try {
      await navigator.clipboard.writeText(addFundsLink);
      setCopiedAddFundsLink(true);
      setTimeout(() => setCopiedAddFundsLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy add funds link: ', err);
    }
  };

  // Transaction History Data
  const transactionHistory = [
    // Payments
    { id: '1', type: 'payment', category: 'payments', amount: 100.00, description: 'Premium T-Shirt Purchase', clientEmail: 'john.smith@example.com', date: '2024-08-15T10:30:00Z', status: 'completed', direction: 'in' },
    { id: '2', type: 'payment', category: 'payments', amount: 250.00, description: 'Consultation Service', clientEmail: 'sarah.j@example.com', date: '2024-08-15T14:20:00Z', status: 'completed', direction: 'in' },
    { id: '3', type: 'payment', category: 'payments', amount: 75.00, description: 'Digital Course', clientEmail: 'mike.brown@example.com', date: '2024-08-14T09:15:00Z', status: 'completed', direction: 'in' },
    
    // Subscriptions
    { id: '4', type: 'subscription', category: 'subscriptions', amount: 29.99, description: 'Premium Membership', clientEmail: 'emily.davis@example.com', date: '2024-08-15T08:00:00Z', status: 'completed', direction: 'in' },
    { id: '5', type: 'subscription', category: 'subscriptions', amount: 99.99, description: 'Pro Plan', clientEmail: 'david.wilson@example.com', date: '2024-08-14T08:00:00Z', status: 'completed', direction: 'in' },
    
    // Donations
    { id: '6', type: 'donation', category: 'donations', amount: 50.00, description: 'Help Build a School', clientEmail: 'alice.johnson@example.com', date: '2024-08-15T12:00:00Z', status: 'completed', direction: 'in' },
    { id: '7', type: 'donation', category: 'donations', amount: 25.00, description: 'Medical Supplies Fund', clientEmail: 'bob.miller@example.com', date: '2024-08-14T15:30:00Z', status: 'completed', direction: 'in' },
    
    // Funds Added
    { id: '8', type: 'funds-added', category: 'funds-added', amount: 500.00, description: 'Funds added via link', clientEmail: 'friend@example.com', date: '2024-08-15T16:00:00Z', status: 'completed', direction: 'in' },
    { id: '9', type: 'funds-added', category: 'funds-added', amount: 1000.00, description: 'Bank transfer', clientEmail: 'family@example.com', date: '2024-08-14T11:00:00Z', status: 'completed', direction: 'in' },
    
    // Withdrawals
    { id: '10', type: 'withdrawal', category: 'withdrawals', amount: 200.00, description: 'Bank withdrawal', clientEmail: null, date: '2024-08-15T09:00:00Z', status: 'completed', direction: 'out' },
    { id: '11', type: 'withdrawal', category: 'withdrawals', amount: 150.00, description: 'ATM withdrawal', clientEmail: null, date: '2024-08-13T14:00:00Z', status: 'completed', direction: 'out' },
    
    // Transfers (Send)
    { id: '12', type: 'transfer', category: 'transfers', amount: 50.00, description: 'Sent to john@example.com', clientEmail: 'john@example.com', date: '2024-08-15T13:00:00Z', status: 'completed', direction: 'out' },
    { id: '13', type: 'transfer', category: 'transfers', amount: 25.00, description: 'Sent to +2508012345678', clientEmail: '+2508012345678', date: '2024-08-14T10:00:00Z', status: 'completed', direction: 'out' },
    
    // Direct Pay (Withdrawal to others)
    { id: '14', type: 'direct-pay', category: 'direct-pay', amount: 75.00, description: 'Direct payment to Sarah', clientEmail: 'sarah@example.com', date: '2024-08-15T17:00:00Z', status: 'completed', direction: 'out' },
    { id: '15', type: 'direct-pay', category: 'direct-pay', amount: 120.00, description: 'Direct payment to Mike', clientEmail: 'mike@example.com', date: '2024-08-13T16:00:00Z', status: 'completed', direction: 'out' },
  ];

  // Filter transactions based on selected filter and search
  const filteredTransactions = transactionHistory.filter(transaction => {
    const matchesFilter = historyFilter === 'all' || transaction.category === historyFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(historySearch.toLowerCase()) ||
                         transaction.amount.toString().includes(historySearch) ||
                         (transaction.clientEmail && transaction.clientEmail.toLowerCase().includes(historySearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Get transaction type info
  const getTransactionInfo = (category: string) => {
    switch (category) {
      case 'payments':
        return { icon: CreditCard, color: 'bg-blue-100 text-blue-600', label: 'Payment' };
      case 'subscriptions':
        return { icon: Zap, color: 'bg-yellow-100 text-yellow-600', label: 'Subscription' };
      case 'donations':
        return { icon: Heart, color: 'bg-red-100 text-red-600', label: 'Donation' };
      case 'funds-added':
        return { icon: Plus, color: 'bg-green-100 text-green-600', label: 'Funds Added' };
      case 'withdrawals':
        return { icon: Send, color: 'bg-purple-100 text-purple-600', label: 'Withdrawal' };
      case 'transfers':
        return { icon: ArrowRight, color: 'bg-orange-100 text-orange-600', label: 'Transfer' };
      case 'direct-pay':
        return { icon: Zap, color: 'bg-indigo-100 text-indigo-600', label: 'Direct Pay' };
      default:
        return { icon: CreditCard, color: 'bg-gray-100 text-gray-600', label: 'Transaction' };
    }
  };

  const deleteLink = (linkId: string, linkType: 'payment' | 'donation' | 'subscription' | 'catalogue') => {
    switch (linkType) {
      case 'payment':
        setCreatedLinks(prev => prev.filter(link => link.id !== linkId));
        break;
      case 'donation':
        setCreatedDonationLinks(prev => prev.filter(link => link.id !== linkId));
        break;
      case 'subscription':
        setCreatedSubscriptionLinks(prev => prev.filter(link => link.id !== linkId));
        break;
      case 'catalogue':
        setCreatedCatalogues(prev => prev.filter(catalogue => catalogue.id !== linkId));
        break;
    }
  };

  const toggleLinkStatus = (linkId: string, linkType: 'payment' | 'donation' | 'subscription' | 'catalogue') => {
    switch (linkType) {
      case 'payment':
        setCreatedLinks(prev => prev.map(link => 
          link.id === linkId 
            ? { ...link, status: link.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
            : link
        ));
        break;
      case 'donation':
        setCreatedDonationLinks(prev => prev.map(link => 
          link.id === linkId 
            ? { ...link, status: link.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
            : link
        ));
        break;
      case 'subscription':
        setCreatedSubscriptionLinks(prev => prev.map(link => 
          link.id === linkId 
            ? { ...link, status: link.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
            : link
        ));
        break;
      case 'catalogue':
        setCreatedCatalogues(prev => prev.map(catalogue => 
          catalogue.id === linkId 
            ? { ...catalogue, status: catalogue.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
            : catalogue
        ));
        break;
    }
  };

  const getLinkStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-success/20 text-green-success border-green-success/30';
      case 'EXPIRED':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'PAUSED':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleInvoiceSettingChange = (field: string, value: string) => {
    updateInvoiceSettings({ [field]: value });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateInvoiceSettings({
          logoUrl: e.target?.result as string,
          customLogo: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create-link', label: 'Create a Link', icon: Plus },
    { id: 'send-money', label: 'Send Money', icon: Send },
    { id: 'make-payment', label: 'Make Payment', icon: CreditCard },
    { id: 'deposit', label: 'Deposit', icon: PiggyBank },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
    { id: 'developers', label: 'Developers', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const paymentData = [
    { 
      id: 1, 
      clientName: 'John Smith',
      clientEmail: 'john.smith@example.com',
      method: 'Credit or debit card', 
      amount: '$100.00', 
      status: 'PAID', 
      description: 'Product Purchase', 
      date: '2024-08-15T10:30:00Z',
      transactionId: 'TXN_001_20240815',
      paymentLink: 'Premium T-Shirt',
      refunded: false
    },
    { 
      id: 2, 
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.j@example.com',
      method: 'Bank Transfer', 
      amount: '$250.00', 
      status: 'PAID', 
      description: 'Service Payment', 
      date: '2024-08-15T14:20:00Z',
      transactionId: 'TXN_002_20240815',
      paymentLink: 'Consultation Service',
      refunded: false
    },
    { 
      id: 3, 
      clientName: 'Michael Brown',
      clientEmail: 'mike.brown@example.com',
      method: 'E-wallet', 
      amount: '$150.00', 
      status: 'PAID', 
      description: 'Subscription', 
      date: '2024-08-14T09:15:00Z',
      transactionId: 'TXN_003_20240814',
      paymentLink: 'Digital Course',
      refunded: false
    },
    { 
      id: 4, 
      clientName: 'Emily Davis',
      clientEmail: 'emily.davis@example.com',
      method: 'Credit or debit card', 
      amount: '$300.00', 
      status: 'PAID', 
      description: 'Product Purchase', 
      date: '2024-08-14T16:45:00Z',
      transactionId: 'TXN_004_20240814',
      paymentLink: 'Premium T-Shirt',
      refunded: true
    },
    { 
      id: 5, 
      clientName: 'David Wilson',
      clientEmail: 'david.wilson@example.com',
      method: 'Mobile Money', 
      amount: '$75.00', 
      status: 'PAID', 
      description: 'Top-up', 
      date: '2024-08-13T11:30:00Z',
      transactionId: 'TXN_005_20240813',
      paymentLink: 'Premium T-Shirt',
      refunded: false
    },
  ];

  const payoutData = [
    { amount: '$1,000.00', bank: 'Chase Bank', account: '•••• 1045', date: 'August 1, 2022', status: 'DEPOSITED' },
    { amount: '$250.00', bank: 'Chase Bank', account: '•••• 1045', date: 'August 1, 2022', status: 'IN TRANSIT' },
    { amount: '$3,000.00', bank: 'Chase Bank', account: '•••• 1045', date: 'August 1, 2022', status: 'DEPOSITED' },
    { amount: '$7,500.00', bank: 'Chase Bank', account: '•••• 1045', date: 'August 1, 2022', status: 'RETURNED' },
    { amount: '$9,150.00', bank: 'Chase Bank', account: '•••• 1045', date: 'August 1, 2022', status: 'ON HOLD' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'DEPOSITED':
        return 'bg-green-success/20 text-green-success border-green-success/30';
      case 'IN TRANSIT':
        return 'bg-blue-primary/20 text-blue-primary border-blue-primary/30';
      case 'ON HOLD':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'RETURNED':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'create-link':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Create a Link</h1>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Payment Links */}
              <Card 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('links')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Link2 className="w-8 h-8 text-blue-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Payment Links</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create secure payment links for products and services. Accept one-time payments from customers worldwide.
                  </p>
                  <Button variant="outline" className="w-full">
                    Create Payment Link
                  </Button>
                </CardContent>
              </Card>

              {/* Donation Links */}
              <Card 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('donations')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Donation Links</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Set up donation campaigns and fundraising pages. Accept contributions from supporters and donors.
                  </p>
                  <Button variant="outline" className="w-full">
                    Create Donation Link
                  </Button>
                </CardContent>
              </Card>

              {/* Subscription Links */}
              <Card 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('subscriptions')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Subscription Links</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create recurring payment links for subscriptions and memberships. Automate billing cycles.
                  </p>
                  <Button variant="outline" className="w-full">
                    Create Subscription Link
                  </Button>
                </CardContent>
              </Card>

              {/* Catalogue */}
              <Card 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('catalogue')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Catalogue</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create product catalogues with multiple items. Let customers browse and purchase from your collection.
                  </p>
                  <Button variant="outline" className="w-full">
                    Create Catalogue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'send-money':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Send Money</h1>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Send to Nardopay Wallet */}
              <Card 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('send')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Wallet className="w-8 h-8 text-blue-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Nardopay Wallet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Send money to other Nardopay users instantly. Transfer funds directly to their Nardopay wallet using email or phone number.
                  </p>
                  <Button variant="outline" className="w-full">
                    Send to Nardopay Wallet
                  </Button>
                </CardContent>
              </Card>

              {/* Send to External Wallet */}
              <Card 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('direct-pay')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">External Wallet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Send money to external wallets and payment methods. Support for bank transfers, mobile money, and other payment services.
                  </p>
                  <Button variant="outline" className="w-full">
                    Send to External Wallet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'deposit':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Deposit</h1>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Deposit Directly */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ArrowDownLeft className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Deposit Directly</h3>
                    <p className="text-muted-foreground text-sm">
                      Add funds to your Nardopay account directly. Use your preferred payment method to top up your wallet balance.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="depositAmount">Amount</Label>
                      <Input
                        id="depositAmount"
                        type="number"
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="depositCurrency">Currency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="depositMethod">Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="mobile">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      Deposit Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Create Deposit Link */}
              <Card 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('create-link')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Link2 className="w-8 h-8 text-blue-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Create Deposit Link</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Generate a shareable deposit link for others to add funds to your account. Perfect for receiving payments from clients or supporters.
                  </p>
                  <Button variant="outline" className="w-full">
                    Create Deposit Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'withdraw':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Withdraw</h1>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Withdraw to Bank */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Withdraw to Bank</h3>
                    <p className="text-muted-foreground text-sm">
                      Transfer funds from your Nardopay wallet to your bank account. Fast and secure bank transfers to your linked account.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="withdrawAmount">Amount</Label>
                      <Input
                        id="withdrawAmount"
                        type="number"
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankAccount">Bank Account</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account1">Bank of America - ****1234</SelectItem>
                          <SelectItem value="account2">Chase Bank - ****5678</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Withdraw to Bank
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Withdraw to Mobile Money */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Withdraw to Mobile Money</h3>
                    <p className="text-muted-foreground text-sm">
                      Withdraw funds to your mobile money account. Instant transfers to M-Pesa, Airtel Money, and other mobile wallets.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mobileAmount">Amount</Label>
                      <Input
                        id="mobileAmount"
                        type="number"
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobileProvider">Mobile Money Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+1234567890"
                        className="mt-1"
                      />
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Withdraw to Mobile Money
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'make-payment':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Make Payment</h1>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Virtual Card */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Virtual Card</h3>
                    <p className="text-muted-foreground text-sm">
                      Use your Nardopay virtual card for online and in-store purchases. Secure, instant, and accepted worldwide.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Virtual Card</span>
                        <span className="text-sm">Nardopay</span>
                      </div>
                      <div className="text-lg font-mono mb-2">**** **** **** 1234</div>
                      <div className="flex justify-between items-center text-sm">
                        <span>John Doe</span>
                        <span>12/25</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="cardAmount">Amount</Label>
                        <Input
                          id="cardAmount"
                          type="number"
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCurrency">Currency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay with Virtual Card
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Direct Payment on Merchant Code */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Merchant Code Payment</h3>
                    <p className="text-muted-foreground text-sm">
                      Make direct payments to merchants using their unique merchant code. Quick and secure point-of-sale transactions.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="merchantCode">Merchant Code</Label>
                      <Input
                        id="merchantCode"
                        placeholder="Enter merchant code"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="merchantAmount">Amount</Label>
                      <Input
                        id="merchantAmount"
                        type="number"
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="merchantCurrency">Currency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="merchantReference">Reference (Optional)</Label>
                      <Input
                        id="merchantReference"
                        placeholder="Payment reference"
                        className="mt-1"
                      />
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Pay Merchant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'links':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Payment Links</h1>
              <Button variant="cta">
                <Link2 className="w-4 h-4 mr-2" />
                Create New Link
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Create Link Form */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-primary" />
                    Create Payment Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={linkFormData.amount}
                        onChange={(e) => handleLinkInputChange('amount', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select value={linkFormData.currency} onValueChange={(value) => handleLinkInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product/Service Name *</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Premium T-Shirt, Consultation Service"
                      value={linkFormData.productName}
                      onChange={(e) => handleLinkInputChange('productName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of your product or service"
                      value={linkFormData.description}
                      onChange={(e) => handleLinkInputChange('description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thankYouMessage">Thank You Message</Label>
                    <Textarea
                      id="thankYouMessage"
                      placeholder="Message to show after successful payment"
                      value={linkFormData.thankYouMessage}
                      onChange={(e) => handleLinkInputChange('thankYouMessage', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
                    <Input
                      id="redirectUrl"
                      type="url"
                      placeholder="https://your-site.com/success"
                      value={linkFormData.redirectUrl}
                      onChange={(e) => handleLinkInputChange('redirectUrl', e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateLink}
                    className="w-full bg-blue-primary hover:bg-blue-primary/90"
                    disabled={!linkFormData.amount || !linkFormData.productName}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Create Payment Link
                  </Button>
                </CardContent>
              </Card>

              {/* Link Preview */}
              <div className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-blue-primary" />
                      Link Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {linkFormData.amount && linkFormData.productName ? (
                      <div className="space-y-6">
                        {/* Checkout Page Preview */}
                        <div>
                          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" style={{ color: invoiceSettings.primaryColor }} />
                            1. Checkout Page
                          </h4>
                          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                            {/* Header */}
                            <div className="text-center mb-4">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                {invoiceSettings.customLogo && invoiceSettings.logoUrl ? (
                                  <img 
                                    src={invoiceSettings.logoUrl} 
                                    alt={invoiceSettings.businessName} 
                                    className="w-6 h-6 object-contain"
                                  />
                                ) : (
                                  <div 
                                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: invoiceSettings.primaryColor }}
                                  >
                                    {invoiceSettings.businessName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-semibold text-sm text-white">
                                  {invoiceSettings.businessName}
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-white">Complete Your Payment</div>
                              <div className="text-xs text-gray-400">Secure payment powered by Nardopay</div>
                            </div>
                            
                            {/* Order Summary */}
                            <div className="bg-gray-900 rounded-lg p-4 mb-3">
                              <div className="text-sm font-bold text-white mb-3">Order Summary</div>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-white text-sm font-medium">{linkFormData.productName}</div>
                                  {linkFormData.description && (
                                    <div className="text-gray-400 text-xs mt-1">
                                      {linkFormData.description}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-white font-bold text-sm">
                                    {currencies.find(c => c.code === linkFormData.currency)?.symbol}{linkFormData.amount}
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {linkFormData.currency}
                                  </div>
                                </div>
                              </div>
                              <div className="border-t border-gray-700 mt-3 pt-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-xs">Total</span>
                                  <span className="text-white font-bold text-sm">
                                    {currencies.find(c => c.code === linkFormData.currency)?.symbol}{linkFormData.amount}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Payment Methods */}
                            <div className="grid grid-cols-2 gap-1 mb-3">
                              <div className="p-2 border border-gray-600 rounded text-center">
                                <div className="w-4 h-4 mx-auto mb-1" style={{ color: invoiceSettings.primaryColor }}>
                                  <CreditCard className="w-full h-full" />
                                </div>
                                <div className="text-xs text-gray-300">Card</div>
                              </div>
                              <div className="p-2 border border-gray-600 rounded text-center">
                                <div className="w-4 h-4 mx-auto mb-1" style={{ color: invoiceSettings.primaryColor }}>
                                  <Smartphone className="w-full h-full" />
                                </div>
                                <div className="text-xs text-gray-300">Mobile</div>
                              </div>
                            </div>
                            
                            {/* Pay Button */}
                            <div className="p-2 rounded text-center text-xs text-white font-medium" 
                                 style={{ 
                                   background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                                 }}>
                              Pay {currencies.find(c => c.code === linkFormData.currency)?.symbol}{linkFormData.amount}
                            </div>
                          </div>
                        </div>

                        {/* Confirmation Page Preview */}
                        <div>
                          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: invoiceSettings.primaryColor }} />
                            2. Confirmation Page
                          </h4>
                          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                            <div className="text-center">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div className="font-semibold text-sm mb-1">Payment Successful!</div>
                              <div className="text-xs text-muted-foreground mb-3">
                                {linkFormData.thankYouMessage || 'Thank you for your payment!'}
                              </div>
                              <div className="space-y-1 text-xs mb-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Amount:</span>
                                  <span className="font-semibold">
                                    {currencies.find(c => c.code === linkFormData.currency)?.symbol}{linkFormData.amount}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Product:</span>
                                  <span className="font-semibold">{linkFormData.productName}</span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground mb-3">
                                Redirecting you in a few seconds...
                              </div>
                              {linkFormData.redirectUrl && (
                                <div className="p-2 rounded text-center text-xs text-white font-medium" 
                                     style={{ 
                                       background: `linear-gradient(135deg, ${invoiceSettings.primaryColor}, ${invoiceSettings.secondaryColor})`
                                     }}>
                                  Continue to {linkFormData.redirectUrl}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Secure
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Global
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Link2 className="w-3 h-3 mr-1" />
                            Mobile
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Fill in the payment details to see a preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment Links List */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Payment Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {createdLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-primary/20 rounded-lg flex items-center justify-center">
                          <Link2 className="w-6 h-6 text-blue-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{link.productName}</div>
                          <div className="text-sm text-muted-foreground">
                            {link.amount} • {link.payments} payments • {link.createdAt}
                          </div>
                          {link.description && (
                            <div className="text-xs text-muted-foreground">
                              {link.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getLinkStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(link.link, link.id)}
                        >
                          {copiedLink === link.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(link.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleLinkStatus(link.id, 'payment')}
                          className={link.status === 'ACTIVE' ? 'text-yellow-500 hover:text-yellow-600' : 'text-green-success hover:text-green-600'}
                        >
                          {link.status === 'ACTIVE' ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteLink(link.id, 'payment')}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'donations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Donation Links</h1>
              <Button variant="cta">
                <Heart className="w-4 h-4 mr-2" />
                Create Donation Link
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Create Donation Link Form */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Create Donation Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="donationTitle">Campaign Title *</Label>
                    <Input
                      id="donationTitle"
                      placeholder="e.g., Help Build a School, Medical Supplies Fund"
                      value={donationFormData.title}
                      onChange={(e) => handleDonationInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donationDescription">Campaign Description</Label>
                    <Textarea
                      id="donationDescription"
                      placeholder="Tell your story and explain what the donations will be used for"
                      value={donationFormData.description}
                      onChange={(e) => handleDonationInputChange('description', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goalAmount">Goal Amount *</Label>
                      <Input
                        id="goalAmount"
                        type="number"
                        placeholder="0.00"
                        value={donationFormData.goalAmount}
                        onChange={(e) => handleDonationInputChange('goalAmount', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donationCurrency">Currency *</Label>
                      <Select value={donationFormData.currency} onValueChange={(value) => handleDonationInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donationThankYouMessage">Thank You Message</Label>
                    <Textarea
                      id="donationThankYouMessage"
                      placeholder="Message to show after successful donation"
                      value={donationFormData.thankYouMessage}
                      onChange={(e) => handleDonationInputChange('thankYouMessage', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donationRedirectUrl">Redirect URL (Optional)</Label>
                    <Input
                      id="donationRedirectUrl"
                      type="url"
                      placeholder="https://your-site.com/thank-you"
                      value={donationFormData.redirectUrl}
                      onChange={(e) => handleDonationInputChange('redirectUrl', e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateDonationLink}
                    className="w-full bg-red-500 hover:bg-red-600"
                    disabled={!donationFormData.title || !donationFormData.goalAmount}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Create Donation Link
                  </Button>
                </CardContent>
              </Card>

              {/* Donation Link Preview */}
              <div className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4 text-white">
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-white font-bold text-xs">❤</span>
                            </div>
                            <span className="font-semibold text-white text-sm">Donation Campaign</span>
                          </div>
                          <h2 className="text-lg font-bold text-white mb-1">{donationFormData.title || 'Campaign Title'}</h2>
                          <p className="text-gray-400 text-xs">{donationFormData.description || 'Campaign description will appear here'}</p>
                        </div>
                        
                        <div className="bg-gray-900 rounded-lg p-3 mb-4">
                          <div className="text-xs font-bold text-white mb-2">Progress</div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">Raised: {currencies.find(c => c.code === donationFormData.currency)?.symbol || '$'}0</span>
                            <span className="text-white text-sm">Goal: {currencies.find(c => c.code === donationFormData.currency)?.symbol || '$'}{donationFormData.goalAmount || '0'}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-2">Select Amount</div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {['10', '25', '50', '100', '250', '500'].map((amount) => (
                                <button key={amount} className="bg-gray-700 text-white p-2 rounded text-sm">
                                  {currencies.find(c => c.code === donationFormData.currency)?.symbol || '$'}{amount}
                                </button>
                              ))}
                            </div>
                            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold">
                              Donate Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Created Donation Links */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Donation Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {createdDonationLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <Heart className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{link.title}</div>
                          <div className="text-sm text-muted-foreground">{link.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Goal: {link.goalAmount} • {link.donations} donations • {link.goalProgress.toFixed(1)}% raised
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getLinkStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(link.link, link.id)}
                        >
                          {copiedLink === link.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(link.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleLinkStatus(link.id, 'donation')}
                          className={link.status === 'ACTIVE' ? 'text-yellow-500 hover:text-yellow-600' : 'text-green-success hover:text-green-600'}
                        >
                          {link.status === 'ACTIVE' ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteLink(link.id, 'donation')}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
                 );

      case 'subscriptions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Subscription Links</h1>
              <Button variant="cta">
                <Zap className="w-4 h-4 mr-2" />
                Create Subscription Link
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Create Subscription Link Form */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Create Subscription Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subscriptionTitle">Subscription Title *</Label>
                    <Input
                      id="subscriptionTitle"
                      placeholder="e.g., Premium Membership, Pro Plan"
                      value={subscriptionFormData.title}
                      onChange={(e) => handleSubscriptionInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriptionDescription">Description</Label>
                    <Textarea
                      id="subscriptionDescription"
                      placeholder="Describe what subscribers will get and the benefits"
                      value={subscriptionFormData.description}
                      onChange={(e) => handleSubscriptionInputChange('description', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subscriptionAmount">Amount *</Label>
                      <Input
                        id="subscriptionAmount"
                        type="number"
                        placeholder="0.00"
                        value={subscriptionFormData.amount}
                        onChange={(e) => handleSubscriptionInputChange('amount', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subscriptionCurrency">Currency *</Label>
                      <Select value={subscriptionFormData.currency} onValueChange={(value) => handleSubscriptionInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingCycle">Billing Cycle *</Label>
                      <Select value={subscriptionFormData.billingCycle} onValueChange={(value) => handleSubscriptionInputChange('billingCycle', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trialDays">Trial Days</Label>
                      <Input
                        id="trialDays"
                        type="number"
                        placeholder="0"
                        value={subscriptionFormData.trialDays}
                        onChange={(e) => handleSubscriptionInputChange('trialDays', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriptionThankYouMessage">Thank You Message</Label>
                    <Textarea
                      id="subscriptionThankYouMessage"
                      placeholder="Message to show after successful subscription"
                      value={subscriptionFormData.thankYouMessage}
                      onChange={(e) => handleSubscriptionInputChange('thankYouMessage', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriptionRedirectUrl">Redirect URL (Optional)</Label>
                    <Input
                      id="subscriptionRedirectUrl"
                      type="url"
                      placeholder="https://your-site.com/welcome"
                      value={subscriptionFormData.redirectUrl}
                      onChange={(e) => handleSubscriptionInputChange('redirectUrl', e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateSubscriptionLink}
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                    disabled={!subscriptionFormData.title || !subscriptionFormData.amount}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Create Subscription Link
                  </Button>
                </CardContent>
              </Card>

              {/* Subscription Link Preview */}
              <div className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4 text-white">
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                              <span className="text-white font-bold text-xs">⚡</span>
                            </div>
                            <span className="font-semibold text-white text-sm">Subscription</span>
                          </div>
                          <h2 className="text-lg font-bold text-white mb-1">{subscriptionFormData.title || 'Subscription Title'}</h2>
                          <p className="text-gray-400 text-xs">{subscriptionFormData.description || 'Subscription description will appear here'}</p>
                        </div>
                        
                        <div className="bg-gray-900 rounded-lg p-3 mb-4">
                          <div className="text-xs font-bold text-white mb-2">Pricing</div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">{currencies.find(c => c.code === subscriptionFormData.currency)?.symbol || '$'}{subscriptionFormData.amount || '0'}</span>
                            <span className="text-white text-sm">per {subscriptionFormData.billingCycle || 'month'}</span>
                          </div>
                          {subscriptionFormData.trialDays > 0 && (
                            <div className="text-xs text-yellow-400">
                              {subscriptionFormData.trialDays}-day free trial
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="text-center">
                            <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold">
                              Subscribe Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Created Subscription Links */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Subscription Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {createdSubscriptionLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{link.title}</div>
                          <div className="text-sm text-muted-foreground">{link.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {link.amount} per {link.billingCycle} • {link.subscribers} subscribers • {link.totalRevenue} revenue
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getLinkStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(link.link, link.id)}
                        >
                          {copiedLink === link.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(link.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleLinkStatus(link.id, 'subscription')}
                          className={link.status === 'ACTIVE' ? 'text-yellow-500 hover:text-yellow-600' : 'text-green-success hover:text-green-600'}
                        >
                          {link.status === 'ACTIVE' ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteLink(link.id, 'subscription')}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'catalogue':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Product Catalogue</h1>
              <Button variant="cta">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Create Catalogue
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Create Catalogue Form */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-primary" />
                    Create Catalogue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="catalogueTitle">Catalogue Title *</Label>
                    <Input
                      id="catalogueTitle"
                      placeholder="e.g., Fashion Store, Electronics Shop"
                      value={catalogueFormData.title}
                      onChange={(e) => handleCatalogueInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="catalogueDescription">Description</Label>
                    <Textarea
                      id="catalogueDescription"
                      placeholder="Describe your catalogue and what customers can expect"
                      value={catalogueFormData.description}
                      onChange={(e) => handleCatalogueInputChange('description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="catalogueCurrency">Currency</Label>
                    <Select value={catalogueFormData.currency} onValueChange={(value) => handleCatalogueInputChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">This currency will apply to all products in your catalogue</p>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Add Products</h4>
                    
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="itemName">Product Name *</Label>
                          <Input
                            id="itemName"
                            placeholder="Product name"
                            value={newItemForm.name}
                            onChange={(e) => handleNewItemInputChange('name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="itemPrice">Price *</Label>
                          <Input
                            id="itemPrice"
                            type="number"
                            placeholder="0.00"
                            value={newItemForm.price}
                            onChange={(e) => handleNewItemInputChange('price', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="itemDescription">Description</Label>
                        <Textarea
                          id="itemDescription"
                          placeholder="Product description"
                          value={newItemForm.description}
                          onChange={(e) => handleNewItemInputChange('description', e.target.value)}
                        />
                      </div>

                        <div className="space-y-2">
                          <Label htmlFor="itemImage">Image URL</Label>
                          <Input
                            id="itemImage"
                            placeholder="https://example.com/image.jpg"
                            value={newItemForm.image}
                            onChange={(e) => handleNewItemInputChange('image', e.target.value)}
                          />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="inStock"
                          checked={newItemForm.inStock}
                          onChange={(e) => handleNewItemInputChange('inStock', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="inStock">In Stock</Label>
                      </div>

                      <Button 
                        onClick={addItemToCatalogueForm}
                        disabled={!newItemForm.name || !newItemForm.price}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Products ({catalogueItems.length})</h4>
                    <div className="space-y-3">
                      {catalogueItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                              ) : (
                                <span className="text-gray-400 text-xs">IMG</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">${item.price}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemFromCatalogueForm(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {catalogueItems.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No products added yet</p>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateCatalogue}
                    className="w-full bg-blue-primary hover:bg-blue-primary/90"
                    disabled={!catalogueFormData.title || catalogueItems.length === 0}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Create Catalogue
                  </Button>
                </CardContent>
              </Card>

              {/* Catalogue Preview */}
              <div className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4 text-white">
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white font-bold text-xs">🛍️</span>
                            </div>
                            <span className="font-semibold text-white text-sm">Catalogue</span>
                          </div>
                          <h2 className="text-lg font-bold text-white mb-1">{catalogueFormData.title || 'Catalogue Title'}</h2>
                          <p className="text-gray-400 text-xs">{catalogueFormData.description || 'Catalogue description will appear here'}</p>
                        </div>
                        
                        <div className="space-y-3">
                          {catalogueItems.slice(0, 2).map((item) => (
                            <div key={item.id} className="bg-gray-900 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-white text-sm font-medium">{item.name}</div>
                                  <div className="text-gray-400 text-xs">{item.description}</div>
                                </div>
                                <div className="text-white font-bold">{currencies.find(c => c.code === catalogueFormData.currency)?.symbol || '$'}{item.price}</div>
                              </div>
                            </div>
                          ))}
                          {catalogueItems.length > 2 && (
                            <div className="text-center text-gray-400 text-xs">
                              +{catalogueItems.length - 2} more products
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Created Catalogues */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Catalogues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {createdCatalogues.map((catalogue) => (
                    <div key={catalogue.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{catalogue.title}</div>
                          <div className="text-sm text-muted-foreground">{catalogue.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {catalogue.items.length} products • {catalogue.totalSales} sales • {catalogue.totalRevenue} revenue
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getLinkStatusColor(catalogue.status)}>
                          {catalogue.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(catalogue.link, catalogue.id)}
                        >
                          {copiedLink === catalogue.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(catalogue.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleLinkStatus(catalogue.id, 'catalogue')}
                          className={catalogue.status === 'ACTIVE' ? 'text-yellow-500 hover:text-yellow-600' : 'text-green-success hover:text-green-600'}
                        >
                          {catalogue.status === 'ACTIVE' ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteLink(catalogue.id, 'catalogue')}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'send':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Send Money to Nardopay Users</h1>
              <Button 
                variant="cta"
                onClick={() => {
                  setSendFormData({
                    recipient: '',
                    amount: '',
                    currency: 'USD',
                    message: ''
                  });
                  setSendStatus('idle');
                  setSendError('');
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                New Transfer
              </Button>
            </div>

            {/* Success/Error Messages */}
            {sendStatus === 'success' && (
              <Card className="bg-green-success/10 border-green-success/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Transfer completed successfully!</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {sendError && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">{sendError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card/80 backdrop-blur-sm p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Transfer to Nardopay Account</h3>
                
                {/* Recipient Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Recipient Information</h4>
                    <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Recipient</label>
                      <input 
                      type="text" 
                      placeholder="Email or phone number" 
                      value={sendFormData.recipient}
                      onChange={(e) => handleSendInputChange('recipient', e.target.value)}
                        className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                      />
                  </div>
                  <p className="text-sm text-muted-foreground">Enter email or phone number of the Nardopay account</p>
                  <p className="text-sm text-muted-foreground">Transfer will be made from your Nardopay balance</p>
                </div>

                {/* Transfer Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Transfer Details</h4>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                    <div className="flex">
                      <select 
                        value={sendFormData.currency}
                        onChange={(e) => handleSendInputChange('currency', e.target.value)}
                        className="p-3 bg-secondary/50 border border-border border-r-0 rounded-l-lg text-foreground"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="RWF">RWF - Rwandan Franc</option>
                        <option value="ETB">ETB - Ethiopian Birr</option>
                        <option value="MAD">MAD - Moroccan Dirham</option>
                        <option value="EGP">EGP - Egyptian Pound</option>
                        <option value="XOF">XOF - West African CFA</option>
                        <option value="XAF">XAF - Central African CFA</option>
                        <option value="BIF">BIF - Burundian Franc</option>
                        <option value="CDF">CDF - Congolese Franc</option>
                        <option value="MWK">MWK - Malawian Kwacha</option>
                        <option value="ZMW">ZMW - Zambian Kwacha</option>
                        <option value="BWP">BWP - Botswana Pula</option>
                        <option value="NAD">NAD - Namibian Dollar</option>
                        <option value="LSL">LSL - Lesotho Loti</option>
                        <option value="SZL">SZL - Swazi Lilangeni</option>
                        <option value="MUR">MUR - Mauritian Rupee</option>
                        <option value="SCR">SCR - Seychellois Rupee</option>
                        <option value="MGA">MGA - Malagasy Ariary</option>
                        <option value="KMF">KMF - Comorian Franc</option>
                        <option value="DJF">DJF - Djiboutian Franc</option>
                        <option value="SOS">SOS - Somali Shilling</option>
                        <option value="SDG">SDG - Sudanese Pound</option>
                        <option value="SSP">SSP - South Sudanese Pound</option>
                        <option value="LYD">LYD - Libyan Dinar</option>
                        <option value="TND">TND - Tunisian Dinar</option>
                        <option value="DZD">DZD - Algerian Dinar</option>
                        <option value="MRO">MRO - Mauritanian Ouguiya</option>
                        <option value="GMD">GMD - Gambian Dalasi</option>
                        <option value="GNF">GNF - Guinean Franc</option>
                        <option value="SLL">SLL - Sierra Leonean Leone</option>
                        <option value="LRD">LRD - Liberian Dollar</option>
                        <option value="STD">STD - São Tomé and Príncipe Dobra</option>
                        <option value="CVE">CVE - Cape Verdean Escudo</option>
                        <option value="AOA">AOA - Angolan Kwanza</option>
                        <option value="MZN">MZN - Mozambican Metical</option>
                        <option value="NGN">NGN - Nigerian Naira</option>
                        <option value="KES">KES - Kenyan Shilling</option>
                        <option value="GHS">GHS - Ghanaian Cedi</option>
                        <option value="ZAR">ZAR - South African Rand</option>
                      </select>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={sendFormData.amount}
                        onChange={(e) => handleSendInputChange('amount', e.target.value)}
                        className="flex-1 p-3 bg-secondary/50 border border-border rounded-r-lg text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="What's this payment for?" 
                      value={sendFormData.message}
                      onChange={(e) => handleSendInputChange('message', e.target.value)}
                      className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                    />
                  </div>
                </div>

                <Button 
                  variant="cta" 
                  className="w-full"
                  onClick={handleSendMoney}
                  disabled={sendStatus === 'processing'}
                >
                  {sendStatus === 'processing' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Money
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transfers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No transfers yet. Send your first transfer to see it here.
                    </div>
                  ) : (
                    transfers.map((transfer) => (
                      <div key={transfer.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-primary/20 rounded-lg flex items-center justify-center">
                            <Send className="w-5 h-5 text-blue-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {transfer.currency} {transfer.amount.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              To: {transfer.recipient}
                            </div>
                            {transfer.message && (
                              <div className="text-xs text-muted-foreground">
                                {transfer.message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              transfer.status === 'COMPLETED' 
                                ? 'bg-green-success/20 text-green-success' 
                                : 'bg-yellow-500/20 text-yellow-500'
                            }
                          >
                            {transfer.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(transfer.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'developers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Developers</h1>
              <Button variant="cta">
                <Code className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Test Key</span>
                      <Badge variant="secondary">Test</Badge>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground break-all">
                      nardopay_test_sk_123456789abcdef
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">Copy</Button>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Live Key</span>
                      <Badge className="bg-green-success/20 text-green-success">Live</Badge>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground">
                      nardopay_live_sk_•••••••••••••••
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">Reveal</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">1. Install SDK</h4>
                    <div className="p-3 bg-secondary/50 rounded font-mono text-sm">
                      npm install nardopay-node
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">2. Initialize</h4>
                    <div className="p-3 bg-secondary/50 rounded font-mono text-sm">
                      const nardo = require('nardopay-node')('your_api_key');
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">3. Create Payment</h4>
                    <div className="p-3 bg-secondary/50 rounded font-mono text-sm">
                      nardo.payments.create({'{'}amount: 1000, currency: 'USD'{'}'});
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Full Documentation</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-primary text-primary-foreground rounded text-xs font-bold">POST</span>
                        <span className="font-mono text-sm">/v1/payments</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Create a new payment</p>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-success text-primary-foreground rounded text-xs font-bold">GET</span>
                        <span className="font-mono text-sm">/v1/payments/{'{'}id{'}'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Retrieve payment details</p>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-primary text-primary-foreground rounded text-xs font-bold">POST</span>
                        <span className="font-mono text-sm">/v1/links</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Create payment link</p>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-500 text-primary-foreground rounded text-xs font-bold">PUT</span>
                        <span className="font-mono text-sm">/v1/webhooks</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Configure webhooks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Invoice Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Business Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Business Name" 
                      value={invoiceSettings.businessName}
                      onChange={(e) => handleInvoiceSettingChange('businessName', e.target.value)}
                      className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Logo Upload</label>
                    <div className="space-y-2">
                      {invoiceSettings.customLogo && invoiceSettings.logoUrl && (
                        <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                          <img 
                            src={invoiceSettings.logoUrl} 
                            alt="Business Logo" 
                            className="w-12 h-12 object-contain rounded"
                          />
                          <span className="text-sm text-muted-foreground">Logo uploaded</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Primary Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
                        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => handleInvoiceSettingChange('primaryColor', color)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            invoiceSettings.primaryColor === color 
                              ? 'border-foreground scale-110' 
                              : 'border-border hover:border-foreground/50'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Secondary Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        '#1D4ED8', '#047857', '#D97706', '#DC2626', 
                        '#7C3AED', '#BE185D', '#0891B2', '#65A30D'
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => handleInvoiceSettingChange('secondaryColor', color)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            invoiceSettings.secondaryColor === color 
                              ? 'border-foreground scale-110' 
                              : 'border-border hover:border-foreground/50'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="cta" 
                    className="w-full"
                    onClick={() => {
                      // Settings are already saved automatically when changed
                      // This button provides visual feedback
                      const button = document.activeElement as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = 'Saved!';
                      button.disabled = true;
                      setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                      }, 2000);
                    }}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Pre-selected Themes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#0284C7' },
                    { name: 'Forest Green', primary: '#059669', secondary: '#047857' },
                    { name: 'Royal Purple', primary: '#7C3AED', secondary: '#6D28D9' },
                    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#DC2626' }
                  ].map((theme) => (
                    <div key={theme.name} className="p-4 bg-secondary/20 rounded-lg border-2 border-transparent hover:border-blue-primary cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">{theme.name}</div>
                          <div className="flex gap-2 mt-2">
                            <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.primary }} />
                            <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.secondary }} />
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Apply</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Business Email</label>
                    <input 
                      type="email" 
                      value={user?.email}
                      className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Business Address</label>
                    <textarea 
                      placeholder="Enter your business address..." 
                      rows={3}
                      className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                    />
                  </div>
                </div>
                <Button variant="cta" className="mt-4">Update Account</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'direct-pay':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Direct Pay</h1>
              <Button variant="cta" onClick={() => window.open('/products/direct-pay', '_blank')}>
                <Zap className="w-4 h-4 mr-2" />
                Open Direct Pay
              </Button>
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Pay Anyone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Send money to individuals using their preferred payment method. 
                    Whether they use EcoCash, InnBucks, M-Pesa, or any other payment service.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => window.open('/products/direct-pay', '_blank')}>
                    <Send className="w-4 h-4 mr-2" />
                    Start Direct Pay
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Supported Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['EcoCash', 'InnBucks', 'M-Pesa', 'Airtel Money', 'Tigo Pesa', 'Bank Transfer', 'Credit Card', 'Mobile Money'].map((method) => (
                    <div key={method} className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-primary rounded-full"></div>
                      <span className="text-sm font-medium">{method}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Digital Wallet</h1>
              <Button variant="cta">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </div>

            {/* Wallet Card */}
            <div className="grid md:grid-cols-1 gap-6">
              <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold">Nardopay Account</h3>
                      <p className="text-blue-100 text-sm">Your wallet is your Nardopay account</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-2">$25,701.50</div>
                  <div className="text-blue-100 text-sm">Card: 4532 **** **** 1234</div>
                  <div className="flex gap-2 mt-4">
                    <Badge className="bg-white/20 text-white text-xs">Visa</Badge>
                    <Badge className="bg-white/20 text-white text-xs">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Management */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="cta" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={copyAddFundsLink}
                  >
                    {copiedAddFundsLink ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Add Funds Link Copied!
                      </>
                    ) : (
                      <>
                    <Copy className="w-4 h-4 mr-2" />
                        Copy Add Funds Link
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('payouts')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Withdraw Funds (Payouts)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Add Funds Link Info */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    Add Funds Link
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share this link with anyone to allow them to add funds directly to your Nardopay account.
                  </p>
                  <div className="p-3 bg-secondary/30 rounded-lg mb-3">
                    <div className="text-xs text-muted-foreground mb-1">Your Add Funds Link:</div>
                    <div className="text-sm font-mono break-all">{addFundsLink}</div>
                          </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={copyAddFundsLink}
                  >
                    {copiedAddFundsLink ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Active Subscriptions with Cancel Option */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Active Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                    { id: '1', name: 'Netflix Premium', amount: 15.99, next: '2024-09-15', status: 'active' },
                    { id: '2', name: 'Spotify Premium', amount: 9.99, next: '2024-09-10', status: 'active' },
                    { id: '3', name: 'Adobe Creative Cloud', amount: 52.99, next: '2024-09-20', status: 'active' },
                    { id: '4', name: 'Amazon Prime', amount: 12.99, next: '2024-09-05', status: 'active' }
                  ].map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{sub.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Next: {new Date(sub.next).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-semibold text-sm">${sub.amount}</div>
                          <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => {
                            // Handle subscription cancellation
                            console.log(`Cancelling subscription: ${sub.name}`);
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            {/* Recent Transactions */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'credit', amount: 500.00, description: 'Payment received from Client A', wallet: 'Business', date: '2024-08-15' },
                    { type: 'debit', amount: 15.99, description: 'Netflix Premium', wallet: 'Entertainment', date: '2024-08-15' },
                    { type: 'debit', amount: 45.50, description: 'Grocery shopping', wallet: 'Personal', date: '2024-08-14' },
                    { type: 'credit', amount: 1000.00, description: 'Salary deposit', wallet: 'Personal', date: '2024-08-14' },
                    { type: 'debit', amount: 52.99, description: 'Adobe Creative Cloud', wallet: 'Business', date: '2024-08-13' }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.wallet} • {transaction.date}</div>
                        </div>
                      </div>
                      <div className={`text-right font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );



      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
              <Button variant="cta">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Filters */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search Transactions</Label>
                  <Input
                    id="search"
                    placeholder="Search by description or amount..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="mt-1"
                  />
                        </div>

                {/* Filter Buttons */}
                        <div>
                  <Label className="mb-2 block">Filter by Type</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={historyFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={historyFilter === 'payments' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('payments')}
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Payments
                    </Button>
                    <Button
                      variant={historyFilter === 'subscriptions' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('subscriptions')}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Subscriptions
                    </Button>
                    <Button
                      variant={historyFilter === 'donations' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('donations')}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Donations
                    </Button>
                    <Button
                      variant={historyFilter === 'funds-added' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('funds-added')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Funds Added
                    </Button>
                    <Button
                      variant={historyFilter === 'withdrawals' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('withdrawals')}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Withdrawals
                    </Button>
                    <Button
                      variant={historyFilter === 'transfers' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('transfers')}
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Transfers
                    </Button>
                    <Button
                      variant={historyFilter === 'direct-pay' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHistoryFilter('direct-pay')}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Direct Pay
                    </Button>
                        </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  All Transactions ({filteredTransactions.length})
                      </CardTitle>
                  </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found matching your filters</p>
                        </div>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const transactionInfo = getTransactionInfo(transaction.category);
                      const Icon = transactionInfo.icon;
                      
                      return (
                        <div 
                          key={transaction.id} 
                          className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transactionInfo.color}`}>
                              <Icon className="w-5 h-5" />
                        </div>
                        <div>
                               <div className="font-medium text-foreground">{transaction.description}</div>
                               <div className="text-sm text-muted-foreground">
                                 {transactionInfo.label} • {new Date(transaction.date).toLocaleDateString()}
                        </div>
                               {transaction.clientEmail && (
                                 <div className="text-xs text-muted-foreground">
                                   {transaction.direction === 'in' ? 'From: ' : 'To: '}{transaction.clientEmail}
                        </div>
                               )}
                        </div>
                        </div>
                          <div className="text-right">
                            <div className={`font-semibold text-lg ${
                              transaction.direction === 'in' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.direction === 'in' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                            <Badge className={transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      );
                    })
                  )}
                      </div>
                  </CardContent>
                </Card>
          </div>
        );

      case 'payouts':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">All Payouts</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="text-sm text-muted-foreground">Upcoming payout</div>
                  <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                    $21,000.00
                    <TrendingUp className="w-5 h-5 text-green-success" />
                  </div>
                  <div className="text-sm text-muted-foreground">6 transactions</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Payout generation: Tue, Aug 2, 2022</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Receive payout on or before: Wed, Aug 3, 2022</span>
                    </div>
                    <div className="text-muted-foreground">
                      Recipient: Chase Bank account ending in 1045
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="text-sm text-muted-foreground">Payout generation schedule</div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-primary" />
                    <div>
                      <div className="text-xl font-bold text-foreground">Weekly</div>
                      <div className="text-sm text-muted-foreground">Every Tuesday</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    Payouts that fall on a holiday will be processed the next banking day.
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="text-sm text-muted-foreground">Next payout</div>
                  <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                    $25,350.00
                    <ArrowUpRight className="w-5 h-5 text-green-success" />
                  </div>
                  <div className="text-sm text-muted-foreground">11 transactions</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Payout generation: Tue, Aug 9, 2022</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Receive payout on or before: Wed, Aug 10, 2022</span>
                    </div>
                    <div className="text-muted-foreground">
                      Recipient: Chase Bank account ending in 1045
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bank</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Account Number</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payout Generation</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Export</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutData.map((payout, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-secondary/20">
                          <td className="py-4 px-4 text-foreground font-medium">{payout.amount}</td>
                          <td className="py-4 px-4 text-foreground">{payout.bank}</td>
                          <td className="py-4 px-4 text-muted-foreground">{payout.account}</td>
                          <td className="py-4 px-4 text-muted-foreground">{payout.date}</td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(payout.status)}>
                              {payout.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button variant="ghost" size="sm" className="text-blue-primary hover:text-blue-secondary">
                              Export to CSV
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            {/* 1. Balance Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('deposit')}>
                  Deposit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('withdraw')}>
                  Withdraw
                </Button>
              </div>
            </div>
            <Card className="bg-card/80 backdrop-blur-sm p-6 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">$12,450.00</div>
                <div className="text-sm text-muted-foreground">Available Balance</div>
              </div>
            </Card>

            {/* 2. Active Links Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Active Links</h2>
              <Card className="bg-card/80 backdrop-blur-sm p-6 cursor-pointer hover:shadow-lg" onClick={() => setShowLinksModal(true)}>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-foreground">{createdLinks.length + createdDonationLinks.length + createdSubscriptionLinks.length + createdCatalogues.length}</div>
                  <div className="text-sm text-muted-foreground">Total Active Links</div>
                </div>
              </Card>
              {/* Modal or expandable section for links list and customer drilldown would go here */}
            </div>

            {/* 3. Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Overview Chart */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* ...existing bar chart code... */}
                </CardContent>
              </Card>
              {/* Payment Methods Chart */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* ...existing pie chart code... */}
                </CardContent>
              </Card>
            </div>

            {/* 4. Virtual Card & Subscriptions Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Virtual Card & Subscriptions</h2>
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Virtual Card</span>
                  <span className="text-sm">Nardopay</span>
                </div>
                <div className="text-lg font-mono mb-2">**** **** **** 1234</div>
                <div className="flex justify-between items-center text-sm">
                  <span>John Doe</span>
                  <span>12/25</span>
                </div>
              </Card>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Active Subscriptions</h3>
                {createdSubscriptionLinks.map(sub => (
                  <Card key={sub.id} className="bg-card/80 backdrop-blur-sm p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{sub.title}</div>
                      <div className="text-sm text-muted-foreground">{sub.amount} / {sub.billingCycle}</div>
                    </div>
                    <Button variant="destructive" size="sm">Cancel</Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* 5. History Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">History</h2>
              <Card className="bg-card/80 backdrop-blur-sm p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Counterparty</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transfers.map(txn => (
                        <tr key={txn.id}>
                          <td className="p-2">{txn.amount > 0 ? 'Received' : 'Sent'}</td>
                          <td className="p-2">{txn.amount > 0 ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}</td>
                          <td className="p-2">{txn.recipient}</td>
                          <td className="p-2">{new Date(txn.date).toLocaleString()}</td>
                          <td className="p-2">{txn.status}</td>
                          <td className="p-2">{txn.currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* 6. Quick Actions Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Button variant="outline" onClick={() => setActiveTab('create-link')}>Create Link</Button>
                <Button variant="outline" onClick={() => setActiveTab('send-money')}>Send Money</Button>
                <Button variant="outline" onClick={() => setActiveTab('make-payment')}>Make Payment</Button>
                <Button variant="outline" onClick={() => setActiveTab('deposit')}>Deposit</Button>
                <Button variant="outline" onClick={() => setActiveTab('withdraw')}>Withdraw</Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gradient-secondary border-r border-border transition-all duration-300 z-50`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex-shrink-0">
          <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
              {!sidebarCollapsed && (
            <span className="text-xl font-bold text-foreground">Nardopay</span>
              )}
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-primary text-primary-foreground'
                      : item.special
                      ? 'text-green-success hover:bg-secondary/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                    title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                    {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                    )}
                </button>
              );
            })}
          </nav>
        </div>

          <div className="mt-auto p-6 border-t border-border flex-shrink-0">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
                {!sidebarCollapsed && (
              <div>
                <div className="text-sm font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
                )}
            </div>
              {!sidebarCollapsed && (
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
              )}
          </div>
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 p-0 bg-background border border-border rounded-full hover:bg-secondary"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;