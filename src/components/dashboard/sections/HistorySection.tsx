import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Download,
  Calendar
} from 'lucide-react';

interface HistorySectionProps {
  transfers: any[];
}

export const HistorySection = ({ transfers }: HistorySectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Enhanced mock data for comprehensive history
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

  // Filter transactions based on search and filters
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = transaction.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || transaction.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-muted-foreground">View all your incoming and outgoing transactions</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment link">Payment Links</SelectItem>
                <SelectItem value="donation link">Donation Links</SelectItem>
                <SelectItem value="subscription link">Subscription Links</SelectItem>
                <SelectItem value="catalogue">Catalogues</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{filteredTransactions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold text-green-600">
                  ${filteredTransactions
                    .filter(t => t.amount > 0)
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <ArrowDownLeft className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold text-red-600">
                  ${Math.abs(filteredTransactions
                    .filter(t => t.amount < 0)
                    .reduce((sum, t) => sum + t.amount, 0))
                    .toFixed(2)}
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p className="text-2xl font-bold">
                  ${filteredTransactions
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Counterparty</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transactions found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                          <span className="font-medium">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`font-mono font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{transaction.counterparty}</div>
                        <div className="text-xs text-muted-foreground">{transaction.currency}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {transaction.description}
                      </td>
                      <td className="p-3">
                        {new Date(transaction.date).toLocaleDateString()}
                        <div className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {transaction.method}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 