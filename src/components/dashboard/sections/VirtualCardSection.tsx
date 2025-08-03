import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Eye, EyeOff, CreditCard as CreditCardIcon } from 'lucide-react';

interface VirtualCardSectionProps {
  createdSubscriptionLinks: any[];
}

export const VirtualCardSection = ({ createdSubscriptionLinks }: VirtualCardSectionProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);

  const cardData = {
    number: '4532 1234 5678 9012',
    maskedNumber: '**** **** **** 9012',
    holderName: 'John Doe',
    expiryDate: '12/25',
    cvv: '123',
    bankName: 'Nardopay'
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleCardNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullNumber(!showFullNumber);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Virtual Card & Subscriptions</h2>
      
      {/* Credit Card Container */}
      <div className="relative mb-6 perspective-1000">
        <div className="text-center mb-2">
          <p className="text-sm text-muted-foreground">Tap to view back details</p>
        </div>
        <div 
          className={`relative w-full h-48 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleCardClick}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <Card className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl p-6 text-white shadow-xl border-0">
              <div className="h-full flex flex-col justify-between">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm font-medium">Virtual Card</span>
                  </div>
                  <span className="text-sm font-medium">{cardData.bankName}</span>
                </div>

                {/* Middle Section */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-xl font-mono tracking-wider">
                      {showFullNumber ? cardData.number : cardData.maskedNumber}
                    </div>
                    <button
                      onClick={toggleCardNumber}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      {showFullNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-blue-200 mb-1">Card Holder</div>
                    <div className="font-medium">{cardData.holderName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-200 mb-1">Expires</div>
                    <div className="font-medium">{cardData.expiryDate}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <Card className="w-full h-full bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-xl p-6 text-white shadow-xl border-0">
              <div className="h-full flex flex-col justify-between">
                {/* Top Section - Magnetic Stripe */}
                <div className="w-full h-8 bg-black rounded-t-lg"></div>
                
                {/* Middle Section - Signature Panel */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="bg-white/20 rounded-lg p-3 mb-4">
                    <div className="text-xs text-blue-200 mb-1">CVV</div>
                    <div className="font-mono text-lg tracking-wider">{cardData.cvv}</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs text-blue-200 mb-1">Full Card Number</div>
                    <div className="font-mono text-sm tracking-wider">{cardData.number}</div>
                  </div>
                </div>


              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Manage Subscriptions Button */}
      <div className="text-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => setShowSubscriptionsModal(true)}
          className="flex items-center gap-2"
        >
          <CreditCardIcon className="w-4 h-4" />
          Manage Subscriptions
        </Button>
      </div>



      {/* Subscriptions Modal */}
      <Dialog open={showSubscriptionsModal} onOpenChange={setShowSubscriptionsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              Active Subscriptions
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This card has been used to pay for the following subscriptions:
            </p>
            
            {createdSubscriptionLinks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active subscriptions found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This card hasn't been used for any subscriptions yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {createdSubscriptionLinks.map(sub => (
                  <Card key={sub.id} className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{sub.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {sub.amount} / {sub.billingCycle}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom CSS for 3D flip animation */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}; 