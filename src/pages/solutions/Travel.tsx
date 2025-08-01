import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, MapPin, CreditCard, Globe } from "lucide-react";

const Travel = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Travel & Hospitality</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized payment solutions for travel agencies, hotels, and hospitality businesses. Accept bookings and payments globally.
            </p>
            <Button variant="hero" size="lg">Get Started</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Travel;