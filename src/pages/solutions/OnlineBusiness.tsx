import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, TrendingUp, CreditCard, Globe, Smartphone, BarChart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const OnlineBusiness = () => {
  const benefits = [
    {
      icon: ShoppingBag,
      title: "Sell Anything",
      description: "From physical products to digital goods, services, and subscriptions—all in one platform."
    },
    {
      icon: Package,
      title: "Product Catalog",
      description: "Create beautiful product listings with images, descriptions, and multiple variants for your store."
    },
    {
      icon: TrendingUp,
      title: "Grow Your Revenue",
      description: "Accept payments from customers worldwide and scale your online business without limits."
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Credit cards, mobile money, and local payment methods to maximize your conversion rates."
    },
    {
      icon: Globe,
      title: "Global Customers",
      description: "Sell to customers anywhere in the world with multi-currency support and local payment methods."
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized checkout experience that works perfectly on all devices for higher conversion."
    },
    {
      icon: BarChart,
      title: "Sales Analytics",
      description: "Track your sales, understand your customers, and make data-driven decisions to grow."
    },
    {
      icon: Clock,
      title: "Quick Setup",
      description: "Launch your online store in minutes without coding. Start selling today, not weeks from now."
    }
  ];

  const useCases = [
    "E-commerce stores selling physical products",
    "Digital products and downloadable content",
    "Online courses and coaching programs",
    "Handmade crafts and artisan goods",
    "Print-on-demand and dropshipping",
    "Subscription boxes and memberships",
    "Event tickets and workshop bookings",
    "Consulting services and appointments"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Payment Solutions for{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Online Businesses</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to sell online—physical products, digital goods, services, and more. 
              Accept payments and grow your business globally.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login">
                <Button variant="hero" size="lg">Start Selling Now</Button>
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
              Everything You Need to Sell Online
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From your first sale to scaling globally, we provide all the tools you need to succeed.
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
              Perfect For Every Online Business
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you sell products, services, or digital content—our platform adapts to your needs.
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
              Start Selling in 3 Easy Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your online store up and running in minutes, not days.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">Add Your Products</h3>
              <p className="text-muted-foreground">
                Create your product catalog with images, descriptions, and pricing in minutes.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">Share Your Store</h3>
              <p className="text-muted-foreground">
                Get your custom storefront link to share on social media, email, or your website.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">Start Selling</h3>
              <p className="text-muted-foreground">
                Accept payments instantly and manage orders from your dashboard. It's that simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">
            Ready to Grow Your Online Business?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of online businesses using NardoPay to accept payments and scale globally. Start selling today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button variant="hero" size="lg">Get Started Free</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OnlineBusiness;
