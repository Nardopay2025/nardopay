import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Heart, Zap, Target, Users, TrendingUp } from "lucide-react";

const OurMission = () => {
  const values = [
    {
      icon: Globe,
      title: "Global Access",
      description: "Making payments accessible to everyone, everywhere, regardless of location or technical expertise."
    },
    {
      icon: Zap,
      title: "Instant & Simple",
      description: "Removing complexity from payments. Create a link in 60 seconds, share anywhere, get paid instantly."
    },
    {
      icon: Heart,
      title: "Empowerment",
      description: "Empowering entrepreneurs, creators, and businesses to monetize their work without barriers."
    },
    {
      icon: Users,
      title: "Inclusive",
      description: "Building financial tools that work for businesses of all sizes, from solo creators to enterprises."
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description: "Helping you grow your business by providing the easiest payment infrastructure on the planet."
    },
    {
      icon: Target,
      title: "Mission Driven",
      description: "Committed to democratizing access to global payments and financial services for Africa and beyond."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-primary/10 text-blue-primary rounded-full text-sm font-semibold">
              Our Mission
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Make Getting Paid Online
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Simple for Everyone</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe that anyone with a product, service, or idea should be able to accept payments online without needing a website, coding skills, or complex setup. That's why we built Nardopay.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why We Started Nardopay</h2>
          
          <div className="space-y-6 text-lg text-foreground leading-relaxed">
            <p>
              We saw talented entrepreneurs, creators, and small businesses across Africa and emerging markets struggling to accept payments online. The existing solutions were too complex, too expensive, or simply unavailable in their regions.
            </p>
            
            <p>
              A freelancer in Ghana shouldn't need to set up a website to get paid for their work. A small business owner in Nigeria shouldn't need to hire a developer to sell online. A creator in Kenya shouldn't be limited by geography when building their business.
            </p>
            
            <p className="text-xl font-semibold text-blue-primary">
              So we built the easiest payment infrastructure on the planet—one that works in 3 clicks, requires zero technical knowledge, and is available to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What We Stand For</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment</h2>
          
          <p className="text-xl text-foreground leading-relaxed mb-8">
            We're committed to building the most accessible, affordable, and reliable payment infrastructure for the next generation of businesses. Every feature we build, every decision we make, is guided by one simple question:
          </p>
          
          <div className="bg-gradient-primary p-8 rounded-2xl">
            <p className="text-2xl md:text-3xl font-bold text-white">
              "Will this make it easier for someone to get paid online?"
            </p>
          </div>
          
          <p className="text-lg text-muted-foreground mt-8">
            If the answer is yes, we build it. If the answer is no, we don't.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us on This Mission</h2>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Whether you're an entrepreneur building your first business, a creator monetizing your passion, or a business scaling globally—we're here to help you get paid, grow, and succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Getting Paid Today
            </a>
            <a 
              href="/contact" 
              className="px-8 py-4 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-muted/50 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurMission;
