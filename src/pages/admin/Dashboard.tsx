import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Routes, Route } from "react-router-dom";
import AdminOverview from "./Overview";
import AdminUsers from "./Users";
import AdminTransactions from "./Transactions";
import AdminProviders from "./Providers";
import AdminSettings from "./Settings";
import { Menu } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        
        <div className="flex-1 min-h-screen w-full bg-background">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 lg:hidden bg-background/95 backdrop-blur-sm border-b p-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Admin Panel</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route index element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="providers" element={<AdminProviders />} />
                  <Route path="analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold">Analytics</h2><p className="text-muted-foreground mt-2">Coming soon in Phase 4</p></div>} />
                  <Route path="settings" element={<AdminSettings />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
