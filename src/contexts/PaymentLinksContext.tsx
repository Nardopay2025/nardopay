import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentLink {
  id: string;
  amount: string;
  currency: string;
  productName: string;
  description: string;
  thankYouMessage: string;
  redirectUrl: string;
  link: string;
  status: string;
  createdAt: string;
  payments: number;
  totalAmount: string;
}

interface PaymentLinksContextType {
  paymentLinks: PaymentLink[];
  addPaymentLink: (link: PaymentLink) => void;
  getPaymentLink: (id: string) => PaymentLink | undefined;
}

const PaymentLinksContext = createContext<PaymentLinksContextType | undefined>(undefined);

export const usePaymentLinks = () => {
  const context = useContext(PaymentLinksContext);
  if (context === undefined) {
    throw new Error('usePaymentLinks must be used within a PaymentLinksProvider');
  }
  return context;
};

interface PaymentLinksProviderProps {
  children: ReactNode;
}

export const PaymentLinksProvider: React.FC<PaymentLinksProviderProps> = ({ children }) => {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);

  const addPaymentLink = (link: PaymentLink) => {
    setPaymentLinks(prev => [link, ...prev]);
    // Also save to localStorage for persistence
    const updatedLinks = [link, ...paymentLinks];
    localStorage.setItem('nardopay-payment-links', JSON.stringify(updatedLinks));
  };

  const getPaymentLink = (id: string) => {
    return paymentLinks.find(link => link.id === id);
  };

  // Load payment links from localStorage on initialization
  React.useEffect(() => {
    const saved = localStorage.getItem('nardopay-payment-links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPaymentLinks(parsed);
      } catch (error) {
        console.error('Error parsing saved payment links:', error);
      }
    }
  }, []);

  return (
    <PaymentLinksContext.Provider value={{ paymentLinks, addPaymentLink, getPaymentLink }}>
      {children}
    </PaymentLinksContext.Provider>
  );
}; 