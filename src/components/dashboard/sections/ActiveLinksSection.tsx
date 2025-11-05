import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [openLinkId, setOpenLinkId] = useState<string | null>(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'All' | 'Payment' | 'Donation' | 'Subscription' | 'Catalogue'>('All');
  
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
      url = `${baseUrl}/catalogue/${code}`;
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
      <Card className="p-6 h-full min-h-[320px]">
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Links</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No active links yet</p>
          <p className="text-sm mt-2">Create your first link to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full min-h-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Active Links</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{allLinks.length} total</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (openLinkId) {
                const current = allLinks.find(l => l.id === openLinkId);
                setSelectedType((current?.type as any) || 'All');
              } else {
                setSelectedType('All');
              }
              setViewAllOpen(true);
            }}
          >
            View All
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {allLinks.slice(0, 3).map((link) => {
          const isOpen = openLinkId === link.id;
          return (
            <div key={link.id} className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenLinkId(isOpen ? null : link.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
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
                <span className="ml-4 text-xs text-muted-foreground">{isOpen ? 'Hide' : 'Preview'}</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="mt-2 rounded-md bg-muted/40 p-3 text-sm">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {link.description && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Description:</span> {link.description}</div>
                      )}
                      {link.link_code && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Code:</span> {link.link_code}</div>
                      )}
                      {link.created_at && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Created:</span> {new Date(link.created_at).toLocaleDateString()}</div>
                      )}
                      {link.status && (
                        <div className="min-w-[200px]"><span className="text-muted-foreground">Status:</span> {link.status}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => copyLink(link.link_code, link.type)}
                    >
                      <Copy className="h-4 w-4 mr-1" /> Copy Link
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4 mr-1" /> More
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
              )}
            </div>
          );
        })}
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

      <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle>All Active Links</DialogTitle>
            <DialogDescription>Manage all your active links in one place</DialogDescription>
          </DialogHeader>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['All','Payment','Donation','Subscription','Catalogue'] as const).map(t => (
              <Button
                key={t}
                size="sm"
                variant={selectedType === t ? 'default' : 'outline'}
                onClick={() => setSelectedType(t)}
              >
                {t}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            {allLinks
              .filter(l => selectedType === 'All' ? true : l.type === selectedType)
              .map((link) => (
              <div key={link.id} className="border border-border rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{link.type}</Badge>
                      <span className="font-medium text-foreground truncate">
                        {link.product_name || link.title || link.plan_name || link.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {link.amount ? `${link.currency} ${link.amount}` : link.goal_amount ? `Goal: ${link.currency} ${link.goal_amount}` : 'Multiple items'}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyLink(link.link_code, link.type)}>
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setViewAllOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};