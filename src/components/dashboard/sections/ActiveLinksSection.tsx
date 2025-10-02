import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface ActiveLinksSectionProps {
  paymentLinks: any[];
  donationLinks: any[];
  subscriptionLinks: any[];
  catalogues: any[];
}

export const ActiveLinksSection = ({
  paymentLinks,
  donationLinks,
  subscriptionLinks,
  catalogues,
}: ActiveLinksSectionProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: string; type: string; name: string } | null>(null);
  
  const allLinks = [
    ...paymentLinks.map(l => ({ ...l, type: 'Payment' })),
    ...donationLinks.map(l => ({ ...l, type: 'Donation' })),
    ...subscriptionLinks.map(l => ({ ...l, type: 'Subscription' })),
    ...catalogues.map(l => ({ ...l, type: 'Catalogue' })),
  ];

  const copyLink = (code: string, type: string) => {
    const baseUrl = window.location.origin;
    let url = '';
    
    if (type === 'Payment') {
      url = `${baseUrl}/pay/${code}`;
    } else if (type === 'Donation') {
      url = `${baseUrl}/donate/${code}`;
    } else if (type === 'Subscription') {
      url = `${baseUrl}/subscribe/${code}`;
    } else if (type === 'Catalogue') {
      url = `${baseUrl}/shop/${code}`;
    }
    
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied!',
      description: `${type} link copied to clipboard`,
    });
  };

  const handleDeleteClick = (link: any) => {
    setLinkToDelete({
      id: link.id,
      type: link.type,
      name: link.product_name || link.title || link.plan_name || link.name,
    });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;

    const tableMap: { [key: string]: string } = {
      Payment: 'payment_links',
      Donation: 'donation_links',
      Subscription: 'subscription_links',
      Catalogue: 'catalogues',
    };

    const tableName = tableMap[linkToDelete.type] as 'payment_links' | 'donation_links' | 'subscription_links' | 'catalogues';

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', linkToDelete.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Link deleted',
        description: `${linkToDelete.type} link deleted successfully`,
      });
      // Refresh the page to update the list
      window.location.reload();
    }

    setDeleteDialogOpen(false);
    setLinkToDelete(null);
  };

  if (allLinks.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Links</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No active links yet</p>
          <p className="text-sm mt-2">Create your first link to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Active Links</h3>
        <Badge variant="secondary">{allLinks.length} total</Badge>
      </div>
      
      <div className="space-y-3">
        {allLinks.slice(0, 5).map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {link.type}
                </Badge>
                <span className="font-medium text-foreground truncate">
                  {link.product_name || link.title || link.plan_name || link.name}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {link.amount ? `${link.currency} ${link.amount}` : link.goal_amount ? `Goal: ${link.currency} ${link.goal_amount}` : 'Multiple items'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyLink(link.link_code, link.type)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteClick(link)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{linkToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};