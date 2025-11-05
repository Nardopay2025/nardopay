import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustedSection from "@/components/TrustedSection";
import ProductsSection from "@/components/ProductsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import InternationalPaymentsSection from "@/components/InternationalPaymentsSection";
import CountriesSection from "@/components/CountriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Universe background (very faint) */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9) 50%, transparent 51%),
          radial-gradient(1px 1px at 140px 120px, rgba(255,255,255,0.7) 50%, transparent 51%),
          radial-gradient(1.5px 1.5px at 240px 80px, rgba(255,255,255,0.8) 50%, transparent 51%),
          radial-gradient(1px 1px at 340px 160px, rgba(255,255,255,0.6) 50%, transparent 51%)
        `,
        backgroundSize: '400px 400px',
        backgroundRepeat: 'repeat'
      }} />
      {/* Animated gradient glow layer */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -inset-20 bg-gradient-hero blur-3xl opacity-50 animate-slow-zoom" />
      </div>
      <Navigation />
      <HeroSection />
      <TrustedSection />
      <HowItWorksSection />
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
