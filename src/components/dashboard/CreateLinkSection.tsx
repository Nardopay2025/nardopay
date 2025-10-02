import { Card } from '@/components/ui/card';
import { Link as LinkIcon, Heart, RefreshCw, ShoppingBag } from 'lucide-react';

interface CreateLinkSectionProps {
  onSelectType: (type: string) => void;
}

export const CreateLinkSection = ({ onSelectType }: CreateLinkSectionProps) => {
  const linkTypes = [
    {
      id: 'payment-links',
      title: 'Payment Link',
      description: 'Create a single payment link for products or services',
      icon: LinkIcon,
      color: 'bg-blue-500',
    },
    {
      id: 'donation-links',
      title: 'Donation Link',
      description: 'Create a donation campaign with goal tracking',
      icon: Heart,
      color: 'bg-pink-500',
    },
    {
      id: 'subscription-links',
      title: 'Subscription Link',
      description: 'Create recurring subscription plans',
      icon: RefreshCw,
      color: 'bg-purple-500',
    },
    {
      id: 'catalogue',
      title: 'Catalogue',
      description: 'Create a product catalogue with multiple items',
      icon: ShoppingBag,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Create a Link</h2>
        <p className="text-muted-foreground mt-1">
          Choose the type of link you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {linkTypes.map((type) => (
          <Card
            key={type.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => onSelectType(type.id)}
          >
            <div className="flex items-start gap-4">
              <div className={`${type.color} p-3 rounded-lg text-white`}>
                <type.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};