import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, CreditCard, Smartphone, Globe, DollarSign, Share2, MessageCircle, Mail, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  
  const countries = [
    { name: "Africa & abroad", flag: "🌍" },
    { name: "Europe", flag: "🇪🇺" },
    { name: "United States", flag: "🇺🇸" },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Zimbabwe", flag: "🇿🇼" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Tanzania", flag: "🇹🇿" },
    { name: "Uganda", flag: "🇺🇬" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCountryIndex((prev) => (prev + 1) % countries.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [countries.length]);
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/10 via-transparent to-blue-secondary/10" />
      
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Accept payments from anywhere in</span><br />
                <span className="bg-gradient-primary bg-clip-text text-transparent flex items-center gap-3">
                  <span className="text-4xl">{countries[currentCountryIndex].flag}</span>
                  <span className="transition-all duration-500 ease-in-out">{countries[currentCountryIndex].name}</span>
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                With just one link, African entrepreneurs can now accept payments from anywhere in the world, using any bank or mobile money. Nardopay allows anyone to create payment links and product catalogues instantly without any coding required. We automatically generate invoices and receipts for you so that you can grow your business globally with confidence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg">
                Sign Up For Free
              </Button>
              <Button variant="outline" size="lg">
                Watch the Demo
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
          <div className="relative">
            {/* Main Payment Page Card */}
            <Card className="bg-gray-800 border-gray-700 relative z-10 max-w-sm mx-auto">
              <CardContent className="p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">N</span>
                    </div>
                    <span className="font-semibold text-white text-sm">Nardopay</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">Complete Your Payment</h2>
                  <p className="text-gray-400 text-xs">Secure payment powered by Nardopay</p>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                  <div className="text-xs font-bold text-white mb-2">Order Summary</div>
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
                <div className="grid grid-cols-3 gap-1 mb-4">
                  <div className="p-2 border border-gray-600 rounded text-center">
                    <div className="w-4 h-4 mx-auto mb-1 text-blue-500">
                      <CreditCard className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Card</div>
                  </div>
                  <div className="p-2 border border-gray-600 rounded text-center">
                    <div className="w-4 h-4 mx-auto mb-1 text-blue-500">
                      <Smartphone className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Mobile</div>
                  </div>
                  <div className="p-2 border border-gray-600 rounded text-center">
                    <div className="w-4 h-4 mx-auto mb-1 text-blue-500">
                      <Globe className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-300">Bank</div>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="p-2 rounded text-center text-white font-medium mb-2" 
                     style={{ 
                       background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                     }}>
                  Pay $25.00
                </div>
              </CardContent>
            </Card>

            {/* Success Notification */}
            <Card className="absolute -bottom-4 -left-20 p-4 bg-green-500/10 border-green-500/30 backdrop-blur-sm z-20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-medium text-sm">Payment Successful</span>
              </div>
            </Card>

            {/* Payment Link Info */}
            <Card className="absolute -top-4 -right-4 p-3 bg-blue-500/10 border-blue-500/30 backdrop-blur-sm z-20 max-w-xs">
              <div className="text-xs text-blue-500 font-medium mb-1">Payment Link Created</div>
              <div className="text-xs text-gray-400">Ready to share with customers</div>
            </Card>

            {/* Slanted Text Overlay */}
            <div className="absolute -top-2 -left-8 transform -rotate-12 z-30">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="text-sm font-bold">Create payment links</div>
                <div className="text-xs opacity-90">with zero code</div>
              </div>
            </div>

            {/* Share Payment Links Section */}
            <div className="mt-6 text-center">
              <h3 className="text-base font-semibold text-white mb-3">Share payment links on</h3>
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-green-500">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">WhatsApp</span>
                </div>
                <div className="flex items-center gap-1 text-pink-500">
                  <Instagram className="w-4 h-4" />
                  <span className="text-xs font-medium">Instagram</span>
                </div>
                <div className="flex items-center gap-1 text-blue-500">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-medium">Email</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Anywhere</span>
                </div>
              </div>
              
              {/* Example Payment Link */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 max-w-sm mx-auto">
                <div className="text-xs text-gray-400 mb-1">Example payment link:</div>
                <div className="bg-gray-800 border border-gray-600 rounded p-2 font-mono text-xs text-blue-400 break-all">
                  https://nardopay.com/pay/abc123
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Customers click → Pay → You receive money instantly
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;