import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, DollarSign, Zap, HeartHandshake } from "lucide-react";

const Startups = () => {
  const features = [
    {
      icon: Rocket,
      title: "Quick Setup",
      description: "Get started in minutes with simple integration and minimal setup requirements."
    },
    {
      icon: DollarSign,
      title: "Startup-Friendly Pricing",
      description: "Competitive rates with no hidden fees. Pay only for what you use."
    },
    {
      icon: Zap,
      title: "Rapid Scaling",
      description: "Scale from your first payment to millions without changing platforms."
    },
    {
      icon: HeartHandshake,
      title: "Dedicated Support",
      description: "Personal support from our team to help you grow your business."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Startup</span> Solutions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Perfect payment solutions for startups. Simple, affordable, and built to scale with your growing business.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="hero" size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">View Pricing</Button>
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

export default Startups;