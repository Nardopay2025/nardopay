import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, Building2, Zap, Globe, Wallet } from "lucide-react";

const Integrations = () => {
  const integrations = [
    {
      category: "Card Payments",
      icon: CreditCard,
      description: "Accept major credit and debit cards worldwide",
      methods: [
        { name: "Visa", logo: "💳", description: "Global card network" },
        { name: "Mastercard", logo: "💳", description: "Worldwide acceptance" },
        { name: "Verve", logo: "💳", description: "Nigerian local card scheme" },
        { name: "American Express", logo: "💳", description: "Premium card network" }
      ]
    },
    {
      category: "Mobile Money",
      icon: Smartphone,
      description: "Africa's most popular payment method",
      methods: [
        { name: "M-Pesa", logo: "📱", description: "Kenya, Tanzania, Mozambique" },
        { name: "MTN Mobile Money", logo: "📱", description: "Uganda, Ghana, Rwanda, Cameroon" },
        { name: "Airtel Money", logo: "📱", description: "Kenya, Uganda, Tanzania, Zambia" },
        { name: "Orange Money", logo: "📱", description: "Senegal, Côte d'Ivoire, Cameroon" },
        { name: "Tigo Pesa", logo: "📱", description: "Tanzania mobile money" },
        { name: "Vodafone Cash", logo: "📱", description: "Ghana mobile payments" },
        { name: "EcoCash", logo: "📱", description: "Zimbabwe mobile money" },
        { name: "TNM Mpamba", logo: "📱", description: "Malawi mobile money" }
      ]
    },
    {
      category: "Bank Transfers",
      icon: Building2,
      description: "Direct bank account transfers",
      methods: [
        { name: "SWIFT", logo: "🏦", description: "International wire transfers" },
        { name: "Local Bank Transfer", logo: "🏦", description: "Domestic transfers" },
        { name: "Instant EFT", logo: "🏦", description: "South Africa instant transfers" },
        { name: "USSD Banking", logo: "🏦", description: "Nigeria USSD payments" }
      ]
    },
    {
      category: "Payment Gateways",
      icon: Zap,
      description: "Integrated payment processing partners",
      methods: [
        { name: "Pesapal", logo: "⚡", description: "East Africa payment gateway" },
        { name: "Flutterwave", logo: "⚡", description: "Pan-African payments" },
        { name: "Paystack", logo: "⚡", description: "Nigeria and Ghana" },
        { name: "DPO Group", logo: "⚡", description: "African payment solutions" }
      ]
    },
    {
      category: "Digital Wallets",
      icon: Wallet,
      description: "Popular digital wallet services",
      methods: [
        { name: "PayPal", logo: "💰", description: "Global digital wallet" },
        { name: "Chipper Cash", logo: "💰", description: "African digital wallet" },
        { name: "Wave", logo: "💰", description: "West Africa mobile money" }
      ]
    },
    {
      category: "Cryptocurrency",
      icon: Globe,
      description: "Accept crypto payments",
      methods: [
        { name: "Bitcoin", logo: "₿", description: "BTC payments" },
        { name: "Ethereum", logo: "Ξ", description: "ETH and ERC-20 tokens" },
        { name: "USDT", logo: "₮", description: "Stablecoin payments" },
        { name: "USDC", logo: "💵", description: "USD Coin stablecoin" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Payment <span className="bg-gradient-primary bg-clip-text text-transparent">Integrations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Accept payments from customers using their preferred payment method. We integrate with all major payment providers across Africa and globally.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.category}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{integration.category}</h2>
                    <p className="text-muted-foreground">{integration.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {integration.methods.map((method) => (
                    <Card key={method.name} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="text-4xl mb-2">{method.logo}</div>
                        <CardTitle className="text-xl">{method.name}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Payment Coverage
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive payment acceptance across Africa and beyond
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-primary mb-2">40+</div>
                <p className="text-muted-foreground">Payment Methods</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-primary mb-2">16+</div>
                <p className="text-muted-foreground">African Countries</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <p className="text-muted-foreground">Countries Worldwide</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Payment Processing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;
