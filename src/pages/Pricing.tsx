import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  CreditCard,
  ArrowRight,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  MessageCircle
} from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to $1,000 monthly volume",
        "No transaction fees",
        "2% fee only at withdrawal",
        "Basic payment links",
        "Email support",
        "Standard settlement (2-3 days)",
        "Mobile money integration"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      price: "29",
      description: "Ideal for growing businesses",
      features: [
        "Up to $50,000 monthly volume",
        "No transaction fees",
        "2% fee only at withdrawal",
        "Advanced payment links",
        "Catalogue builder",
        "Priority support",
        "Faster settlement (1-2 days)",
        "API access",
        "Webhook notifications"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Business",
      price: "99",
      description: "For established businesses",
      features: [
        "Up to $500,000 monthly volume",
        "No transaction fees",
        "2% fee only at withdrawal",
        "All Professional features",
        "Custom branding",
        "Dedicated account manager",
        "Same-day settlement",
        "Advanced analytics",
        "Multi-currency support"
      ],
      popular: false,
      cta: "Contact Sales"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited volume",
        "No transaction fees",
        "2% fee only at withdrawal",
        "All Business features",
        "White-label solutions",
        "24/7 dedicated support",
        "Instant settlement",
        "Custom integrations",
        "SLA guarantees"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "PCI DSS Level 1 compliant with bank-grade security"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments from 100+ countries worldwide"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time payment processing and confirmations"
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "Cards, mobile money, bank transfers, and more"
    }
  ];

  const faqs = [
    {
      question: "What fees does Nardopay charge?",
      answer: "Nardopay charges NO transaction fees. We only charge a 2% fee when you withdraw your money to your bank account or mobile wallet."
    },
    {
      question: "Are there any setup fees?",
      answer: "No, there are no setup fees. You can start accepting payments immediately with our free plan."
    },
    {
      question: "What about fees from payment providers?",
      answer: "Your mobile money provider, bank, or card network may charge their own fees. These are separate from Nardopay's fees and vary by provider."
    },
    {
      question: "How quickly do I receive my money?",
      answer: "Settlement times vary by plan: Starter (2-3 days), Professional (1-2 days), Business (same-day), Enterprise (instant)."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "Do you support international payments?",
      answer: "Yes, we support payments from 100+ countries with automatic currency conversion."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Choose the plan that's right for your business. All plans include our core features 
              with no hidden fees or surprise charges.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                No setup fees
              </Badge>
              <Badge variant="secondary" className="text-sm">
                No transaction fees
              </Badge>
              <Badge variant="secondary" className="text-sm">
                2% fee only at withdrawal
              </Badge>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-blue-primary' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-primary text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      {plan.price === "Custom" ? (
                        <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      ) : (
                        <>
                          <span className="text-2xl text-muted-foreground">$</span>
                          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                          {plan.price !== "0" && <span className="text-muted-foreground">/month</span>}
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-6 ${
                        plan.popular 
                          ? 'bg-blue-primary hover:bg-blue-primary/90' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">All Plans Include</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-blue-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq) => (
                <Card key={faq.question} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of businesses already using Nardopay to accept payments globally.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-primary hover:bg-blue-primary/90">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
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

export default Pricing; 