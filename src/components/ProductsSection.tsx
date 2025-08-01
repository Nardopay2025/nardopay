import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Package, Wallet, Code, Send, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ProductsSection = () => {
  const products = [
    {
      icon: Link2,
      title: "Payment Links",
      description: "Create instant payment links for customers worldwide. Accept M-Pesa, cards, and bank transfers in one link.",
      href: "/products/payment-links"
    },
    {
      icon: Package,
      title: "Catalogue",
      description: "Showcase your products to global customers with integrated African and international payment methods.",
      href: "/products/catalogue"
    },
    {
      icon: Send,
      title: "Send",
      description: "Send money to anyone in Africa instantly. Perfect for business payments, family support, and partnerships.",
      href: "/products/send"
    },
    {
      icon: Zap,
      title: "Direct Pay",
      description: "Pay anyone with any payment method they prefer. From EcoCash to InnBucks, support any payment service.",
      href: "/products/direct-pay"
    },
    {
      icon: Code,
      title: "API",
      description: "Integrate African payment methods into your apps. Support for M-Pesa, MTN Money, and international cards.",
      href: "/products/api"
    }
  ];

  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Built for African business growth
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From local mobile money to international cards, we provide African businesses with the tools to accept payments from anywhere and expand globally.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Card key={product.title} className="group hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-foreground">{product.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4">
                    {product.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={product.href}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;