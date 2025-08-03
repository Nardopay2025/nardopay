import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  ArrowDownLeft
} from 'lucide-react';

interface DashboardHistorySectionProps {
  transfers: any[];
  setActiveTab: (tab: string) => void;
}

export const DashboardHistorySection = ({ transfers, setActiveTab }: DashboardHistorySectionProps) => {
  // Enhanced mock data for recent transactions
  const allTransactions = [
    // Payment Links
    { id: 1, type: 'Payment Link', amount: 150.00, counterparty: 'john@example.com', date: '2024-01-15', status: 'Completed', method: 'Mobile Money', currency: 'USD', description: 'Product purchase' },
    { id: 2, type: 'Payment Link', amount: 75.50, counterparty: 'jane@example.com', date: '2024-01-14', status: 'Completed', method: 'Card', currency: 'USD', description: 'Service payment' },
    { id: 3, type: 'Payment Link', amount: 200.00, counterparty: 'bob@example.com', date: '2024-01-13', status: 'Pending', method: 'Bank Transfer', currency: 'USD', description: 'Invoice payment' },
    
    // Donation Links
    { id: 4, type: 'Donation Link', amount: 25.00, counterparty: 'donor1@example.com', date: '2024-01-12', status: 'Completed', method: 'Mobile Money', currency: 'USD', description: 'Charity donation' },
    { id: 5, type: 'Donation Link', amount: 50.00, counterparty: 'donor2@example.com', date: '2024-01-11', status: 'Completed', method: 'Card', currency: 'USD', description: 'Fundraiser contribution' },
    
    // Subscription Links
    { id: 6, type: 'Subscription Link', amount: 29.99, counterparty: 'subscriber1@example.com', date: '2024-01-10', status: 'Completed', method: 'Card', currency: 'USD', description: 'Monthly subscription' },
    { id: 7, type: 'Subscription Link', amount: 19.99, counterparty: 'subscriber2@example.com', date: '2024-01-09', status: 'Failed', method: 'Card', currency: 'USD', description: 'Premium plan' },
    
    // Catalogue Sales
    { id: 8, type: 'Catalogue', amount: 89.99, counterparty: 'customer1@example.com', date: '2024-01-08', status: 'Completed', method: 'Mobile Money', currency: 'USD', description: 'Electronics purchase' },
    { id: 9, type: 'Catalogue', amount: 45.50, counterparty: 'customer2@example.com', date: '2024-01-07', status: 'Completed', method: 'Card', currency: 'USD', description: 'Clothing order' },
    
    // Direct Transfers
    { id: 10, type: 'Transfer', amount: -100.00, counterparty: 'friend@example.com', date: '2024-01-06', status: 'Completed', method: 'Mobile Money', currency: 'USD', description: 'Money sent to friend' },
    { id: 11, type: 'Transfer', amount: 250.00, counterparty: 'colleague@example.com', date: '2024-01-05', status: 'Completed', method: 'Bank Transfer', currency: 'USD', description: 'Payment received' },
    
    // Deposits and Withdrawals
    { id: 12, type: 'Deposit', amount: 500.00, counterparty: 'Bank Account', date: '2024-01-04', status: 'Completed', method: 'Bank Transfer', currency: 'USD', description: 'Account funding' },
    { id: 13, type: 'Withdrawal', amount: -200.00, counterparty: 'Bank Account', date: '2024-01-03', status: 'Completed', method: 'Bank Transfer', currency: 'USD', description: 'Cash withdrawal' },
  ];

  // Get the 5 most recent transactions
  const recentTransactions = allTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Payment Link': return '💳';
      case 'Donation Link': return '❤️';
      case 'Subscription Link': return '🔄';
      case 'Catalogue': return '🛍️';
      case 'Transfer': return '↔️';
      case 'Deposit': return '💰';
      case 'Withdrawal': return '💸';
      default: return '📄';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent transactions</p>
              </div>
            ) : (
              recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                    <div>
                      <div className="font-medium text-foreground">{transaction.counterparty}</div>
                      <div className="text-sm text-muted-foreground">{transaction.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`font-mono font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('history')}
            >
              See all history
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 