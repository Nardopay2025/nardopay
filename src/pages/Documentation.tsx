import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  Globe, 
  Download,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Play,
  FileText,
  Settings,
  Database
} from "lucide-react";
import { useState } from "react";

const Documentation = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const quickStartSteps = [
    {
      step: 1,
      title: "Get Your API Keys",
      description: "Sign up for a Nardopay account and generate your API keys from the dashboard.",
      code: "curl -X POST https://api.nardopay.com/v1/auth/login \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"email\": \"your-email@example.com\",\n    \"password\": \"your-password\"\n  }'"
    },
    {
      step: 2,
      title: "Create a Payment Link",
      description: "Use our API to create payment links for your customers.",
      code: "curl -X POST https://api.nardopay.com/v1/payment-links \\\n  -H 'Authorization: Bearer YOUR_API_KEY' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"amount\": 1000,\n    \"currency\": \"USD\",\n    \"description\": \"Payment for services\",\n    \"redirect_url\": \"https://your-site.com/success\"\n  }'"
    },
    {
      step: 3,
      title: "Handle Webhooks",
      description: "Set up webhooks to receive real-time payment notifications.",
      code: "// Webhook endpoint example\napp.post('/webhook', (req, res) => {\n  const signature = req.headers['nardopay-signature'];\n  const payload = req.body;\n  \n  if (verifySignature(signature, payload)) {\n    // Process the payment event\n    console.log('Payment received:', payload);\n  }\n  \n  res.status(200).send('OK');\n});"
    }
  ];

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/v1/payment-links",
      description: "Create a new payment link",
      category: "Payment Links"
    },
    {
      method: "GET",
      endpoint: "/v1/payment-links/{id}",
      description: "Retrieve a payment link",
      category: "Payment Links"
    },
    {
      method: "POST",
      endpoint: "/v1/transactions",
      description: "Create a direct transaction",
      category: "Transactions"
    },
    {
      method: "GET",
      endpoint: "/v1/transactions/{id}",
      description: "Get transaction details",
      category: "Transactions"
    },
    {
      method: "POST",
      endpoint: "/v1/refunds",
      description: "Process a refund",
      category: "Refunds"
    },
    {
      method: "GET",
      endpoint: "/v1/accounts/balance",
      description: "Get account balance",
      category: "Accounts"
    }
  ];

  const sdks = [
    {
      name: "JavaScript/Node.js",
      version: "v2.1.0",
      description: "Official SDK for Node.js applications",
      icon: "⚡",
      downloadUrl: "#",
      docsUrl: "#"
    },
    {
      name: "Python",
      version: "v1.8.0",
      description: "Python SDK for server-side applications",
      icon: "🐍",
      downloadUrl: "#",
      docsUrl: "#"
    },
    {
      name: "PHP",
      version: "v1.5.0",
      description: "PHP SDK for web applications",
      icon: "🐘",
      downloadUrl: "#",
      docsUrl: "#"
    },
    {
      name: "Java",
      version: "v1.3.0",
      description: "Java SDK for enterprise applications",
      icon: "☕",
      downloadUrl: "#",
      docsUrl: "#"
    }
  ];

  const guides = [
    {
      title: "Getting Started with Nardopay API",
      description: "Learn the basics of integrating Nardopay into your application",
      category: "Beginner",
      readTime: "10 min read",
      icon: BookOpen
    },
    {
      title: "Webhook Integration Guide",
      description: "Set up webhooks to receive real-time payment notifications",
      category: "Intermediate",
      readTime: "15 min read",
      icon: Zap
    },
    {
      title: "Security Best Practices",
      description: "Implement secure payment processing with our security guidelines",
      category: "Advanced",
      readTime: "20 min read",
      icon: Shield
    },
    {
      title: "International Payment Processing",
      description: "Handle cross-border payments and currency conversion",
      category: "Intermediate",
      readTime: "12 min read",
      icon: Globe
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
            <BookOpen className="w-8 h-8 text-blue-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Documentation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comprehensive guides, API references, and SDKs to help you integrate Nardopay into your applications and start accepting payments globally.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-primary hover:bg-blue-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download SDKs
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              API Reference
            </Button>
            <Button variant="outline" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Interactive Examples
            </Button>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Quick Start Guide</h2>
          <div className="space-y-8">
            {quickStartSteps.map((step) => (
              <Card key={step.step} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                      {step.step}
                    </Badge>
                    {step.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{step.code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(step.code, `step-${step.step}`)}
                    >
                      {copied === `step-${step.step}` ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">API Endpoints</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {apiEndpoints.map((endpoint) => (
              <Card key={endpoint.endpoint} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant={endpoint.method === "GET" ? "default" : "secondary"}
                      className="font-mono"
                    >
                      {endpoint.method}
                    </Badge>
                    <Badge variant="outline">{endpoint.category}</Badge>
                  </div>
                  <h3 className="font-mono text-foreground mb-2">{endpoint.endpoint}</h3>
                  <p className="text-muted-foreground text-sm">{endpoint.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SDKs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Official SDKs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdks.map((sdk) => (
              <Card key={sdk.name} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{sdk.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">{sdk.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{sdk.description}</p>
                  <Badge variant="outline" className="mb-4">{sdk.version}</Badge>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-3 h-3 mr-1" />
                      Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guides */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Integration Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Card key={guide.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-blue-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{guide.category}</Badge>
                          <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{guide.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{guide.description}</p>
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-primary hover:text-blue-primary/80">
                          Read Guide →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-primary" />
                API Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Check real-time status of our API endpoints and services.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Status Page
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-primary" />
                Sandbox Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Test your integration with our sandbox environment before going live.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Access Sandbox
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-blue-primary" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Need help with your integration? Our support team is here to help.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Documentation; 