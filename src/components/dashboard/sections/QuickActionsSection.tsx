import { Card } from '@/components/ui/card';
import { Plus, Send, History, Link as LinkIcon, Heart, Settings } from 'lucide-react';

interface QuickActionsSectionProps {
  onActionClick: (action: string) => void;
}

export const QuickActionsSection = ({ onActionClick }: QuickActionsSectionProps) => {
  const actions = [
    { id: 'create-link', label: 'Create Link', icon: Plus, color: 'bg-blue-500' },
    { id: 'send-money', label: 'Send Money', icon: Send, color: 'bg-green-500' },
    { id: 'payment-links', label: 'Payment Links', icon: LinkIcon, color: 'bg-orange-500' },
    { id: 'donation-links', label: 'Donations', icon: Heart, color: 'bg-pink-500' },
    { id: 'history', label: 'History', icon: History, color: 'bg-gray-500' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-purple-500' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.id)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <div className={`${action.color} p-3 rounded-full text-white`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};