import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, BarChart3, Repeat, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Agencies = () => {
  const benefits = [
    {
      icon: Users,
      title: "Multi-Client Management",
      description: "Manage payments for multiple clients with separate tracking and reporting"
    },
    {
      icon: Repeat,
      title: "Recurring Billing",
      description: "Set up retainer agreements and subscription-based services effortlessly"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track revenue, client payments, and financial metrics across your agency"
    },
    {
      icon: Shield,
      title: "White-Label Options",
      description: "Branded payment pages that match your agency's identity"
    },
    {
      icon: Zap,
      title: "Fast Onboarding",
      description: "Get new clients paying within minutes with simple payment links"
    }
  ];

  const useCases = [
    "Monthly retainer payments from clients",
    "Project-based milestone payments",
    "Subscription packages for ongoing services",
    "Accept deposits before starting projects",
    "Invoice for additional work and expenses",
    "Collect payments from international clients"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-primary/10 text-blue-primary rounded-full text-sm font-semibold">
              For Agencies
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Scale Your Agency With
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Effortless Payments</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            From retainers to project-based billing, manage all your client payments in one powerful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Built for growing agencies
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Perfect for all agency services
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background hover:shadow-md transition-shadow">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-foreground">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Streamline payments, scale faster
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join leading agencies using Nardopay to simplify client billing and boost cash flow
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Agencies;
