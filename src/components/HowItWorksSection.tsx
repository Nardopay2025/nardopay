import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Link2, Wallet } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      icon: UserPlus,
      title: "Sign up free",
      description: "Enter your email and you're in, no paperwork."
    },
    {
      number: "2",
      icon: Link2,
      title: "Create your link",
      description: "Add what you're selling and your price in under a minute."
    },
    {
      number: "3",
      icon: Wallet,
      title: "Get paid",
      description: "Share the link anywhere and funds land in your Nardopay wallet instantly."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start getting paid
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="relative bg-card/80 backdrop-blur-sm hover:shadow-glow transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="mt-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-blue-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
