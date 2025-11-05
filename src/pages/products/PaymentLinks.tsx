import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Link2, Smartphone, Globe, Shield, Zap, Clock, BarChart3, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutPreview from "@/components/checkout/CheckoutPreview";

const PaymentLinks = () => {
  const features = [
    {
      icon: Link2,
      title: "Instant Link Creation",
      description: "Generate payment links in 60 seconds with customizable amounts and descriptions"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Links work perfectly on any device - desktop, mobile, or tablet"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments from anywhere in the world with local payment methods"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level security ensures every transaction is protected"
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Get notified immediately when someone pays via SMS, email, or WhatsApp"
    },
    {
      icon: Clock,
      title: "Quick Setup",
      description: "No coding, no website required - just create, share, and get paid"
    },
    {
      icon: BarChart3,
      title: "Track Performance",
      description: "Monitor all your payment links with detailed analytics and insights"
    },
    {
      icon: Share2,
      title: "Share Anywhere",
      description: "Share links on social media, email, WhatsApp, or embed on your website"
    }
  ];

  const useCases = [
    {
      title: "Freelancers",
      description: "Invoice clients instantly without complex accounting software",
      examples: ["Design work", "Consulting", "Writing services"]
    },
    {
      title: "Small Businesses",
      description: "Accept payments for products and services with no website needed",
      examples: ["Local shops", "Service providers", "Home businesses"]
    },
    {
      title: "Content Creators",
      description: "Monetize your content with simple payment links",
      examples: ["Digital downloads", "Courses", "Exclusive content"]
    },
    {
      title: "Event Organizers",
      description: "Sell tickets and collect payments for events effortlessly",
      examples: ["Workshops", "Conferences", "Meetups"]
    }
  ];

  const benefits = [
    "No transaction limits - accept unlimited payments",
    "Instant payouts to your account",
    "Customizable payment amounts and descriptions",
    "Support for all major payment methods",
    "Works in 100+ countries",
    "No monthly fees or hidden charges"
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
                  Payment Links
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Create Payment Links
                <span className="bg-gradient-primary bg-clip-text text-transparent"> In 60 Seconds</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                The fastest way to get paid online. Create a payment link, share it anywhere, and receive money instantly. No website or coding required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">Create Your First Link</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Preview Card (standardized) */}
            <div className="relative">
              <CheckoutPreview
                businessName="NardoPay Consulting"
                headerGradient="linear-gradient(135deg, #0EA5E9, #0284C7)"
                productName="Consultation Payment"
                productDescription="60-minute strategy session"
                amount="USD 150.00"
                imageUrl="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1600"
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
              Everything you need for payment links
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features to help you get paid faster
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

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Perfect for any business
            </h2>
            <p className="text-xl text-muted-foreground">
              From freelancers to enterprises, payment links work for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {useCase.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-primary rounded-full"></div>
                        <span className="text-foreground">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why choose Nardopay payment links
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-secondary">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Start in 3 simple steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle>Create Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set your amount, add a description, and generate your payment link in seconds
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle>Share Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Send via WhatsApp, email, SMS, social media, or anywhere you want
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle>Get Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customer pays securely and you receive money instantly to your account
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start getting paid?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses using payment links to get paid faster
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">Create Your First Payment Link</Link>
          </Button>
          <p className="text-muted-foreground mt-4">No credit card required • Free to start</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentLinks;
