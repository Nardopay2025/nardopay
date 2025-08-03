import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  Globe 
} from 'lucide-react';

interface SendMoneySectionProps {
  setActiveTab: (tab: string) => void;
}

export const SendMoneySection = ({ setActiveTab }: SendMoneySectionProps) => {
  const sendOptions = [
    {
      id: 'nardopay-wallet',
      title: 'Nardopay Wallet',
      description: 'Send money to another Nardopay user instantly',
      icon: Wallet,
      action: () => setActiveTab('send')
    },
    {
      id: 'external-wallet',
      title: 'External Wallet',
      description: 'Send money to external bank accounts or mobile money',
      icon: Globe,
      action: () => setActiveTab('direct-pay')
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Send Money</h1>
        <p className="text-muted-foreground">Choose how you want to send money</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {sendOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.id} className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={option.action}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                <Button className="w-full">Send to {option.title}</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 