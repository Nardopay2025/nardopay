import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, TrendingUp, Shield } from "lucide-react";

const Enterprises = () => {
  const features = [
    {
      icon: Building,
      title: "Enterprise Scale",
      description: "Handle millions of transactions with 99.9% uptime and global infrastructure."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Role-based access controls and team management for large organizations."
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics for enterprise decision making."
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description: "Meet regulatory requirements with built-in compliance tools."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Enterprise</span> Solutions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Scalable payment infrastructure designed for large enterprises. Handle complex payment flows with confidence.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="hero" size="lg">Contact Sales</Button>
              <Button variant="outline" size="lg">Request Demo</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
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
    </div>
  );
};

export default Enterprises;