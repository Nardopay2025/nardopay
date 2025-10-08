import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Wallet, 
  Settings,
  Shield,
  TrendingUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const adminMenuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { id: "users", label: "Users", icon: Users, path: "/admin/users" },
  { id: "transactions", label: "Transactions", icon: Receipt, path: "/admin/transactions" },
  { id: "providers", label: "Providers", icon: Wallet, path: "/admin/providers" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const collapsed = state === "collapsed";

  const getUserInitials = () => {
    if (!user?.email) return "A";
    return user.email.charAt(0).toUpperCase();
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r-0">
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-semibold text-lg block">Admin</span>
                <span className="text-xs text-slate-400">Control Panel</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarContent className="flex-1 px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 px-2">
              {!collapsed && "Management"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={`w-full justify-start gap-3 transition-all ${
                        isActive(item.path)
                          ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-l-2 border-orange-500"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-600">
              <AvatarFallback className="text-white font-semibold bg-transparent">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-slate-200">{user?.email}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-0 h-auto"
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
