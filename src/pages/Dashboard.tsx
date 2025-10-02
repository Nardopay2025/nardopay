import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Home, Plus, Send, ArrowUpRight, History, Settings, Menu } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { CreateLinkSection } from '@/components/dashboard/CreateLinkSection';
import { PaymentLinksForm } from '@/components/dashboard/forms/PaymentLinksForm';
import { DonationLinksForm } from '@/components/dashboard/forms/DonationLinksForm';
import { SubscriptionLinksForm } from '@/components/dashboard/forms/SubscriptionLinksForm';
import { WithdrawSection } from '@/components/dashboard/WithdrawSection';
import { SendMoneySection } from '@/components/dashboard/SendMoneySection';
import { HistoryTab } from '@/components/dashboard/HistoryTab';
import { CatalogueForm } from '@/components/dashboard/forms/CatalogueForm';
import { SettingsForm } from '@/components/dashboard/forms/SettingsForm';
import { CurrencySelectionDialog } from '@/components/dashboard/CurrencySelectionDialog';
import { PesapalSetup } from '@/components/dashboard/PesapalSetup';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'create-link', label: 'Create a Link', icon: Plus },
  { id: 'send-money', label: 'Send Money', icon: Send },
  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'pesapal-setup', label: 'Pesapal Setup', icon: Settings },
];

function AppSidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const collapsed = state === 'collapsed';

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <Sidebar className="border-r-0">
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-500 to-blue-700 text-white">
        {/* Header */}
        <div className="p-4 border-b border-blue-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">N</span>
            </div>
            {!collapsed && <span className="font-semibold text-lg">Nardopay</span>}
          </div>
          {!collapsed && <SidebarTrigger className="text-white hover:bg-blue-600/50" />}
        </div>

        {/* Navigation */}
        <SidebarContent className="flex-1 px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full justify-start gap-3 ${
                        activeTab === item.id
                          ? 'bg-white text-blue-600 hover:bg-white/90'
                          : 'text-white hover:bg-blue-600/50'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Section */}
        <div className="p-4 border-t border-blue-600">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-white">
              <AvatarFallback className="text-blue-600 font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white/80 hover:text-white hover:bg-blue-600/50 p-0 h-auto"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [donationLinks, setDonationLinks] = useState<any[]>([]);
  const [subscriptionLinks, setSubscriptionLinks] = useState<any[]>([]);
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
  const [userCurrency, setUserCurrency] = useState('KES');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchAllData();
      checkCurrencySetup();
    }
  }, [user, loading, navigate]);

  const checkCurrencySetup = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('currency, currency_set_at')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      // Set user currency
      if (data?.currency) {
        setUserCurrency(data.currency);
      }
      
      // Show dialog if currency hasn't been set yet
      if (!data?.currency_set_at) {
        setShowCurrencyDialog(true);
      }
    } catch (error) {
      console.error('Error checking currency setup:', error);
    }
  };

  const fetchAllData = async () => {
    try {
      const [
        { data: paymentLinksData },
        { data: donationLinksData },
        { data: subscriptionLinksData },
        { data: cataloguesData },
        { data: transactionsData },
      ] = await Promise.all([
        supabase.from('payment_links').select('*').order('created_at', { ascending: false }),
        supabase.from('donation_links').select('*').order('created_at', { ascending: false }),
        supabase.from('subscription_links').select('*').order('created_at', { ascending: false }),
        supabase.from('catalogues').select('*').order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      setPaymentLinks(paymentLinksData || []);
      setDonationLinks(donationLinksData || []);
      setSubscriptionLinks(subscriptionLinksData || []);
      setCatalogues(cataloguesData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            setActiveTab={setActiveTab}
            paymentLinks={paymentLinks}
            donationLinks={donationLinks}
            subscriptionLinks={subscriptionLinks}
            catalogues={catalogues}
            transactions={transactions}
          />
        );
      case 'create-link':
        return <CreateLinkSection onSelectType={setActiveTab} />;
      case 'payment-links':
        return (
          <PaymentLinksForm
            onSuccess={() => {
              fetchAllData();
              setActiveTab('dashboard');
            }}
          />
        );
      case 'donation-links':
        return (
          <DonationLinksForm
            onSuccess={() => {
              fetchAllData();
              setActiveTab('dashboard');
            }}
          />
        );
      case 'subscription-links':
        return (
          <SubscriptionLinksForm
            onSuccess={() => {
              fetchAllData();
              setActiveTab('dashboard');
            }}
          />
        );
      case 'catalogue':
        return (
          <CatalogueForm
            onSuccess={() => {
              fetchAllData();
              setActiveTab('dashboard');
            }}
          />
        );
      case 'send-money':
        return <SendMoneySection />;
      case 'withdraw':
        return <WithdrawSection />;
      case 'history':
        return <HistoryTab />;
      case 'settings':
        return <SettingsForm />;
      case 'pesapal-setup':
        return <PesapalSetup />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-muted-foreground mt-2">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Currency Selection Dialog */}
        <CurrencySelectionDialog
          open={showCurrencyDialog}
          userId={user.id}
          onComplete={() => {
            setShowCurrencyDialog(false);
            checkCurrencySetup(); // Refresh currency after selection
          }}
        />
        
        <div className="flex-1 min-h-screen w-full bg-background">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 lg:hidden bg-background/95 backdrop-blur-sm border-b p-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <span className="font-semibold">Nardopay</span>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
