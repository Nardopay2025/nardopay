import { BalanceSection } from './sections/BalanceSection';
import { QuickActionsSection } from './sections/QuickActionsSection';
import { ActiveLinksSection } from './sections/ActiveLinksSection';
import { HistorySection } from './sections/HistorySection';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
  paymentLinks: any[];
  donationLinks: any[];
  subscriptionLinks: any[];
  catalogues: any[];
  transactions: any[];
}

export const DashboardOverview = ({
  setActiveTab,
  paymentLinks,
  donationLinks,
  subscriptionLinks,
  catalogues,
  transactions,
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Balance Section */}
      <BalanceSection
        onWithdraw={() => setActiveTab('withdraw')}
      />

      {/* Quick Actions - Mobile */}
      <div className="lg:hidden">
        <QuickActionsSection onActionClick={setActiveTab} />
      </div>

      {/* Active Links (left) and Recent Transactions (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <ActiveLinksSection
            paymentLinks={paymentLinks}
            donationLinks={donationLinks}
            subscriptionLinks={subscriptionLinks}
            catalogues={catalogues}
          />
        </div>
        <div className="h-full">
          <HistorySection
            transactions={transactions}
            onViewAll={() => setActiveTab('history')}
          />
        </div>
      </div>

      {/* Quick Actions - Desktop */}
      <div className="hidden lg:block">
        <QuickActionsSection onActionClick={setActiveTab} />
      </div>
    </div>
  );
};