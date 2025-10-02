import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, CreditCard, Smartphone, Globe, DollarSign, Share2, MessageCircle, Mail, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
const HeroSection = () => {
  const professions = ["ENTREPRENEURS", "CREATORS", "FREELANCERS", "SMALL BUSINESSES", "NGOS", "TEACHERS", "COACHES", "CONSULTANTS", "ARTISTS", "DEVELOPERS", "INFLUENCERS", "AGENCIES"];
  const [currentProfessionIndex, setCurrentProfessionIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentProfession = professions[currentProfessionIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentProfession.length) {
          setDisplayText(currentProfession.slice(0, displayText.length + 1));
        } else {
          // Wait before deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentProfessionIndex((prev) => (prev + 1) % professions.length);
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentProfessionIndex, professions]);
  return <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/10 via-transparent to-blue-secondary/10" />
      
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Main Headline */}
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                The Easiest Way to Get Paid Online<br />
                <span className="text-2xl lg:text-3xl font-bold text-blue-primary uppercase tracking-wide">
                  FOR {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
              
              {/* Value Proposition */}
              <p className="text-xl text-foreground max-w-lg leading-relaxed">
                In only <strong className="text-blue-primary">3 clicks</strong> you can create a payment link, share on social media, and get paid with <strong className="text-blue-primary">any payment method</strong> that exists.
              </p>
              
              <p className="text-lg text-muted-foreground">
                No coding required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-base">
                Start Getting Paid Today – Free
              </Button>
              <Button variant="outline" size="lg" className="text-base">
                See How It Works
              </Button>
            </div>

            {/* Country Flags Footnote */}
            <div className="text-left mt-8">
              <p className="text-sm text-muted-foreground mb-4">Available in 100+ countries</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <span className="text-2xl">🇬🇭</span>
                <span className="text-2xl">🇿🇦</span>
                <span className="text-2xl">🇵🇭</span>
                <span className="text-2xl">🇦🇷</span>
                <span className="text-2xl">🇰🇪</span>
                <span className="text-2xl">🇬🇧</span>
                <span className="text-2xl">🇳🇬</span>
                <span className="text-2xl">🇨🇦</span>
                <span className="text-2xl">➕</span>
              </div>
            </div>
          </div>

          {/* Right Content - Payment Link Screen */}
          <div className="relative md:mt-0 mt-8">
            {/* Main Payment Page Card */}
            <Card className="bg-gray-800 border-gray-700 relative z-10 max-w-sm mx-auto shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">Y</span>
                    </div>
                    <span className="font-semibold text-white text-sm">Your Company</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">Complete Your Payment</h2>
                  <p className="text-gray-400 text-xs">Secure payment powered by Nardopay</p>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="text-xs font-bold text-white mb-3">Order Summary</div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Premium T-Shirt</div>
                      <div className="text-gray-400 text-xs mt-1">High-quality cotton t-shirt</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-white font-bold text-sm">$25.00</div>
                      <div className="text-gray-400 text-xs">USD</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 mt-3 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-xs">Total</span>
                      <span className="text-white font-bold text-sm">$25.00</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="w-5 h-5 mx-auto mb-1 text-blue-500">
                      <CreditCard className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Card</div>
                  </div>
                  <div className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="w-5 h-5 mx-auto mb-1 text-blue-500">
                      <Smartphone className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Mobile</div>
                  </div>
                  <div className="p-3 border border-gray-600 rounded text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="w-5 h-5 mx-auto mb-1 text-blue-500">
                      <Globe className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Bank</div>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="p-3 rounded text-center text-white font-medium mb-2 cursor-pointer hover:opacity-90 transition-opacity" style={{
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
              }}>
                  Pay $25.00
                </div>
              </CardContent>
            </Card>

            {/* Success Notification */}
            

            {/* Payment Link Info */}
            

            {/* Slanted Text Overlay */}
            <div className="hidden lg:block absolute top-8 -left-12 transform -rotate-12 z-30">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-xl">
                <div className="text-sm font-bold">Create payment links</div>
                <div className="text-xs opacity-90">with zero code</div>
              </div>
            </div>

            {/* Share Payment Links Section */}
            <div className="mt-8 text-center max-w-sm mx-auto">
              <h3 className="text-base font-semibold text-foreground mb-4">Share payment links on</h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                {/* WhatsApp Logo */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-white fill-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">WhatsApp</span>
                </div>
                
                {/* Instagram Logo */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Instagram</span>
                </div>
                
                {/* Email Logo */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 bg-[#EA4335] rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Email</span>
                </div>
                
                {/* SMS/Any Platform */}
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">More</span>
                </div>
              </div>
              
              {/* Example Payment Link */}
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;