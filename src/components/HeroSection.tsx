import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, CreditCard, Smartphone, Globe, DollarSign, Share2, MessageCircle, Mail, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
const HeroSection = () => {
  const professions = ["ENTREPRENEURS", "CREATORS", "FREELANCERS", "SMALL BUSINESSES", "NGOS", "TEACHERS", "COACHES", "CONSULTANTS", "ARTISTS", "DEVELOPERS", "INFLUENCERS", "AGENCIES"];
  const [currentProfessionIndex, setCurrentProfessionIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  // Slides for rotating payment cards
  const slides = [
    {
      business: "NardoPay Apparel",
      product: "Premium T-Shirt",
      desc: "High-quality cotton t-shirt",
      amount: "USD 25.00",
      gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)",
      image: "https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?auto=format&fit=crop&q=80&w=1600",
    },
    {
      business: "Nardo Coffee Co.",
      product: "Signature Beans 1kg",
      desc: "Single-origin medium roast",
      amount: "USD 18.00",
      gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1600",
    },
    {
      business: "Nardo Fitness",
      product: "Resistance Bands Set",
      desc: "5 strengths + travel pouch",
      amount: "USD 32.00",
      gradient: "linear-gradient(135deg, #10B981, #059669)",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1600",
    },
    {
      business: "Nardo Studio",
      product: "Digital Art Print",
      desc: "A4 high-res download",
      amount: "USD 12.00",
      gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600",
    },
    {
      business: "Nardo Home",
      product: "Scented Candle",
      desc: "Cedar & vanilla 200g",
      amount: "USD 22.00",
      gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1600",
    },
  ] as const;
  
  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => {
      carouselApi.scrollNext();
    }, 3500);
    return () => clearInterval(id);
  }, [carouselApi]);

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
      {/* Animated gradient glow (visible in hero) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -inset-20 bg-gradient-hero blur-3xl opacity-80 animate-slow-zoom" />
      </div>
      {/* Faint universe starfield */}
      <div className="absolute inset-0 pointer-events-none opacity-35" style={{
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9) 50%, transparent 51%),
          radial-gradient(1px 1px at 140px 120px, rgba(255,255,255,0.7) 50%, transparent 51%),
          radial-gradient(1.5px 1.5px at 240px 80px, rgba(255,255,255,0.8) 50%, transparent 51%),
          radial-gradient(1px 1px at 340px 160px, rgba(255,255,255,0.6) 50%, transparent 51%)
        `,
        backgroundSize: '400px 400px',
        backgroundRepeat: 'repeat'
      }} />
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/20 via-transparent to-blue-secondary/20" />
      
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

          {/* Right Content - Rotating Payment Cards */}
          <div className="relative md:mt-0 mt-8">
            <Carousel opts={{ align: "start", loop: true }} setApi={setCarouselApi} className="max-w-md mx-auto">
              <CarouselContent>
                {slides.map((s, idx) => (
                  <CarouselItem key={idx}>
                    <Card className="overflow-hidden border-border bg-card/90 backdrop-blur-sm shadow-2xl">
                      <div className="p-4 text-white" style={{ background: s.gradient }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center text-xs font-bold">NP</div>
                            <div className="text-sm font-semibold truncate max-w-[12rem]">{s.business}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wide text-white/80">pay</div>
                            <div className="text-sm font-bold">#ABC12345</div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div
                            className="rounded-lg overflow-hidden bg-muted/40 border border-border h-44 sm:h-48 md:h-56 w-full"
                            style={{
                              backgroundImage: `url('${s.image}')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                            }}
                          />
                          <div className="rounded-lg bg-foreground/5 dark:bg-white/5 p-4 border border-border">
                            <div className="text-sm font-semibold mb-2">Order Summary</div>
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <div className="text-sm font-medium">{s.product}</div>
                                <div className="text-xs text-muted-foreground">{s.desc}</div>
                              </div>
                              <div className="text-sm font-bold">{s.amount}</div>
                            </div>
                            <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                              <span className="text-xs text-muted-foreground">Total</span>
                              <span className="text-sm font-bold">{s.amount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Disabled inputs for preview only */}
                        <div className="mt-5 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input disabled readOnly className="bg-background border border-border rounded px-3 py-2 text-sm opacity-80 cursor-not-allowed" placeholder="Full Name" />
                            <input disabled readOnly className="bg-background border border-border rounded px-3 py-2 text-sm opacity-80 cursor-not-allowed" placeholder="Email Address" />
                          </div>
                          <input disabled readOnly className="bg-background border border-border rounded px-3 py-2 text-sm w-full opacity-80 cursor-not-allowed" placeholder="WhatsApp Number" />
                          <button disabled aria-disabled="true" className="w-full text-white text-sm font-medium py-2.5 rounded opacity-70 cursor-not-allowed" style={{ background: s.gradient }}>
                            Pay {s.amount}
                          </button>
                          <p className="text-[10px] text-center text-muted-foreground">Secured by NardoPay • Encrypted checkout</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:inline-flex" />
              <CarouselNext className="hidden sm:inline-flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;