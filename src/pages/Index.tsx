import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustedSection from "@/components/TrustedSection";
import ProductsSection from "@/components/ProductsSection";
import InternationalPaymentsSection from "@/components/InternationalPaymentsSection";

import CountriesSection from "@/components/CountriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <TrustedSection />
      <ProductsSection />
      <InternationalPaymentsSection />
      <CountriesSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
