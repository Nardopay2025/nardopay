import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Repeat, Zap, Shield, BarChart3, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutPreview from "@/components/checkout/CheckoutPreview";

const SubscriptionLinks = () => {
  const features = [
    {
      icon: Repeat,
      title: "Automatic Billing",
      description: "Charge subscribers automatically on your chosen schedule"
    },
    {
      icon: Calendar,
      title: "Flexible Cycles",
      description: "Monthly, quarterly, annual – you choose"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level security for each renewal"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track MRR, churn, and subscriber growth"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Create a subscription link in under a minute"
    },
    {
      icon: DollarSign,
      title: "Prorations",
      description: "Handle upgrades/downgrades cleanly"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-primary/10 text-blue-primary rounded-full text-sm font-semibold">
                  Subscription Links
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Build Recurring Revenue,
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Effortlessly</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create subscription links for memberships, SaaS, or content. Share and let us handle billing and renewals automatically.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">Create a Subscription</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Preview Card (standardized) */}
            <div className="relative">
              <CheckoutPreview
                businessName="Nardo Studio"
                headerGradient="linear-gradient(135deg, #8B5CF6, #EC4899)"
                productName="Premium Membership"
                productDescription="Access all exclusive content"
                amount="USD 29.00"
                imageUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything for subscriptions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools to launch and grow your recurring revenue
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to build recurring revenue?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators and businesses earning predictable income with subscription links
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">Create Your First Subscription Link</Link>
          </Button>
          <p className="text-muted-foreground mt-4">No credit card required • Free to start</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubscriptionLinks;
