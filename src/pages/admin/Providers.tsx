import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProviderCard } from "@/components/admin/ProviderCard";
import { ProviderDetailModal } from "@/components/admin/ProviderDetailModal";
import { Plus, Settings, TrendingUp, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminProviders() {
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_provider_configs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedProviders = data?.map((p) => ({
        name: `${p.provider} (${p.country_code})`,
        status: p.is_active ? "connected" : "disconnected",
        provider: p.provider,
        country_code: p.country_code,
        environment: p.environment,
        successRate: 95,
        volume24h: "—",
        transactions: 0,
        avgResponseTime: "—",
        lastSync: "—",
      })) || [];

      setProviders(mappedProviders);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectedProviders = providers.filter((p) => p.status === "connected");
  const avgSuccessRate = connectedProviders.length
    ? connectedProviders.reduce((sum, p) => sum + p.successRate, 0) / connectedProviders.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Providers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor payment gateway integrations
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/admin/settings")}>
          <Plus className="h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Settings className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Providers</p>
              <p className="text-2xl font-bold">{connectedProviders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Success Rate</p>
              <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Providers</p>
              <p className="text-2xl font-bold">
                {providers.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issues</p>
              <p className="text-2xl font-bold">
                {providers.filter((p) => p.status === "disconnected").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Providers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Active Providers</h2>
          <Badge variant="secondary">{connectedProviders.length} connected</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedProviders.length > 0 ? (
            connectedProviders.map((provider, idx) => (
              <ProviderCard
                key={idx}
                {...provider}
                onClick={() => setSelectedProvider(provider)}
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-3">No active providers configured.</p>
          )}
        </div>
      </div>

      {/* Inactive Providers */}
      {providers.filter((p) => p.status === "disconnected").length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Inactive Providers</h2>
            <Badge variant="destructive">
              {providers.filter((p) => p.status === "disconnected").length} disconnected
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers
              .filter((p) => p.status === "disconnected")
              .map((provider, idx) => (
                <ProviderCard
                  key={idx}
                  {...provider}
                  onClick={() => setSelectedProvider(provider)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Provider Details Modal */}
      <ProviderDetailModal
        provider={selectedProvider}
        open={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />
    </div>
  );
}
