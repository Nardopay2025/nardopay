import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KPICard } from "@/components/admin/KPICard";
import { VolumeChart } from "@/components/admin/VolumeChart";
import { PaymentMethodChart } from "@/components/admin/PaymentMethodChart";
import { ProviderCard } from "@/components/admin/ProviderCard";
import { TransactionsTable } from "@/components/admin/TransactionsTable";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import { ProviderDetailModal } from "@/components/admin/ProviderDetailModal";
import { Building2, DollarSign, TrendingUp, Clock, Ban } from "lucide-react";

interface DashboardStats {
  totalMerchants: number;
  todayVolume: number;
  transactions24h: number;
  successRate: number;
  currency: string;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMerchants: 0,
    todayVolume: 0,
    transactions24h: 0,
    successRate: 0,
    currency: "KES",
  });
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total merchants
      const { count: merchantsCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayTransactions } = await supabase
        .from("transactions")
        .select("amount, currency, status")
        .gte("created_at", today.toISOString());

      // Calculate stats
      const completedToday = todayTransactions?.filter((t) => t.status === "completed") || [];
      const totalVolume = completedToday.reduce((sum, t) => sum + Number(t.amount), 0);
      const successRate = todayTransactions?.length 
        ? (completedToday.length / todayTransactions.length) * 100 
        : 0;

      // Fetch payment provider configs
      const { data: providerData } = await supabase
        .from("payment_provider_configs")
        .select("*");

      const mappedProviders = providerData?.map((p) => ({
        name: `${p.provider} (${p.country_code})`,
        status: p.is_active ? "connected" : "disconnected",
        successRate: 95,
        volume24h: "—",
      })) || [];

      setStats({
        totalMerchants: merchantsCount || 0,
        todayVolume: totalVolume,
        transactions24h: todayTransactions?.length || 0,
        successRate: successRate,
        currency: todayTransactions?.[0]?.currency || "KES",
      });
      setProviders(mappedProviders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time platform metrics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Merchants"
          value={stats.totalMerchants.toLocaleString()}
          icon={Building2}
        />
        <KPICard
          title="Today's Volume"
          value={`${stats.currency} ${stats.todayVolume.toLocaleString()}`}
          icon={DollarSign}
        />
        <KPICard
          title="Transactions (24h)"
          value={stats.transactions24h.toLocaleString()}
          icon={TrendingUp}
        />
        <KPICard
          title="Success Rate"
          value={`${stats.successRate.toFixed(1)}%`}
          changeType={stats.successRate > 95 ? "positive" : "negative"}
          icon={TrendingUp}
        />
        <KPICard
          title="Active Providers"
          value={providers.filter((p) => p.status === "connected").length.toString()}
          icon={Clock}
        />
        <KPICard
          title="Inactive Providers"
          value={providers.filter((p) => p.status === "disconnected").length.toString()}
          changeType={providers.filter((p) => p.status === "disconnected").length > 0 ? "negative" : "positive"}
          icon={Ban}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <VolumeChart />
          
          {/* Provider Cards */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Payment Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.length > 0 ? (
                providers.map((provider, idx) => (
                  <ProviderCard
                    key={idx}
                    {...provider}
                    onClick={() => setSelectedProvider(provider)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground col-span-2">No payment providers configured yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Payment Mix */}
        <div className="space-y-6">
          <AlertsPanel />
          <PaymentMethodChart />
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable />

      {/* Provider Detail Modal */}
      <ProviderDetailModal
        provider={selectedProvider}
        open={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />
    </div>
  );
}
