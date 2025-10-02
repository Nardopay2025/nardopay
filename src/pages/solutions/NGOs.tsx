import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, Globe, Users, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const NGOs = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Accept Donations",
      description: "Easy one-time and recurring donation links that work globally"
    },
    {
      icon: Globe,
      title: "Global Fundraising",
      description: "Accept donations from supporters worldwide with local payment methods"
    },
    {
      icon: Users,
      title: "Donor Management",
      description: "Track all donors, contributions, and generate reports for transparency"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Bank-level security builds donor confidence in your organization"
    },
    {
      icon: TrendingUp,
      title: "Impact Reporting",
      description: "Show donors the impact of their contributions with real-time updates"
    }
  ];

  const useCases = [
    "Emergency relief fundraising campaigns",
    "Monthly recurring donor programs",
    "Project-specific fundraising drives",
    "Membership and supporter subscriptions",
    "Event ticket sales and registrations",
    "Grant and sponsorship collection"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-primary/10 text-blue-primary rounded-full text-sm font-semibold">
              For NGOs & Charities
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Fundraising Made
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Simple & Transparent</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Focus on your mission, not payment complexity. Accept donations from anywhere in the world with zero setup fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">Start Fundraising</Link>
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
              Built for nonprofits and charities
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
              Everything you need for fundraising
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

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Special Pricing for NGOs
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            We believe in supporting organizations that make a difference. That's why we offer special rates for registered nonprofits and charities.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Contact Us for NGO Pricing</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Amplify your impact with seamless fundraising
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of NGOs using Nardopay to fund their missions
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

export default NGOs;
