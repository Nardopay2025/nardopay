import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const HistoryTab = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'payment' | 'donation' | 'subscription' | 'transfer' | 'deposit' | 'withdrawal'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7d' | '30d'>('30d');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const dateBounds = useMemo(() => {
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        return { from: startOfDay(now), to: endOfDay(now) };
      case '7d':
        return { from: startOfDay(subDays(now, 7)), to: endOfDay(now) };
      case '30d':
        return { from: startOfDay(subDays(now, 30)), to: endOfDay(now) };
      default:
        return null;
    }
  }, [dateFilter]);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, dateFilter, debouncedSearch]);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, typeFilter, statusFilter, dateFilter, debouncedSearch, page]);

  const fetchTransactions = async () => {
    if (!user) return;
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      let query = supabase
        .from('transactions')
        .select('id,type,amount,currency,status,created_at,description,reference')
        .order('created_at', { ascending: false })
        .eq('user_id', user.id);

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (dateBounds) {
        query = query
          .gte('created_at', dateBounds.from.toISOString())
          .lte('created_at', dateBounds.to.toISOString());
      }
      if (debouncedSearch) {
        query = query.or(`description.ilike.%${debouncedSearch}%,reference.ilike.%${debouncedSearch}%`);
      }
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (error) throw error;
      if (page === 1) {
        setTransactions(data || []);
      } else {
        setTransactions(prev => [...prev, ...(data || [])]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (page === 1) setTransactions([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
        <p className="text-muted-foreground mt-1">
          View all your transactions and payments
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search description or reference..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="donation">Donations</SelectItem>
              <SelectItem value="subscription">Subscriptions</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
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
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy • HH:mm')}
                      {transaction.reference ? ` • ${transaction.reference}` : ''}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground">
                        {transaction.description}
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
              </div>
            ))}
            <div className="pt-2 flex justify-center">
              <button
                className="text-sm px-4 py-2 border border-border rounded-md hover:bg-accent/50 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};