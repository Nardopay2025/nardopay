import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PaymentMethod, isPaymentMethodSupported } from '@/lib/paymentRouter';

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
      supported: isPaymentMethodSupported('card', merchantCountry),
    },
    {
      id: 'mobile_money' as PaymentMethod,
      icon: Smartphone,
      title: 'Mobile Money',
      description: 'M-Pesa, Airtel Money, MTN, etc.',
      supported: isPaymentMethodSupported('mobile_money', merchantCountry),
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      icon: Building2,
      title: 'Bank Transfer',
      description: 'Direct bank account payment',
      supported: isPaymentMethodSupported('bank_transfer', merchantCountry),
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select how you'd like to pay</p>
      
      <div className="grid grid-cols-1 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const isDisabled = !method.supported;

          return (
            <Card
              key={method.id}
              className={`
                relative p-4 cursor-pointer transition-all border-2
                ${isSelected ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !isDisabled && onSelectMethod(method.id)}
              style={{
                borderColor: isSelected ? primaryColor : undefined,
              }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="p-2 rounded-full bg-muted flex-shrink-0"
                  style={{
                    backgroundColor: isSelected ? `${primaryColor}20` : undefined,
                  }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{
                      color: isSelected ? primaryColor : undefined,
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">{method.title}</h3>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                  {!method.supported && (
                    <p className="text-xs text-destructive italic mt-1">
                      Not available in your region
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
