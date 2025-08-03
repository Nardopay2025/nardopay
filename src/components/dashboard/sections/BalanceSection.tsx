import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BalanceSectionProps {
  user: any;
  setActiveTab: (tab: string) => void;
}

export const BalanceSection = ({ user, setActiveTab }: BalanceSectionProps) => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex-1">
          <div>
            <div className="text-2xl font-bold text-white">$12,450.00</div>
            <div className="text-sm text-blue-100">Available Balance</div>
          </div>
        </Card>
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab('deposit')} 
            className="bg-white text-gray-900 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Deposit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab('withdraw')} 
            className="bg-white text-gray-900 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </>
  );
}; 