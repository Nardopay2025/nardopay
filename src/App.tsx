import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { InvoiceSettingsProvider } from "@/contexts/InvoiceSettingsContext";
import { PaymentLinksProvider } from "@/contexts/PaymentLinksContext";
import { DonationLinksProvider } from "@/contexts/DonationLinksContext";
import { SubscriptionLinksProvider } from "@/contexts/SubscriptionLinksContext";
import { CatalogueProvider } from "@/contexts/CatalogueContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Product Pages
import PaymentLinks from "./pages/products/PaymentLinks";
import Catalogue from "./pages/products/Catalogue";
import SendPage from "./pages/products/Send";
import DirectPay from "./pages/products/DirectPay";
import APIPage from "./pages/products/API";

// Solution Pages
import Education from "./pages/solutions/Education";
import Healthcare from "./pages/solutions/Healthcare";
import Agriculture from "./pages/solutions/Agriculture";
import NGOs from "./pages/solutions/NGOs";

// Policy Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

// Support Pages
import HelpCenter from "./pages/HelpCenter";
import Documentation from "./pages/Documentation";
import Status from "./pages/Status";
import Security from "./pages/Security";

// Company Pages
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import PaymentPage from "./pages/PaymentPage";
import DonationPage from "./pages/DonationPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import CataloguePage from "./pages/CataloguePage";
import CatalogueCheckoutPage from "./pages/CatalogueCheckoutPage";

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Product Routes */}
      <Route path="/products/payment-links" element={<PaymentLinks />} />
      <Route path="/products/catalogue" element={<Catalogue />} />
      <Route path="/products/send" element={<SendPage />} />
      <Route path="/products/direct-pay" element={<DirectPay />} />
      <Route path="/products/api" element={<APIPage />} />
      
      {/* Solution Routes */}
      <Route path="/solutions/education" element={<Education />} />
      <Route path="/solutions/healthcare" element={<Healthcare />} />
      <Route path="/solutions/agriculture" element={<Agriculture />} />
      <Route path="/solutions/ngos" element={<NGOs />} />
      
      {/* Policy Routes */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      
      {/* Support Routes */}
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/docs" element={<Documentation />} />
      <Route path="/status" element={<Status />} />
      <Route path="/security" element={<Security />} />
      
      {/* Company Routes */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/press" element={<Press />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Payment Routes */}
      <Route path="/pay/:linkId" element={<PaymentPage />} />
      <Route path="/donate/:linkId" element={<DonationPage />} />
      <Route path="/subscribe/:linkId" element={<SubscriptionPage />} />
      <Route path="/catalogue/:catalogueId" element={<CataloguePage />} />
      <Route path="/catalogue/:catalogueId/checkout" element={<CatalogueCheckoutPage />} />
      
      {/* Other routes */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/signup" element={<LoginPage />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <InvoiceSettingsProvider>
            <PaymentLinksProvider>
              <DonationLinksProvider>
                <SubscriptionLinksProvider>
                  <CatalogueProvider>
                    <AppContent />
                  </CatalogueProvider>
                </SubscriptionLinksProvider>
              </DonationLinksProvider>
            </PaymentLinksProvider>
          </InvoiceSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
