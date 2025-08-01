import { Card, CardContent } from "@/components/ui/card";
import { Globe, Shield, Zap } from "lucide-react";

const InternationalPaymentsSection = () => {
  const paymentLogos = [
    {
      name: "PayPal",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="5" fill="#003087"/>
          <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">PayPal</text>
        </svg>
      )
    },
    {
      name: "M-Pesa",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="10" fill="#00A650"/>
          <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">M-PESA</text>
        </svg>
      )
    },
    {
      name: "MTN",
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-10">
          <rect x="5" y="10" width="70" height="20" rx="5" fill="#FFC107"/>
          <text x="40" y="25" textAnchor="middle" fill="black" fontSize="14" fontWeight="bold">MTN</text>
        </svg>
      )
    },
    {
      name: "Airtel",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="10" fill="#FF0000"/>
          <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AIRTEL</text>
        </svg>
      )
    },
    {
      name: "Tigo",
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-10">
          <rect x="5" y="10" width="70" height="20" rx="5" fill="#9C27B0"/>
          <text x="40" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">TIGO</text>
        </svg>
      )
    },
    {
      name: "Stripe",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="5" fill="#6772E5"/>
          <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">STRIPE</text>
        </svg>
      )
    },
    {
      name: "Mastercard",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <circle cx="30" cy="20" r="12" fill="#EB001B"/>
          <circle cx="40" cy="20" r="12" fill="#F79E1B"/>
          <text x="70" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">mastercard</text>
        </svg>
      )
    },
    {
      name: "Visa",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="5" fill="#1A1F71"/>
          <text x="50" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">VISA</text>
        </svg>
      )
    },
    {
      name: "American Express",
      svg: (
        <svg viewBox="0 0 120 40" className="w-16 h-10">
          <rect x="5" y="10" width="110" height="20" rx="5" fill="#006FCF"/>
          <text x="60" y="25" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">AMERICAN EXPRESS</text>
        </svg>
      )
    },
    {
      name: "Verve",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="5" fill="#7B1FA2"/>
          <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">VERVE</text>
        </svg>
      )
    },
    {
      name: "EcoCash",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="10" fill="#FF0000"/>
          <rect x="5" y="10" width="30" height="20" rx="10" fill="#0066CC"/>
          <rect x="65" y="10" width="30" height="20" rx="10" fill="white"/>
          <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ECOCASH</text>
        </svg>
      )
    },
    {
      name: "ZimSwitch",
      svg: (
        <svg viewBox="0 0 100 40" className="w-16 h-10">
          <rect x="5" y="10" width="90" height="20" rx="5" fill="#FFC107"/>
          <text x="50" y="25" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">ZIMSWITCH</text>
        </svg>
      )
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments from customers in 100+ countries worldwide"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "PCI DSS compliant with bank-level security standards"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time payment processing with instant confirmations"
    }
  ];

  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Never lose an international customer again!
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We've integrated multiple payment gateways to ensure you can receive payments from anywhere in the world. 
            We've also added support for local payment methods for our 37 supported currencies, including PayPal and 
            Stripe (for verified merchants), so all your international customers can truly pay without any hassle.
          </p>
        </div>

        {/* Payment Gateway Logos */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {paymentLogos.map((payment) => (
              <Card key={payment.name} className="group hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="mb-3 group-hover:scale-110 transition-transform">
                    {payment.svg}
                  </div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-blue-primary transition-colors">
                    {payment.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InternationalPaymentsSection; 