import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold">Payment Cancelled</h2>
          <p className="text-muted-foreground">
            You have cancelled the payment process. No charges have been made.
          </p>
          <Button onClick={() => navigate('/')} className="mt-6">
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
