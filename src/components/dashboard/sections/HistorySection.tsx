import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description?: string;
}

interface HistorySectionProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

export const HistorySection = ({ transactions, onViewAll }: HistorySectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'failed':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions yet</p>
          <p className="text-sm mt-2">Your transaction history will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'deposit' ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {transaction.type === 'deposit' ? (
                  <ArrowDownRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground capitalize">
                  {transaction.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {transaction.currency} {transaction.amount}
              </p>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};