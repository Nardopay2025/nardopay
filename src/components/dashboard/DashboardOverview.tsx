import { 
  BalanceSection,
  ActiveLinksSection,
  IncomeChart,
  RevenuePieChart,
  VirtualCardSection,
  DashboardHistorySection,
  QuickActionsSection
} from './sections';

interface DashboardOverviewProps {
  user: any;
  setActiveTab: (tab: string) => void;
  setShowLinksModal: (show: boolean) => void;
  createdLinks: any[];
  createdDonationLinks: any[];
  createdSubscriptionLinks: any[];
  createdCatalogues: any[];
  transfers: any[];
}

export const DashboardOverview = ({
  user,
  setActiveTab,
  setShowLinksModal,
  createdLinks,
  createdDonationLinks,
  createdSubscriptionLinks,
  createdCatalogues,
  transfers
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-8">
      {/* 1. Balance Section */}
      <BalanceSection user={user} setActiveTab={setActiveTab} />

      {/* 2. Active Links Section */}
      <ActiveLinksSection
        createdLinks={createdLinks}
        createdDonationLinks={createdDonationLinks}
        createdSubscriptionLinks={createdSubscriptionLinks}
        createdCatalogues={createdCatalogues}
        setShowLinksModal={setShowLinksModal}
      />

      {/* 3. Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <IncomeChart />
        <RevenuePieChart />
      </div>

      {/* 4. Virtual Card & Subscriptions Section */}
      <VirtualCardSection createdSubscriptionLinks={createdSubscriptionLinks} />

      {/* 5. History Section */}
      <DashboardHistorySection transfers={transfers} setActiveTab={setActiveTab} />

      {/* 6. Quick Actions Section */}
      <QuickActionsSection setActiveTab={setActiveTab} />
    </div>
  );
}; 