import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Package, Repeat } from "lucide-react";
import { Link } from "react-router-dom";

const ProductsSection = () => {
  const products = [
    {
      icon: Link2,
      title: "Payment Links",
      description: "Create and share payment links in seconds. Perfect for one-time sales. No website required.",
      href: "/products/payment-links"
    },
    {
      icon: Package,
      title: "Catalogue",
      description: "Showcase multiple products with images and prices. Your online shop, ready to share.",
      href: "/products/catalogue"
    },
    {
      icon: Repeat,
      title: "Subscription Links",
      description: "Set up recurring payments for memberships, subscriptions, and services. Get paid automatically.",
      href: "/products/subscription-links"
    }
  ];

  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything you need to get paid
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create payment links in seconds. Accept cards, mobile money, and bank transfers. Get paid instantly from anywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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