import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    const orderTrackingId = searchParams.get('OrderTrackingId');

    if (!transactionId) {
      setStatus('failed');
      return;
    }

    const checkTransaction = async () => {
      try {
        // Wait a moment for IPN to process
        await new Promise(resolve => setTimeout(resolve, 3000));

        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', transactionId)
          .single();

        if (error || !data) {
          setStatus('failed');
          return;
        }

        setTransaction(data);

        if (data.status === 'completed') {
          setStatus('success');
          
          // Show thank you message if configured
          const metadata = data.metadata as Record<string, any> | null;
          const thankYouMessage = metadata?.thank_you_message;
          if (thankYouMessage) {
            // Could display this in a toast or on the page
          }

          // Redirect if configured
          const redirectUrl = metadata?.redirect_url;
          if (redirectUrl) {
            setTimeout(() => {
              window.location.href = redirectUrl as string;
            }, 3000);
          }
        } else if (data.status === 'failed') {
          setStatus('failed');
        } else {
          // Still pending, check again
          setTimeout(checkTransaction, 2000);
        }
      } catch (error) {
        console.error('Error checking transaction:', error);
        setStatus('failed');
      }
    };

    checkTransaction();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        {status === 'loading' && (
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Processing Your Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-muted-foreground">
              Your payment has been processed successfully.
            </p>
            {transaction && (
              <div className="mt-4 p-4 bg-muted rounded-lg text-left space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Amount:</span>{' '}
                  {transaction.currency} {parseFloat(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Reference:</span>{' '}
                  {transaction.reference}
                </p>
              </div>
            )}
            <Button onClick={() => navigate('/')} className="mt-6">
              Return to Home
            </Button>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center space-y-4">
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold text-destructive">Payment Failed</h2>
            <p className="text-muted-foreground">
              We couldn't process your payment. Please try again.
            </p>
            <Button onClick={() => navigate('/')} variant="outline" className="mt-6">
              Return to Home
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
