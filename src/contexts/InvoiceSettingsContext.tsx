import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InvoiceSettings {
  businessName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  customLogo: boolean;
}

interface InvoiceSettingsContextType {
  invoiceSettings: InvoiceSettings;
  updateInvoiceSettings: (settings: Partial<InvoiceSettings>) => void;
}

const InvoiceSettingsContext = createContext<InvoiceSettingsContextType | undefined>(undefined);

export const useInvoiceSettings = () => {
  const context = useContext(InvoiceSettingsContext);
  if (context === undefined) {
    throw new Error('useInvoiceSettings must be used within an InvoiceSettingsProvider');
  }
  return context;
};

interface InvoiceSettingsProviderProps {
  children: ReactNode;
}

export const InvoiceSettingsProvider: React.FC<InvoiceSettingsProviderProps> = ({ children }) => {
  // Load settings from localStorage on initialization
  const getInitialSettings = (): InvoiceSettings => {
    const saved = localStorage.getItem('nardopay-invoice-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved invoice settings:', error);
      }
    }
    return {
      businessName: 'Nardopay',
      logoUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1D4ED8',
      customLogo: false
    };
  };

  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(getInitialSettings);

  const updateInvoiceSettings = (newSettings: Partial<InvoiceSettings>) => {
    setInvoiceSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings
      };
      // Save to localStorage
      localStorage.setItem('nardopay-invoice-settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <InvoiceSettingsContext.Provider value={{ invoiceSettings, updateInvoiceSettings }}>
      {children}
    </InvoiceSettingsContext.Provider>
  );
}; 