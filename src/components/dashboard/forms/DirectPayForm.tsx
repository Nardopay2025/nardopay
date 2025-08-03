import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DirectPayFormProps {
  setActiveTab: (tab: string) => void;
}

export const DirectPayForm = ({ setActiveTab }: DirectPayFormProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveTab('send-money')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Send Money to External Wallet</h1>
          <p className="text-muted-foreground">Send money to external bank accounts or mobile money</p>
        </div>
      </div>
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">Direct Pay Form - To be implemented</p>
      </div>
    </div>
  );
}; 