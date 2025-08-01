import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Book, Zap, Shield } from "lucide-react";

const APIPage = () => {
  const features = [
    {
      icon: Code,
      title: "RESTful APIs",
      description: "Simple, intuitive REST APIs with comprehensive documentation and examples."
    },
    {
      icon: Book,
      title: "Developer Docs",
      description: "Detailed documentation with code samples in multiple programming languages."
    },
    {
      icon: Zap,
      title: "Fast Integration",
      description: "Get up and running in minutes with our SDKs and pre-built components."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with API keys, webhooks, and encryption."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              Developer <span className="bg-gradient-primary bg-clip-text text-transparent">APIs</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful, developer-friendly APIs to integrate payments into your applications. Build custom payment flows with ease.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="hero" size="lg">Get API Keys</Button>
              <Button variant="outline" size="lg">View Documentation</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start integrating in minutes
            </h2>
          </div>
          
          <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="bg-secondary/50 rounded-lg p-6 font-mono text-sm">
                <div className="text-green-success">// Create a payment</div>
                <div className="text-blue-primary">const</div> <span className="text-foreground">payment</span> = <div className="text-blue-primary">await</div> <span className="text-foreground">nardopay.payments.create</span>({`{`}
                <div className="ml-4">
                  <div><span className="text-blue-primary">amount</span>: <span className="text-orange-400">5000</span>,</div>
                  <div><span className="text-blue-primary">currency</span>: <span className="text-green-400">'NGN'</span>,</div>
                  <div><span className="text-blue-primary">customer</span>: {`{`}</div>
                  <div className="ml-4">
                    <div><span className="text-blue-primary">email</span>: <span className="text-green-400">'customer@example.com'</span></div>
                  </div>
                  <div>{`}`}</div>
                </div>
                <div>{`}`});</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default APIPage;