import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
// Product Pages
import Products from "./pages/Products";
import PaymentLinks from "./pages/products/PaymentLinks";
import Catalogue from "./pages/products/Catalogue";
import SubscriptionLinks from "./pages/products/SubscriptionLinks";
import DonationLinks from "./pages/products/DonationLinks";

// Payment Link Pages
import PaymentLinkPage from "./pages/pay/PaymentLinkPage";
import DonationLinkPage from "./pages/pay/DonationLinkPage";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentCancel from "./pages/PaymentCancel";
import AdminPortal from "./pages/admin/AdminPortal";
import PesapalAdmin from "./pages/admin/rails/PesapalAdmin";

// Solution Pages
import Startups from "./pages/solutions/Startups";
import Freelancers from "./pages/solutions/Freelancers";
import OnlineBusiness from "./pages/solutions/OnlineBusiness";
import Agencies from "./pages/solutions/Agencies";
import NGOs from "./pages/solutions/NGOs";

// Policy Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

// Support Pages
import Resources from "./pages/Resources";
import Security from "./pages/Security";
import UseCases from "./pages/UseCases";
import Countries from "./pages/Countries";
import Integrations from "./pages/Integrations";

// Blog Posts
import HowNardoPayWorks from "./pages/blog/HowNardoPayWorks";
import PesapalPartnership from "./pages/blog/PesapalPartnership";
import RevolutionizingFinance from "./pages/blog/RevolutionizingFinance";
import VibeCodingAI from "./pages/blog/VibeCodingAI";
import EcommerceSuccess from "./pages/blog/EcommerceSuccess";

// Company Pages
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import OurMission from "./pages/OurMission";
import Pricing from "./pages/Pricing";

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Payment Link Routes - These must come before product routes */}
      <Route path="/pay/:linkCode" element={<PaymentLinkPage />} />
      <Route path="/donate/:linkCode" element={<DonationLinkPage />} />
      <Route path="/payment-callback" element={<PaymentCallback />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminPortal />} />
      <Route path="/admin/rails/pesapal" element={<PesapalAdmin />} />
      
      {/* Product Routes */}
      <Route path="/products" element={<Products />} />
      <Route path="/products/payment-links" element={<PaymentLinks />} />
      <Route path="/products/catalogue" element={<Catalogue />} />
      <Route path="/products/subscription-links" element={<SubscriptionLinks />} />
      <Route path="/products/donation-links" element={<DonationLinks />} />
      
      {/* Solution Routes */}
            <Route path="/solutions/startups" element={<Startups />} />
            <Route path="/solutions/freelancers" element={<Freelancers />} />
            <Route path="/solutions/online-business" element={<OnlineBusiness />} />
            <Route path="/solutions/agencies" element={<Agencies />} />
            <Route path="/solutions/ngos" element={<NGOs />} />
      
      {/* Policy Routes */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      
            {/* Support Routes */}
            <Route path="/resources" element={<Resources />} />
            <Route path="/security" element={<Security />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/integrations" element={<Integrations />} />
            
            {/* Blog Post Routes */}
            <Route path="/blog/how-nardopay-works" element={<HowNardoPayWorks />} />
            <Route path="/blog/pesapal-partnership" element={<PesapalPartnership />} />
            <Route path="/blog/revolutionizing-finance" element={<RevolutionizingFinance />} />
            <Route path="/blog/vibe-coding-ai" element={<VibeCodingAI />} />
            <Route path="/blog/ecommerce-success" element={<EcommerceSuccess />} />
      
      {/* Company Routes */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/press" element={<Press />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/mission" element={<OurMission />} />
      
      {/* Other routes */}
      <Route path="/pricing" element={<Pricing />} />
      
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
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
