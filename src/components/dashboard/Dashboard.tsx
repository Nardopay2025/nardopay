import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoiceSettings } from '@/contexts/InvoiceSettingsContext';
import { usePaymentLinks } from '@/contexts/PaymentLinksContext';
import { useDonationLinks } from '@/contexts/DonationLinksContext';
import { useSubscriptionLinks } from '@/contexts/SubscriptionLinksContext';
import { useCatalogue } from '@/contexts/CatalogueContext';
import { useDynamicUrls } from '@/hooks/use-dynamic-urls';
import { Menu, X } from 'lucide-react';

// Import dashboard components
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardOverview } from './DashboardOverview';
import { CreateLinkSection } from './CreateLinkSection';
import { SendMoneySection } from './SendMoneySection';
import { MakePaymentSection } from './MakePaymentSection';
import { DepositSection } from './DepositSection';
import { WithdrawSection } from './WithdrawSection';
import { HistorySection } from './sections/HistorySection';

// Import form components (these will be created next)
import { PaymentLinksForm } from './forms/PaymentLinksForm';
import { DonationLinksForm } from './forms/DonationLinksForm';
import { SubscriptionLinksForm } from './forms/SubscriptionLinksForm';
import { CatalogueForm } from './forms/CatalogueForm';
import { SendMoneyForm } from './forms/SendMoneyForm';
import { DirectPayForm } from './forms/DirectPayForm';
import { SettingsForm } from './forms/SettingsForm';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { invoiceSettings, updateInvoiceSettings } = useInvoiceSettings();
  const { paymentLinks, addPaymentLink } = usePaymentLinks();
  const { donationLinks, addDonationLink } = useDonationLinks();
  const { subscriptionLinks, addSubscriptionLink } = useSubscriptionLinks();
  const { catalogues, addCatalogue, deleteCatalogue, addItemToCatalogue, removeItemFromCatalogue } = useCatalogue();
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [addFundsLink, setAddFundsLink] = useState('https://nardopay.com/add-funds/user123');
  const [copiedAddFundsLink, setCopiedAddFundsLink] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  
  // Created links state
  const [createdLinks, setCreatedLinks] = useState<any[]>([]);
  const [createdDonationLinks, setCreatedDonationLinks] = useState<any[]>([]);
  const [createdSubscriptionLinks, setCreatedSubscriptionLinks] = useState<any[]>([]);
  const [createdCatalogues, setCreatedCatalogues] = useState<any[]>([]);
  
  // Mock data
  const [transfers] = useState([
    { id: 1, amount: 150.00, recipient: 'john@example.com', date: '2024-01-15', status: 'Completed', currency: 'USD' },
    { id: 2, amount: -75.50, recipient: 'jane@example.com', date: '2024-01-14', status: 'Completed', currency: 'USD' },
    { id: 3, amount: 200.00, recipient: 'bob@example.com', date: '2024-01-13', status: 'Pending', currency: 'USD' },
  ]);

  const { generateUrl } = useDynamicUrls();
  
  // Update URLs after component mounts
  useEffect(() => {
    if (generateUrl) {
      setCreatedLinks(prev => prev.map(link => ({
        ...link,
        link: link.link.startsWith('/') ? generateUrl(link.link) : link.link
      })));
      
      setCreatedDonationLinks(prev => prev.map(link => ({
        ...link,
        link: link.link.startsWith('/') ? generateUrl(link.link) : link.link
      })));
      
      setCreatedSubscriptionLinks(prev => prev.map(link => ({
        ...link,
        link: link.link.startsWith('/') ? generateUrl(link.link) : link.link
      })));
      
      setCreatedCatalogues(prev => prev.map(catalogue => ({
        ...catalogue,
        link: catalogue.link.startsWith('/') ? generateUrl(catalogue.link) : catalogue.link
      })));
    }
  }, [generateUrl]);

  // Close mobile sidebar when tab changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            user={user}
            setActiveTab={setActiveTab}
            setShowLinksModal={setShowLinksModal}
            createdLinks={createdLinks}
            createdDonationLinks={createdDonationLinks}
            createdSubscriptionLinks={createdSubscriptionLinks}
            createdCatalogues={createdCatalogues}
            transfers={transfers}
          />
        );
      
      case 'create-link':
        return (
          <CreateLinkSection
            setActiveTab={setActiveTab}
            createdLinks={createdLinks}
            setCreatedLinks={setCreatedLinks}
            createdDonationLinks={createdDonationLinks}
            setCreatedDonationLinks={setCreatedDonationLinks}
            createdSubscriptionLinks={createdSubscriptionLinks}
            setCreatedSubscriptionLinks={setCreatedSubscriptionLinks}
            createdCatalogues={createdCatalogues}
            setCreatedCatalogues={setCreatedCatalogues}
          />
        );
      
      case 'send-money':
        return (
          <SendMoneySection
            setActiveTab={setActiveTab}
            transfers={transfers}
          />
        );
      
      case 'make-payment':
        return (
          <MakePaymentSection
            setActiveTab={setActiveTab}
          />
        );
      
      case 'deposit':
        return (
          <DepositSection
            setActiveTab={setActiveTab}
            addFundsLink={addFundsLink}
            setAddFundsLink={setAddFundsLink}
            copiedAddFundsLink={copiedAddFundsLink}
            setCopiedAddFundsLink={setCopiedAddFundsLink}
          />
        );
      
      case 'withdraw':
        return (
          <WithdrawSection
            setActiveTab={setActiveTab}
          />
        );
      
      case 'history':
        return <HistorySection transfers={transfers} />;
      
      case 'payment-links':
        return (
          <PaymentLinksForm
            createdLinks={createdLinks}
            setCreatedLinks={setCreatedLinks}
            setActiveTab={setActiveTab}
          />
        );
      
      case 'donation-links':
        return (
          <DonationLinksForm
            createdDonationLinks={createdDonationLinks}
            setCreatedDonationLinks={setCreatedDonationLinks}
            setActiveTab={setActiveTab}
          />
        );
      
      case 'subscription-links':
        return (
          <SubscriptionLinksForm
            createdSubscriptionLinks={createdSubscriptionLinks}
            setCreatedSubscriptionLinks={setCreatedSubscriptionLinks}
            setActiveTab={setActiveTab}
          />
        );
      
      case 'catalogue':
        return (
          <CatalogueForm
            createdCatalogues={createdCatalogues}
            setCreatedCatalogues={setCreatedCatalogues}
            setActiveTab={setActiveTab}
          />
        );
      
      case 'send':
        return (
          <SendMoneyForm
            setActiveTab={setActiveTab}
          />
        );
      
      case 'direct-pay':
        return (
          <DirectPayForm
            setActiveTab={setActiveTab}
          />
        );
      
      case 'settings':
        return (
          <SettingsForm
            invoiceSettings={invoiceSettings}
            updateInvoiceSettings={updateInvoiceSettings}
            setActiveTab={setActiveTab}
          />
        );
      
      default:
        return (
          <DashboardOverview
            user={user}
            setActiveTab={setActiveTab}
            setShowLinksModal={setShowLinksModal}
            createdLinks={createdLinks}
            createdDonationLinks={createdDonationLinks}
            createdSubscriptionLinks={createdSubscriptionLinks}
            createdCatalogues={createdCatalogues}
            transfers={transfers}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 lg:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          user={user}
          logout={logout}
        />
      </div>
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } p-4 lg:p-8`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg">Nardopay</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 