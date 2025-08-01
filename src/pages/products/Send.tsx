import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Shield, Zap, Users, ArrowRight, CheckCircle } from "lucide-react";

const SendPage = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "Send money to any Nardopay user instantly. No waiting, no delays."
    },
    {
      icon: Shield,
      title: "Secure & Encrypted",
      description: "Bank-level security with end-to-end encryption for all transactions."
    },
    {
      icon: Users,
      title: "Easy Recipients",
      description: "Find recipients by phone number, email, or username. No account numbers needed."
    }
  ];

  const benefits = [
    "No transfer fees between Nardopay accounts",
    "Real-time transaction notifications",
    "Transaction history and receipts",
    "Support for multiple currencies",
    "24/7 customer support",
    "Mobile app and web access"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  <Send className="w-4 h-4 mr-2" />
                  Money Transfer
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-foreground">Send money to</span><br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">anyone, anywhere</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Transfer funds instantly to any Nardopay account. Fast, secure, and completely free between users.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg">
                  Start Sending
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Mock Send Interface */}
            <div className="relative">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Send className="w-6 h-6 text-blue-primary" />
                    <h3 className="font-semibold text-foreground">Send Money</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Recipient</label>
                      <input 
                        type="text" 
                        placeholder="Phone, email, or username"
                        className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Amount</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Message (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="What's this for?"
                        className="w-full p-3 bg-secondary/50 border border-border rounded-lg text-foreground"
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Send Money
                  </Button>
                </div>
              </Card>

              {/* Success notification */}
              <Card className="absolute -bottom-4 -left-4 p-4 bg-green-success/10 border-green-success/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-success" />
                  <span className="text-green-success font-medium">Transfer Complete</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why choose Nardopay Send?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the fastest and most secure way to send money to friends, family, and business partners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-foreground">
                Everything you need for seamless money transfers
              </h2>
              <p className="text-xl text-muted-foreground">
                Our comprehensive send feature includes all the tools and security measures you need for worry-free transfers.
              </p>
              
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button variant="hero" size="lg">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Recent Transfers</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">$ 50,000</div>
                        <div className="text-sm text-muted-foreground">To: john@example.com</div>
                      </div>
                      <div className="w-2 h-2 bg-green-success rounded-full" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">$ 25,000</div>
                        <div className="text-sm text-muted-foreground">To: +2508012345678</div>
                      </div>
                      <div className="w-2 h-2 bg-green-success rounded-full" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">$ 15,000</div>
                        <div className="text-sm text-muted-foreground">To: sarah_wilson</div>
                      </div>
                      <div className="w-2 h-2 bg-green-success rounded-full" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SendPage; 