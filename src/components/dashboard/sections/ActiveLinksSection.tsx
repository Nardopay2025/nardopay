import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Link2,
  Heart,
  RefreshCw,
  ShoppingBag,
  Users
} from 'lucide-react';

interface ActiveLinksSectionProps {
  createdLinks: any[];
  createdDonationLinks: any[];
  createdSubscriptionLinks: any[];
  createdCatalogues: any[];
  setShowLinksModal: (show: boolean) => void;
}

export const ActiveLinksSection = ({ 
  createdLinks, 
  createdDonationLinks, 
  createdSubscriptionLinks, 
  createdCatalogues, 
  setShowLinksModal 
}: ActiveLinksSectionProps) => {
  const [showModal, setShowModal] = useState(false);
  const totalLinks = createdLinks.length + createdDonationLinks.length + createdSubscriptionLinks.length + createdCatalogues.length;

  // Combine all links with their types and mock customer data
  const getAllActiveLinks = () => {
    const allLinks = [
      ...createdLinks.map(link => ({
        ...link,
        type: 'Payment Link',
        typeIcon: Link2,
        customers: Math.floor(Math.random() * 50) + 5, // Mock customer count
        status: 'active'
      })),
      ...createdDonationLinks.map(link => ({
        ...link,
        type: 'Donation Link',
        typeIcon: Heart,
        customers: Math.floor(Math.random() * 30) + 2,
        status: 'active'
      })),
      ...createdSubscriptionLinks.map(link => ({
        ...link,
        type: 'Subscription Link',
        typeIcon: RefreshCw,
        customers: Math.floor(Math.random() * 20) + 1,
        status: 'active'
      })),
      ...createdCatalogues.map(catalogue => ({
        ...catalogue,
        type: 'Catalogue',
        typeIcon: ShoppingBag,
        customers: Math.floor(Math.random() * 40) + 3,
        status: 'active'
      }))
    ];
    
    return allLinks;
  };

  const handleCardClick = () => {
    setShowModal(true);
    setShowLinksModal(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Active Links</h2>
      <Card className="bg-card/80 backdrop-blur-sm p-6 cursor-pointer hover:shadow-lg" onClick={handleCardClick}>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-foreground">{totalLinks}</div>
          <div className="text-sm text-muted-foreground">Total Active Links</div>
        </div>
      </Card>

      {/* Active Links Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Active Links Overview
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {getAllActiveLinks().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active links found</p>
                <Button onClick={() => setShowModal(false)} className="mt-4">
                  Create Your First Link
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {getAllActiveLinks().map((link, index) => {
                  const TypeIcon = link.typeIcon;
                  return (
                    <Card key={link.id || index} className="bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <TypeIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{link.title || link.name || `Link ${index + 1}`}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {link.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {link.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>Customers</span>
                              </div>
                              <div className="text-lg font-bold text-foreground">{link.customers}</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Amount</div>
                              <div className="text-lg font-bold text-foreground">
                                ${link.amount ? parseFloat(link.amount).toLocaleString() : '0'}
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                        
                        {link.description && (
                          <p className="text-sm text-muted-foreground mt-3">
                            {link.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 