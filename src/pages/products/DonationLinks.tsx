import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, Users, Globe, Shield, TrendingUp, Mail, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const DonationLinks = () => {
  const features = [
    {
      icon: Heart,
      title: "One-Time & Recurring",
      description: "Accept both one-time donations and recurring monthly contributions"
    },
    {
      icon: Users,
      title: "Donor Management",
      description: "Keep track of all your supporters and their contribution history"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept donations from anywhere in the world with local payment methods"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Bank-level security and compliance to protect donor information"
    },
    {
      icon: TrendingUp,
      title: "Impact Tracking",
      description: "Show donors the impact of their contributions with real-time updates"
    },
    {
      icon: Mail,
      title: "Automated Receipts",
      description: "Automatic tax receipts and thank you emails for every donation"
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your donation link on social media, email, or embed on your website"
    },
    {
      icon: CheckCircle,
      title: "No Setup Fees",
      description: "Create unlimited donation links with no monthly fees or hidden costs"
    }
  ];

  const useCases = [
    {
      title: "NGOs & Charities",
      description: "Fundraise for causes, emergency relief, and ongoing programs",
      icon: Heart
    },
    {
      title: "Religious Organizations",
      description: "Accept tithes, offerings, and building fund contributions",
      icon: Globe
    },
    {
      title: "Community Projects",
      description: "Crowdfund local initiatives, schools, and community development",
      icon: Users
    },
    {
      title: "Personal Fundraising",
      description: "Medical expenses, education, memorials, and personal causes",
      icon: Heart
    }
  ];

  const benefits = [
    "0% platform fee on donations (only payment processing fees apply)",
    "Receive donations instantly to your account",
    "Customizable donation amounts and suggested giving levels",
    "Add images, videos, and stories to inspire giving",
    "Donor wall to recognize and thank contributors",
    "Works on all devices - mobile, tablet, and desktop"
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
                  Donation Links
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Make Fundraising
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Simple & Effective</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create a donation link in 60 seconds. Share it anywhere. Accept donations from anyone, anywhere. Perfect for NGOs, charities, churches, and personal causes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">Start Accepting Donations</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <Card className="bg-card/80 backdrop-blur-sm border-2 shadow-2xl">
                <CardHeader className="text-center border-b pb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Support Our Cause</CardTitle>
                  <p className="text-muted-foreground">Help us make a difference in our community</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">Choose an amount</p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <Button variant="outline" className="h-14 text-lg font-semibold">$10</Button>
                      <Button variant="outline" className="h-14 text-lg font-semibold border-2 border-blue-primary">$25</Button>
                      <Button variant="outline" className="h-14 text-lg font-semibold">$50</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-14 text-lg font-semibold">$100</Button>
                      <Button variant="outline" className="h-14 text-lg font-semibold">Custom</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-foreground">Make this a monthly donation</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">Donate Now</Button>
                  
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
              Everything you need for fundraising
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed specifically for nonprofits and fundraisers
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
              Perfect for every cause
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{useCase.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{useCase.description}</p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why choose Nardopay for donations
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
                <CardTitle>Create Your Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up your donation page with your cause, images, and suggested amounts
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle>Share Everywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share your link on social media, email, WhatsApp, or embed on your website
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle>Receive Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Donors give securely and you receive funds instantly to your account
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
            Start raising funds today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of organizations and individuals using Nardopay to make fundraising simple
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">Create Your Donation Link</Link>
          </Button>
          <p className="text-muted-foreground mt-4">No credit card required • Free to start</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonationLinks;
