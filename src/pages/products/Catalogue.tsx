import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Image, ShoppingCart, BarChart } from "lucide-react";

const Catalogue = () => {
  const features = [
    {
      icon: Package,
      title: "Product Management",
      description: "Easily add, edit, and organize your products with rich descriptions and multiple images."
    },
    {
      icon: Image,
      title: "Beautiful Galleries",
      description: "Showcase your products with high-quality image galleries and detailed views."
    },
    {
      icon: ShoppingCart,
      title: "Integrated Checkout",
      description: "Seamless payment flow from product view to completed purchase."
    },
    {
      icon: BarChart,
      title: "Sales Analytics",
      description: "Track performance with detailed analytics on views, conversions, and revenue."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              Product <span className="bg-gradient-primary bg-clip-text text-transparent">Catalogue</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create beautiful product catalogues with integrated payments. Showcase your products and start selling online in minutes.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="hero" size="lg">Create Catalogue</Button>
              <Button variant="outline" size="lg">View Templates</Button>
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
    </div>
  );
};

export default Catalogue;