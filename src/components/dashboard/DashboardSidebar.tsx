import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  Plus,
  PiggyBank,
  ArrowUpRight,
  History
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  user: any;
  logout: () => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'create-link', label: 'Create a Link', icon: Plus },
  { id: 'send-money', label: 'Send Money', icon: Send },
  { id: 'make-payment', label: 'Make Payment', icon: CreditCard },
  { id: 'deposit', label: 'Deposit', icon: PiggyBank },
  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DashboardSidebar = ({ 
  activeTab, 
  setActiveTab, 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  user, 
  logout 
}: DashboardSidebarProps) => {
  return (
    <div className={`bg-gradient-to-b from-blue-500 to-blue-700 text-white border-r border-blue-600 transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    } fixed left-0 top-0 h-full z-50`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-blue-600">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">N</span>
                </div>
                <span className="font-bold text-lg text-white">Nardopay</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto text-white hover:bg-blue-600/50"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  sidebarCollapsed ? 'px-2' : 'px-3'
                } ${
                  activeTab === item.id 
                    ? 'bg-white text-blue-600 hover:bg-white/90' 
                    : 'text-white hover:bg-blue-600/50'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="w-4 h-4" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{user?.name || 'ndorotakura'}</p>
                <p className="text-xs text-blue-200 truncate">{user?.email || 'ndorotakura@gmail.com'}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={`${sidebarCollapsed ? 'px-2' : 'px-3'} text-white hover:bg-blue-600/50`}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 