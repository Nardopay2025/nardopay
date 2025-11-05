import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description?: string;
  metadata?: any;
}

interface HistorySectionProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

export const HistorySection = ({ transactions, onViewAll }: HistorySectionProps) => {
  const [openTxId, setOpenTxId] = useState<string | null>(null);
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
      <Card className="p-6 h-full min-h-[320px]">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions yet</p>
          <p className="text-sm mt-2">Your transaction history will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full min-h-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 3).map((transaction) => {
          const isOpen = openTxId === transaction.id;
          return (
            <div key={transaction.id} className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenTxId(isOpen ? null : transaction.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
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
                    {(transaction as any).metadata && ((transaction as any).metadata.payer_name || (transaction as any).metadata.payer_email || (transaction as any).metadata.phone) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(transaction as any).metadata.payer_name || ''}
                        {((transaction as any).metadata.payer_name && ((transaction as any).metadata.payer_email || (transaction as any).metadata.phone)) ? ' • ' : ''}
                        {((transaction as any).metadata.payer_email) || ((transaction as any).metadata.phone) || ''}
                      </p>
                    )}
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
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="mt-2 rounded-md bg-muted/40 p-3 text-sm">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {transaction.description && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Description:</span> {transaction.description}</div>
                      )}
                      {(transaction as any).metadata?.payer_name && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Customer:</span> {(transaction as any).metadata.payer_name}</div>
                      )}
                      {(transaction as any).metadata?.payer_email && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Email:</span> {(transaction as any).metadata.payer_email}</div>
                      )}
                      {(transaction as any).metadata?.phone && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Phone:</span> {(transaction as any).metadata.phone}</div>
                      )}
                      <div className="min-w-[200px]"><span className="text-muted-foreground">Transaction ID:</span> {transaction.id}</div>
                      <div className="min-w-[200px]"><span className="text-muted-foreground">Date:</span> {format(new Date(transaction.created_at), 'PPpp')}</div>
                      <div className="min-w-[200px]"><span className="text-muted-foreground">Status:</span> {transaction.status}</div>
                      <div className="min-w-[200px]"><span className="text-muted-foreground">Amount:</span> {transaction.currency} {transaction.amount}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" onClick={onViewAll}>Open full history</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};