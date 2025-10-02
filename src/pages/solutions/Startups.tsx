import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, DollarSign, Zap, TrendingUp, Users, Globe, CreditCard, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Startups = () => {
  const benefits = [
    {
      icon: Rocket,
      title: "Launch Fast",
      description: "Get your payment system running in minutes, not weeks. Focus on building your product while we handle payments."
    },
    {
      icon: DollarSign,
      title: "Pay As You Grow",
      description: "No upfront costs or monthly fees. Only pay when you make money, with competitive transaction rates for startups."
    },
    {
      icon: Zap,
      title: "Scale Effortlessly",
      description: "Built to handle growth from your first customer to millions. Our infrastructure scales automatically with your success."
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Real-time insights into your revenue, customer behavior, and payment trends to fuel data-driven decisions."
    },
    {
      icon: Users,
      title: "Multi-Currency",
      description: "Accept payments from customers worldwide in their local currency. Expand globally from day one."
    },
    {
      icon: Globe,
      title: "Global Ready",
      description: "Accept payments from customers worldwide in their local currency. Expand globally from day one."
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "Accept credit cards, mobile money, and local payment methods to maximize conversions."
    },
    {
      icon: BarChart,
      title: "Investor-Ready Reports",
      description: "Professional financial reporting and metrics that investors and stakeholders expect to see."
    }
  ];

  const useCases = [
    "SaaS subscription billing and recurring revenue",
    "Marketplace transactions with split payments",
    "On-demand service bookings and payments",
    "Digital product sales and instant delivery",
    "Crowdfunding and pre-order campaigns",
    "Freemium to premium upgrade flows",
    "International expansion and multi-currency"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Payment Infrastructure for{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Startups</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Launch, iterate, and scale your startup with payment infrastructure built for speed and growth. 
              From MVP to unicorn, we grow with you.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login">
                <Button variant="hero" size="lg">Start Free Trial</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Built for Startup Speed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to accept payments, manage revenue, and scale globally—without the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Perfect For Every Startup Stage
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From validating your MVP to scaling to millions of users, our platform adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {useCases.map((useCase) => (
              <div key={useCase} className="flex items-start gap-3 p-4 bg-background rounded-lg">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple setup process designed for founders who want to move fast.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account in 30 seconds. No credit card required to start.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">Integrate</h3>
              <p className="text-muted-foreground">
                Use payment links or integrate with your website. Choose what works for your stack.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">Launch & Scale</h3>
              <p className="text-muted-foreground">
                Start accepting payments immediately. Scale to millions without code changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">
            Ready to Launch Your Startup?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of startups using NardoPay to power their growth. Start accepting payments today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button variant="hero" size="lg">Start Free Trial</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">Talk to Startup Team</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Startups;
