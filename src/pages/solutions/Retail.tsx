import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const Retail = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Retail</span> Solutions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete payment solutions for retail businesses. From point-of-sale to e-commerce integration.
            </p>
            <Button variant="hero" size="lg">Learn More</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Retail;