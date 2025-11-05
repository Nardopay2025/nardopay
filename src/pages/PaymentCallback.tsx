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
  const [isChecking, setIsChecking] = useState(false);

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
          
          // Redirect if configured - give user time to see success message
          const metadata = data.metadata as Record<string, any> | null;
          const redirectUrl = metadata?.redirect_url;
          if (redirectUrl) {
            setTimeout(() => {
              window.location.href = redirectUrl as string;
            }, 5000); // Increased to 5 seconds so user can see the success message
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

  const handleManualCheck = async () => {
    const transactionId = searchParams.get('transaction_id');
    if (!transactionId || isChecking) return;

    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('pesapal-check-status', {
        body: { transactionId }
      });

      if (error) throw error;

      if (data.status === 'completed') {
        setStatus('success');
        // Reload transaction details
        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', transactionId)
          .single();
        setTransaction(txData);
      } else if (data.status === 'failed') {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Manual check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

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
            <Button 
              onClick={handleManualCheck} 
              disabled={isChecking}
              variant="outline"
              className="mt-4"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                'Check Status Now'
              )}
            </Button>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-muted-foreground">
              Your payment has been processed successfully. Thank you!
            </p>
            {transaction && (
              <>
                <div className="mt-4 p-4 bg-muted rounded-lg text-left space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Amount:</span>{' '}
                    {transaction.currency} {parseFloat(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Reference:</span>{' '}
                    {transaction.reference}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className="text-green-600 font-medium">Completed</span>
                  </p>
                </div>
                
                {/* Show custom thank you message if configured */}
                {transaction.metadata && typeof transaction.metadata === 'object' && 'thank_you_message' in transaction.metadata && transaction.metadata.thank_you_message && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      {String(transaction.metadata.thank_you_message)}
                    </p>
                  </div>
                )}
                
                {/* Show redirect notice if configured */}
                {transaction.metadata && typeof transaction.metadata === 'object' && 'redirect_url' in transaction.metadata && transaction.metadata.redirect_url && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Redirecting you shortly...
                  </p>
                )}
              </>
            )}
            <Button onClick={() => navigate('/dashboard')} className="mt-6">
              Go to Dashboard
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
