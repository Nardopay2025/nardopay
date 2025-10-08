import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PaymentMethod } from '@/lib/paymentRouter';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  merchantCountry: string;
  primaryColor?: string;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  merchantCountry,
  primaryColor = '#0EA5E9',
}: PaymentMethodSelectorProps) {
  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      icon: CreditCard,
      title: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      supported: false, // Will be enabled when Stripe is integrated
      comingSoon: true,
    },
    {
      id: 'mobile_money' as PaymentMethod,
      icon: Smartphone,
      title: 'Mobile Money',
      description: 'M-Pesa, Airtel Money, MTN, etc.',
      supported: ['KE', 'UG', 'TZ', 'MW', 'RW', 'ZM', 'ZW', 'NG'].includes(merchantCountry),
      comingSoon: false,
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      icon: Building2,
      title: 'Bank Transfer',
      description: 'Direct bank account payment',
      supported: ['KE', 'UG', 'TZ', 'MW', 'RW', 'ZM', 'ZW'].includes(merchantCountry),
      comingSoon: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose Payment Method</h2>
      <p className="text-sm text-muted-foreground">Select how you'd like to pay</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const isDisabled = !method.supported;

          return (
            <Card
              key={method.id}
              className={`
                relative p-6 cursor-pointer transition-all border-2
                ${isSelected ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !isDisabled && onSelectMethod(method.id)}
              style={{
                borderColor: isSelected ? primaryColor : undefined,
              }}
            >
              {method.comingSoon && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className="p-3 rounded-full bg-muted"
                  style={{
                    backgroundColor: isSelected ? `${primaryColor}20` : undefined,
                  }}
                >
                  <Icon
                    className="h-8 w-8"
                    style={{
                      color: isSelected ? primaryColor : undefined,
                    }}
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-base mb-1">{method.title}</h3>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>

                {!method.supported && !method.comingSoon && (
                  <p className="text-xs text-muted-foreground italic">
                    Not available in your region
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
