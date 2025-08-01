import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  CreditCard, 
  Users, 
  Globe, 
  Shield, 
  Zap,
  Gift,
  Calculator,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Calendar,
  FileText,
  HandHeart,
  Globe2
} from "lucide-react";

const NGOs = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Donation Processing",
      description: "Accept donations from supporters worldwide with multiple payment methods including mobile money, cards, and bank transfers."
    },
    {
      icon: Globe,
      title: "International Donor Support",
      description: "Enable international donors to contribute in their local currency with automatic conversion and competitive exchange rates."
    },
    {
      icon: Users,
      title: "Donor Portal Integration",
      description: "Seamlessly integrate donation processing into your existing donor management systems and fundraising platforms."
    },
    {
      icon: Shield,
      title: "Transparent Fund Management",
      description: "Secure payment processing with detailed reporting and transparency features for donor accountability."
    },
    {
      icon: Calculator,
      title: "Fundraising Campaign Management",
      description: "Set up different fundraising campaigns, recurring donations, and donor recognition programs."
    },
    {
      icon: Zap,
      title: "Real-time Donation Tracking",
      description: "Instant donation confirmations and automated receipt generation for donors and organizations."
    }
  ];

  const benefits = [
    {
      title: "Increase Donor Reach",
      description: "Access donors from 100+ countries and accept payments in multiple currencies to expand your fundraising potential."
    },
    {
      title: "Reduce Administrative Costs",
      description: "Automate donation collection and processing, reducing overhead and maximizing funds for your programs."
    },
    {
      title: "Improve Donor Experience",
      description: "Convenient payment options and instant confirmations improve donor satisfaction and retention."
    },
    {
      title: "Enhanced Transparency",
      description: "Detailed reporting and tracking features help build trust with donors and demonstrate impact."
    }
  ];

  const useCases = [
    {
      title: "International NGOs",
      description: "Process donations and manage funds for global humanitarian and development programs.",
      icon: Globe2
    },
    {
      title: "Local Charities",
      description: "Accept donations and manage fundraising campaigns for community-based organizations.",
      icon: Heart
    },
    {
      title: "Religious Organizations",
      description: "Handle tithes, offerings, and charitable donations for religious institutions.",
      icon: Gift
    },
    {
      title: "Social Enterprises",
      description: "Integrate payments for social impact businesses and mission-driven organizations.",
      icon: HandHeart
    }
  ];

  const testimonials = [
    {
      name: "Amina Hassan",
      role: "Executive Director",
      institution: "Kenya Women's Empowerment NGO",
      content: "Nardopay has enabled us to reach donors globally. Our fundraising has increased by 300% since implementation."
    },
    {
      name: "David Osei",
      role: "Fundraising Manager",
      institution: "Ghana Education Foundation",
      content: "The transparency features help our donors trust us more, and the automated receipts save us hours of work."
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
              <Heart className="w-12 h-12 text-blue-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                NGOs & Charities Solutions
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Empower non-profit organizations with modern donation processing. Accept contributions from donors worldwide 
              with our secure, transparent payment platform designed specifically for NGOs and charitable organizations.
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
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Nardopay for NGOs?</h2>
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
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What Our NGO Partners Say</h2>
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
              <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Transform Your Fundraising?</h3>
              <p className="text-muted-foreground mb-6">
                Join leading NGOs and charities already using Nardopay to streamline their donation processing.
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

export default NGOs; 