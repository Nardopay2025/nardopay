import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  BookOpen, 
  Video, 
  FileText,
  HelpCircle,
  Zap,
  Shield,
  Globe,
  CreditCard
} from "lucide-react";

const HelpCenter = () => {
  const helpCategories = [
    {
      icon: CreditCard,
      title: "Getting Started",
      description: "Learn how to set up your Nardopay account and start accepting payments",
      articles: [
        "How to create your first payment link",
        "Setting up your business profile",
        "Connecting your bank account",
        "Understanding transaction fees"
      ]
    },
    {
      icon: Globe,
      title: "International Payments",
      description: "Everything you need to know about cross-border transactions",
      articles: [
        "Supported countries and currencies",
        "Exchange rates and conversion fees",
        "International payment processing times",
        "Compliance and regulations"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Keep your business and customers safe with our security features",
      articles: [
        "PCI DSS compliance",
        "Fraud protection measures",
        "Data encryption standards",
        "Security best practices"
      ]
    },
    {
      icon: Zap,
      title: "API & Integration",
      description: "Integrate Nardopay into your website or application",
      articles: [
        "API authentication",
        "Webhook setup and configuration",
        "SDK documentation",
        "Testing in sandbox mode"
      ]
    }
  ];

  const popularArticles = [
    {
      title: "How to process your first payment",
      category: "Getting Started",
      readTime: "3 min read"
    },
    {
      title: "Understanding transaction fees and charges",
      category: "Billing",
      readTime: "5 min read"
    },
    {
      title: "Setting up webhooks for real-time notifications",
      category: "API & Integration",
      readTime: "7 min read"
    },
    {
      title: "Troubleshooting failed payments",
      category: "Troubleshooting",
      readTime: "4 min read"
    },
    {
      title: "Managing refunds and disputes",
      category: "Transactions",
      readTime: "6 min read"
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: "Available 24/7"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support specialists",
      action: "Call Now",
      available: "Mon-Fri, 8AM-6PM GMT"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message and get a response within 24 hours",
      action: "Send Email",
      available: "Response within 24h"
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
            <HelpCircle className="w-8 h-8 text-blue-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Help Center
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to your questions, learn how to use Nardopay, and get the support you need to grow your business.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search for help articles, guides, or contact support..."
              className="pl-12 pr-4 py-4 text-lg bg-card/80 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-primary" />
                    {category.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article}>
                        <a href="#" className="text-foreground hover:text-blue-primary transition-colors flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Popular Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article) => (
              <Card key={article.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm text-blue-primary font-medium">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-3 hover:text-blue-primary transition-colors cursor-pointer">
                    {article.title}
                  </h3>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-primary hover:text-blue-primary/80">
                    Read Article →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Still Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.title} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <Icon className="w-12 h-12 text-blue-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">{method.title}</h3>
                    <p className="text-muted-foreground mb-4">{method.description}</p>
                    <Button className="w-full mb-3">
                      {method.action}
                    </Button>
                    <p className="text-sm text-muted-foreground">{method.available}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access our comprehensive documentation, API references, and integration guides.
              </p>
              <Button variant="outline" className="w-full">
                View Documentation
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Video className="w-6 h-6 text-blue-primary" />
                Video Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Watch step-by-step video tutorials to learn how to use Nardopay effectively.
              </p>
              <Button variant="outline" className="w-full">
                Watch Tutorials
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 