import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DonationLink {
  id: string;
  title: string;
  description: string;
  goalAmount: string;
  currency: string;
  thankYouMessage: string;
  redirectUrl: string;
  link: string;
  status: string;
  createdAt: string;
  donations: number;
  totalAmount: string;
  goalProgress: number; // percentage of goal reached
}

interface DonationLinksContextType {
  donationLinks: DonationLink[];
  addDonationLink: (link: DonationLink) => void;
  getDonationLink: (id: string) => DonationLink | undefined;
  updateDonationProgress: (id: string, amount: number) => void;
}

const DonationLinksContext = createContext<DonationLinksContextType | undefined>(undefined);

export const useDonationLinks = () => {
  const context = useContext(DonationLinksContext);
  if (context === undefined) {
    throw new Error('useDonationLinks must be used within a DonationLinksProvider');
  }
  return context;
};

interface DonationLinksProviderProps {
  children: ReactNode;
}

export const DonationLinksProvider: React.FC<DonationLinksProviderProps> = ({ children }) => {
  const [donationLinks, setDonationLinks] = useState<DonationLink[]>([]);

  const addDonationLink = (link: DonationLink) => {
    setDonationLinks(prev => [link, ...prev]);
    // Also save to localStorage for persistence
    const updatedLinks = [link, ...donationLinks];
    localStorage.setItem('nardopay-donation-links', JSON.stringify(updatedLinks));
  };

  const getDonationLink = (id: string) => {
    return donationLinks.find(link => link.id === id);
  };

  const updateDonationProgress = (id: string, amount: number) => {
    setDonationLinks(prev => prev.map(link => {
      if (link.id === id) {
        const currentTotal = parseFloat(link.totalAmount.replace(/[^0-9.-]+/g, ''));
        const newTotal = currentTotal + amount;
        const goalAmount = parseFloat(link.goalAmount.replace(/[^0-9.-]+/g, ''));
        const newProgress = Math.min((newTotal / goalAmount) * 100, 100);
        
        return {
          ...link,
          donations: link.donations + 1,
          totalAmount: `$${newTotal.toFixed(2)}`,
          goalProgress: newProgress
        };
      }
      return link;
    }));
  };

  // Load donation links from localStorage on initialization
  React.useEffect(() => {
    const saved = localStorage.getItem('nardopay-donation-links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDonationLinks(parsed);
      } catch (error) {
        console.error('Error parsing saved donation links:', error);
      }
    }
  }, []);

  return (
    <DonationLinksContext.Provider value={{ donationLinks, addDonationLink, getDonationLink, updateDonationProgress }}>
      {children}
    </DonationLinksContext.Provider>
  );
}; 