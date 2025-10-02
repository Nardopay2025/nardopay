import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for small businesses',
    features: [
      'Unlimited payment links',
      '4% transaction fee',
      'Basic analytics',
      'Email support',
      'Custom branding',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For growing businesses',
    popular: true,
    features: [
      'Everything in Starter',
      '3% transaction fee',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Multi-currency support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      '2% transaction fee',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
];

export const UpgradePlanDialog = ({ open, onOpenChange, currentPlan }: UpgradePlanDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    setLoading(true);
    
    try {
      // TODO: Implement actual plan upgrade logic with backend
      toast({
        title: 'Plan Upgrade Initiated',
        description: `Upgrading to ${planId} plan. You will be redirected to payment.`,
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your business needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 relative ${
                plan.popular ? 'border-primary border-2' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                disabled={currentPlan === plan.id || loading}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {currentPlan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          All plans include secure payments, fraud protection, and instant payouts
        </div>
      </DialogContent>
    </Dialog>
  );
};
