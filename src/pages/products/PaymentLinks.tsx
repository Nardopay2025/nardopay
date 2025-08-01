import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Smartphone, Globe, Shield } from "lucide-react";

const PaymentLinks = () => {
  const features = [
    {
      icon: Link2,
      title: "Instant Link Creation",
      description: "Generate payment links in seconds with customizable amounts and descriptions."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Links work perfectly on any device - desktop, mobile, or tablet."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments from customers worldwide with multi-currency support."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level security ensures every transaction is protected."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              Payment <span className="bg-gradient-primary bg-clip-text text-transparent">Links</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create shareable payment links in seconds. Perfect for invoicing, selling products, or collecting payments without a website.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="hero" size="lg">Start Creating Links</Button>
              <Button variant="outline" size="lg">View Demo</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need for payment links
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How Payment Links Work
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Create Link</h3>
              <p className="text-muted-foreground">Set amount, description, and customize your payment link</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Share Link</h3>
              <p className="text-muted-foreground">Send via WhatsApp, email, SMS, or social media</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Get Paid</h3>
              <p className="text-muted-foreground">Customer pays instantly and you receive money in your account</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentLinks;