import { Button } from '@/components/ui/button';

interface QuickActionsSectionProps {
  setActiveTab: (tab: string) => void;
}

export const QuickActionsSection = ({ setActiveTab }: QuickActionsSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Button variant="outline" onClick={() => setActiveTab('create-link')}>Create Link</Button>
        <Button variant="outline" onClick={() => setActiveTab('send-money')}>Send Money</Button>
        <Button variant="outline" onClick={() => setActiveTab('make-payment')}>Make Payment</Button>
        <Button variant="outline" onClick={() => setActiveTab('deposit')}>Deposit</Button>
        <Button variant="outline" onClick={() => setActiveTab('withdraw')}>Withdraw</Button>
      </div>
    </div>
  );
}; 