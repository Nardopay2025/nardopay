import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionLink {
  id: string;
  title: string;
  description: string;
  amount: string;
  currency: string;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  trialDays: number;
  thankYouMessage: string;
  redirectUrl: string;
  link: string;
  status: string;
  createdAt: string;
  subscribers: number;
  totalRevenue: string;
  nextBillingDate: string;
}

interface SubscriptionLinksContextType {
  subscriptionLinks: SubscriptionLink[];
  addSubscriptionLink: (link: SubscriptionLink) => void;
  getSubscriptionLink: (id: string) => SubscriptionLink | undefined;
  updateSubscriptionStats: (id: string, newSubscriber: boolean) => void;
}

const SubscriptionLinksContext = createContext<SubscriptionLinksContextType | undefined>(undefined);

export const useSubscriptionLinks = () => {
  const context = useContext(SubscriptionLinksContext);
  if (context === undefined) {
    throw new Error('useSubscriptionLinks must be used within a SubscriptionLinksProvider');
  }
  return context;
};

interface SubscriptionLinksProviderProps {
  children: ReactNode;
}

export const SubscriptionLinksProvider: React.FC<SubscriptionLinksProviderProps> = ({ children }) => {
  const [subscriptionLinks, setSubscriptionLinks] = useState<SubscriptionLink[]>([]);

  const addSubscriptionLink = (link: SubscriptionLink) => {
    setSubscriptionLinks(prev => [link, ...prev]);
    // Also save to localStorage for persistence
    const updatedLinks = [link, ...subscriptionLinks];
    localStorage.setItem('nardopay-subscription-links', JSON.stringify(updatedLinks));
  };

  const getSubscriptionLink = (id: string) => {
    return subscriptionLinks.find(link => link.id === id);
  };

  const updateSubscriptionStats = (id: string, newSubscriber: boolean) => {
    setSubscriptionLinks(prev => prev.map(link => {
      if (link.id === id) {
        const currentSubscribers = link.subscribers;
        const currentRevenue = parseFloat(link.totalRevenue.replace(/[^0-9.-]+/g, ''));
        const subscriptionAmount = parseFloat(link.amount.replace(/[^0-9.-]+/g, ''));
        
        return {
          ...link,
          subscribers: newSubscriber ? currentSubscribers + 1 : currentSubscribers,
          totalRevenue: `$${(currentRevenue + subscriptionAmount).toFixed(2)}`
        };
      }
      return link;
    }));
  };

  // Load subscription links from localStorage on initialization
  React.useEffect(() => {
    const saved = localStorage.getItem('nardopay-subscription-links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubscriptionLinks(parsed);
      } catch (error) {
        console.error('Error parsing saved subscription links:', error);
      }
    }
  }, []);

  return (
    <SubscriptionLinksContext.Provider value={{ subscriptionLinks, addSubscriptionLink, getSubscriptionLink, updateSubscriptionStats }}>
      {children}
    </SubscriptionLinksContext.Provider>
  );
}; 