import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Repeat, Calendar, CreditCard, TrendingUp, Users, Bell, BarChart3, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const SubscriptionLinks = () => {
  const features = [
    {
      icon: Repeat,
      title: "Recurring Billing",
      description: "Automatically charge customers on a weekly, monthly, or yearly schedule"
    },
    {
      icon: Calendar,
      title: "Flexible Plans",
      description: "Create unlimited subscription tiers with different pricing and features"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Automated payment reminders and notifications for upcoming renewals"
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "Accept cards, mobile money, and bank transfers for subscriptions"
    },
    {
      icon: TrendingUp,
      title: "Revenue Analytics",
      description: "Track MRR, churn rate, and customer lifetime value in real-time"
    },
    {
      icon: Users,
      title: "Customer Portal",
      description: "Self-service portal for customers to manage their subscriptions"
    },
    {
      icon: Shield,
      title: "Dunning Management",
      description: "Automatic retry logic for failed payments to reduce involuntary churn"
    },
    {
      icon: Zap,
      title: "Instant Activation",
      description: "Customers get immediate access after successful payment"
    }
  ];

  const useCases = [
    {
      title: "Membership Sites",
      description: "Perfect for exclusive communities, courses, and content platforms",
      examples: ["Online communities", "Premium content", "Member directories"]
    },
    {
      title: "SaaS Products",
      description: "Monetize your software with flexible subscription plans",
      examples: ["Software tools", "Mobile apps", "Web platforms"]
    },
    {
      title: "Services & Coaching",
      description: "Recurring revenue for ongoing services and consulting",
      examples: ["Coaching programs", "Consulting retainers", "Monthly services"]
    },
    {
      title: "Digital Products",
      description: "Subscription access to digital goods and content",
      examples: ["Newsletters", "Templates", "Stock resources"]
    }
  ];

  const benefits = [
    "Predictable recurring revenue every month",
    "Reduce churn with automated payment recovery",
    "No transaction limits or hidden fees",
    "Instant setup - create your first subscription in 60 seconds",
    "Works in 100+ countries with local payment methods",
    "Cancel or pause subscriptions anytime"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-primary/10 text-blue-primary rounded-full text-sm font-semibold">
                  Subscription Links
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Turn One-Time Sales Into
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Recurring Revenue</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create subscription links in seconds. Share anywhere. Get paid automatically—weekly, monthly, or yearly. No website or coding required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">Create Your First Subscription Link</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <Card className="bg-card/80 backdrop-blur-sm border-2 shadow-2xl">
                <CardHeader className="text-center border-b pb-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Repeat className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Premium Membership</CardTitle>
                  <p className="text-muted-foreground">Access all exclusive content</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-foreground mb-2">$29</div>
                    <div className="text-muted-foreground">per month</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Unlimited access to all content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Priority support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Cancel anytime</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">Subscribe Now</Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure payment powered by Nardopay
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need for subscriptions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features to help you build and scale your subscription business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Perfect for any subscription business
            </h2>
            <p className="text-xl text-muted-foreground">
              From coaching to SaaS, subscription links work for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {useCase.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-primary rounded-full"></div>
                        <span className="text-foreground">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why creators choose Nardopay subscriptions
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Start in 3 simple steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle>Create Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set your price, billing frequency, and what subscribers get access to
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle>Share Your Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share your subscription link on social media, email, or anywhere else
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle>Get Paid Automatically</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Subscribers are charged automatically. You get paid on schedule, every time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to build recurring revenue?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators and businesses earning predictable income with subscription links
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">Create Your First Subscription Link</Link>
          </Button>
          <p className="text-muted-foreground mt-4">No credit card required • Free to start</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubscriptionLinks;
