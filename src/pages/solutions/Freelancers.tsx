import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, DollarSign, FileText, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Freelancers = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Get Paid Faster",
      description: "Send payment links instantly and receive money in your account the same day"
    },
    {
      icon: FileText,
      title: "Simple Invoicing",
      description: "Create professional payment links with descriptions - no complex invoicing software needed"
    },
    {
      icon: Globe,
      title: "Work Globally",
      description: "Accept payments from clients worldwide with their preferred payment methods"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-level security protects you and your clients on every transaction"
    },
    {
      icon: DollarSign,
      title: "Track Income",
      description: "Monitor all payments and earnings in one dashboard with detailed analytics"
    }
  ];

  const useCases = [
    "Invoice clients for completed projects",
    "Accept deposits before starting work",
    "Charge for consulting sessions",
    "Sell digital deliverables and files",
    "Set up retainer agreements",
    "Accept international payments hassle-free"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-primary/10 text-blue-primary rounded-full text-sm font-semibold">
              For Freelancers
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Stop Chasing Payments,
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Start Getting Paid</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            The easiest way for freelancers to get paid. Create payment links in seconds, share them with clients, and receive money instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">Start Getting Paid</Link>
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
              Built for independent professionals
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
              Everything you need to manage payments
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
            Focus on your craft, not payment hassles
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of freelancers who trust Nardopay for fast, secure payments
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

export default Freelancers;
