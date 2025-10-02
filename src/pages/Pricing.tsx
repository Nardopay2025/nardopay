import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
      description: "Perfect for getting started",
      features: [
        "Up to $1,000 monthly volume",
        "Payment links",
        "Basic catalogue (10 products)",
        "Donation links",
        "Mobile money & cards",
        "Email support",
        "2-3 day settlement",
        "5% withdrawal fee"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "29",
      description: "For growing businesses",
      features: [
        "Up to $5,000 monthly volume",
        "Unlimited payment links",
        "Full catalogue (unlimited products)",
        "Subscription billing",
        "Donation links",
        "All payment methods",
        "Priority support",
        "1-2 day settlement",
        "Custom branding",
        "Webhook notifications",
        "2% withdrawal fee"
      ],
      popular: true,
      cta: "Upgrade Now"
    },
    {
      name: "Business",
      price: "99",
      description: "For established businesses",
      features: [
        "Unlimited monthly volume",
        "Everything in Professional",
        "Dedicated account manager",
        "Same-day settlement",
        "Advanced analytics & reporting",
        "Multi-currency support",
        "Custom integrations",
        "24/7 priority support",
        "White-label options",
        "1% withdrawal fee"
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
      question: "What fees does NardoPay charge?",
      answer: "We charge no transaction fees on payments. Each plan has different withdrawal fees: Starter (5%), Professional (2%), Business (1%). Note: Payment providers (mobile money, banks, card networks) may charge their own fees separately."
    },
    {
      question: "How does automatic billing work?",
      answer: "When you exceed your plan's monthly volume threshold, you're automatically upgraded and billed. Your 30-day billing cycle starts immediately from that day. No setup fees or hidden charges."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel or change your plan anytime. No contracts, no commitments. If you cancel, you keep access until the end of your billing period."
    },
    {
      question: "How quickly do I receive my money?",
      answer: "Settlement times depend on your plan: Starter (2-3 days), Professional (1-2 days), Business (same-day). All settlements are automatic."
    },
    {
      question: "What payment methods do you support?",
      answer: "We support mobile money (M-Pesa, MTN, Airtel Money), credit/debit cards (Visa, Mastercard), bank transfers, and more across 16+ African countries."
    },
    {
      question: "Do you support international payments?",
      answer: "Yes! Accept payments from customers worldwide. Professional and Business plans include multi-currency support with automatic conversion."
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
                Automatic billing
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Cancel anytime
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
              <strong>Note:</strong> Plans are automatically billed when you exceed your monthly volume threshold. 
              Your 30-day billing cycle starts immediately upon upgrade.
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full mt-6"
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
                <Button>
                  Get Started
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
      <Footer />
    </div>
  );
};

export default Pricing;