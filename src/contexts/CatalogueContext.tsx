import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  inStock: boolean;
}

interface Catalogue {
  id: string;
  title: string;
  description: string;
  currency: string;
  items: CatalogueItem[];
  status: string;
  createdAt: string;
  totalSales: number;
  totalRevenue: string;
  link: string;
}

interface CatalogueContextType {
  catalogues: Catalogue[];
  addCatalogue: (catalogue: Catalogue) => void;
  getCatalogue: (id: string) => Catalogue | undefined;
  updateCatalogue: (id: string, catalogue: Catalogue) => void;
  deleteCatalogue: (id: string) => void;
  addItemToCatalogue: (catalogueId: string, item: CatalogueItem) => void;
  removeItemFromCatalogue: (catalogueId: string, itemId: string) => void;
}

const CatalogueContext = createContext<CatalogueContextType | undefined>(undefined);

export const useCatalogue = () => {
  const context = useContext(CatalogueContext);
  if (context === undefined) {
    throw new Error('useCatalogue must be used within a CatalogueProvider');
  }
  return context;
};

interface CatalogueProviderProps {
  children: ReactNode;
}

export const CatalogueProvider: React.FC<CatalogueProviderProps> = ({ children }) => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);

  const addCatalogue = (catalogue: Catalogue) => {
    setCatalogues(prev => [catalogue, ...prev]);
    // Also save to localStorage for persistence
    const updatedCatalogues = [catalogue, ...catalogues];
    localStorage.setItem('nardopay-catalogues', JSON.stringify(updatedCatalogues));
  };

  const getCatalogue = (id: string) => {
    return catalogues.find(catalogue => catalogue.id === id);
  };

  const updateCatalogue = (id: string, updatedCatalogue: Catalogue) => {
    setCatalogues(prev => prev.map(catalogue => 
      catalogue.id === id ? updatedCatalogue : catalogue
    ));
    // Update localStorage
    const updatedCatalogues = catalogues.map(catalogue => 
      catalogue.id === id ? updatedCatalogue : catalogue
    );
    localStorage.setItem('nardopay-catalogues', JSON.stringify(updatedCatalogues));
  };

  const deleteCatalogue = (id: string) => {
    setCatalogues(prev => prev.filter(catalogue => catalogue.id !== id));
    // Update localStorage
    const updatedCatalogues = catalogues.filter(catalogue => catalogue.id !== id);
    localStorage.setItem('nardopay-catalogues', JSON.stringify(updatedCatalogues));
  };

  const addItemToCatalogue = (catalogueId: string, item: CatalogueItem) => {
    setCatalogues(prev => prev.map(catalogue => {
      if (catalogue.id === catalogueId) {
        return {
          ...catalogue,
          items: [...catalogue.items, item]
        };
      }
      return catalogue;
    }));
  };

  const removeItemFromCatalogue = (catalogueId: string, itemId: string) => {
    setCatalogues(prev => prev.map(catalogue => {
      if (catalogue.id === catalogueId) {
        return {
          ...catalogue,
          items: catalogue.items.filter(item => item.id !== itemId)
        };
      }
      return catalogue;
    }));
  };

  // Load catalogues from localStorage on initialization
  React.useEffect(() => {
    const saved = localStorage.getItem('nardopay-catalogues');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCatalogues(parsed);
      } catch (error) {
        console.error('Error parsing saved catalogues:', error);
      }
    }
  }, []);

  return (
    <CatalogueContext.Provider value={{ 
      catalogues, 
      addCatalogue, 
      getCatalogue, 
      updateCatalogue, 
      deleteCatalogue,
      addItemToCatalogue,
      removeItemFromCatalogue
    }}>
      {children}
    </CatalogueContext.Provider>
  );
}; 