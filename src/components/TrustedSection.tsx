import { Card } from "@/components/ui/card";

const TrustedSection = () => {
  const businesses = [
    { name: "Smaertel", color: "text-green-500" },
    { name: "Menava", color: "text-blue-800" },
    { name: "Frenies", color: "text-purple-500" },
    { name: "Novus", color: "text-blue-400" },
    { name: "The Cubicle Africa", color: "text-green-400" },
    { name: "Househand Rwanda", color: "text-orange-500" },
    { name: "Happy Toes", color: "text-pink-400" },
    { name: "Power Buddy", color: "text-orange-600" },
    { name: "Crocs.zw", color: "text-black" },
    { name: "Ambience", color: "text-cyan-400" }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-2">
            Trusted by 10,000+ businesses of all sizes
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            Your business, powered by smarter payments
          </h2>
        </div>
        
        {/* Scrolling logos */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-12 items-center">
            {businesses.concat(businesses).map((business, index) => (
              <Card key={index} className="flex-shrink-0 px-8 py-4 bg-card/50 border-border/30">
                <div className={`text-xl font-semibold ${business.color}`}>
                  {business.name}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedSection;