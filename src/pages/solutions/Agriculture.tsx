import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  CreditCard, 
  Users, 
  Shield, 
  Zap,
  Leaf,
  Calculator,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Calendar,
  FileText,
  Truck,
  Sprout
} from "lucide-react";

const Agriculture = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Agricultural Payment Processing",
      description: "Accept payments for crops, livestock, equipment, and agricultural services with multiple payment options."
    },
    {
      icon: Globe,
      title: "International Trade Support",
      description: "Enable international buyers to pay for agricultural products in their local currency with competitive exchange rates."
    },
    {
      icon: Users,
      title: "Farmer Portal Integration",
      description: "Seamlessly integrate payment processing into your existing agricultural management systems and farmer portals."
    },
    {
      icon: Shield,
      title: "Secure Payment Processing",
      description: "Secure payment processing with advanced fraud protection for agricultural transactions."
    },
    {
      icon: Calculator,
      title: "Supply Chain Management",
      description: "Handle payments across the entire agricultural supply chain from farmers to distributors to retailers."
    },
    {
      icon: Zap,
      title: "Real-time Payment Confirmation",
      description: "Instant payment confirmations and automated receipt generation for farmers and buyers."
    }
  ];

  const benefits = [
    {
      title: "Empower Smallholder Farmers",
      description: "Enable small-scale farmers to access global markets and receive payments directly to their mobile wallets."
    },
    {
      title: "Streamlined Supply Chain",
      description: "Automate payment collection and reduce administrative overhead across the agricultural value chain."
    },
    {
      title: "Better Financial Planning",
      description: "Faster payment processing and settlement times improve financial planning for farmers and agribusinesses."
    },
    {
      title: "Market Access",
      description: "Connect farmers directly to buyers, eliminating middlemen and improving profit margins."
    }
  ];

  const useCases = [
    {
      title: "Crop Farmers",
      description: "Process payments for grain, vegetables, fruits, and other agricultural produce.",
      icon: Leaf
    },
    {
      title: "Livestock Farmers",
      description: "Handle payments for cattle, poultry, dairy products, and other livestock.",
      icon: Sprout
    },
    {
      title: "Agricultural Cooperatives",
      description: "Accept payments for collective farming operations and member services.",
      icon: Users
    },
    {
      title: "Agribusinesses",
      description: "Integrate payments for agricultural equipment, inputs, and services.",
      icon: Truck
    }
  ];

  const testimonials = [
    {
      name: "John Mwangi",
      role: "Farmer",
      institution: "Nakuru Farmers Cooperative",
      content: "Nardopay has transformed how we receive payments. We now get paid directly to our phones within minutes."
    },
    {
      name: "Sarah Osei",
      role: "CEO",
      institution: "Ghana Agricultural Exports",
      content: "Our international buyers can now pay easily, and our farmers receive their money instantly."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Globe className="w-12 h-12 text-blue-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Agriculture Solutions
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Empower farmers and agribusinesses with modern payment solutions. Connect agricultural producers 
              to global markets with our secure, scalable payment platform designed for the agricultural sector.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-blue-primary hover:bg-blue-primary/90">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-blue-primary mb-4" />
                      <h3 className="font-semibold text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Nardopay for Agriculture?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Perfect For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <Card key={useCase.title} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-blue-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-3">{useCase.title}</h3>
                      <p className="text-muted-foreground text-sm">{useCase.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What Our Agricultural Partners Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.institution}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Transform Agricultural Payments?</h3>
              <p className="text-muted-foreground mb-6">
                Join leading agricultural businesses already using Nardopay to streamline their payment operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-primary hover:bg-blue-primary/90">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Agriculture; 