import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Link2, 
  Heart, 
  RefreshCw, 
  ShoppingBag 
} from 'lucide-react';

interface CreateLinkSectionProps {
  setActiveTab: (tab: string) => void;
}

export const CreateLinkSection = ({ setActiveTab }: CreateLinkSectionProps) => {
  const linkOptions = [
    {
      id: 'payment-links',
      title: 'Payment Links',
      description: 'Create secure payment links for one-time transactions',
      icon: Link2,
      action: () => setActiveTab('payment-links')
    },
    {
      id: 'donation-links',
      title: 'Donation Links',
      description: 'Accept donations and contributions from supporters',
      icon: Heart,
      action: () => setActiveTab('donation-links')
    },
    {
      id: 'subscription-links',
      title: 'Subscription Links',
      description: 'Set up recurring payments and subscriptions',
      icon: RefreshCw,
      action: () => setActiveTab('subscription-links')
    },
    {
      id: 'catalogue',
      title: 'Catalogue',
      description: 'Create product catalogues for multiple items',
      icon: ShoppingBag,
      action: () => setActiveTab('catalogue')
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create a Link</h1>
        <p className="text-muted-foreground">Choose the type of link you want to create</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {linkOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.id} className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={option.action}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                <Button className="w-full">Create {option.title}</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 