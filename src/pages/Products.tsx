import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Package, Repeat, Heart, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const products = [
    {
      icon: Link2,
      title: "Payment Links",
      description: "Create and share payment links in seconds. Perfect for one-time sales, invoices, and quick payments.",
      features: ["No website required", "Instant setup", "Mobile money & cards", "Custom branding"],
      href: "/products/payment-links",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Package,
      title: "Catalogue",
      description: "Showcase multiple products with images and prices. Your complete online shop, ready to share.",
      features: ["Multiple products", "Image galleries", "Inventory tracking", "Professional storefront"],
      href: "/products/catalogue",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Repeat,
      title: "Subscription Links",
      description: "Set up recurring payments for memberships, subscriptions, and services. Get paid automatically every month.",
      features: ["Recurring billing", "Free trials", "Member management", "Automated payments"],
      href: "/products/subscription-links",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Donation Links",
      description: "Accept donations and fundraise for your cause. Track progress and thank your supporters automatically.",
      features: ["Goal tracking", "Progress display", "Thank you messages", "Multiple currencies"],
      href: "/products/donation-links",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Everything You Need to Get Paid
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Simple, powerful payment tools that work for businesses of all sizes. 
            Start accepting payments in minutes, not days.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <Card key={product.title} className="group hover:shadow-glow transition-all duration-300 border-2">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{product.title}</CardTitle>
                    <CardDescription className="text-base">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <Link to={product.href}>
                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Accepting Payments?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of businesses already using NardoPay to get paid faster.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
