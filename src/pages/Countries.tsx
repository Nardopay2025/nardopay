import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, CreditCard, Smartphone, Building2, Search } from "lucide-react";
import { useState } from "react";

const Countries = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const countries = [
    {
      name: "Kenya",
      flag: "🇰🇪",
      region: "East Africa",
      paymentMethods: ["M-Pesa", "Airtel Money", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Tanzania",
      flag: "🇹🇿",
      region: "East Africa",
      paymentMethods: ["M-Pesa", "Tigo Pesa", "Airtel Money", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Uganda",
      flag: "🇺🇬",
      region: "East Africa",
      paymentMethods: ["MTN Mobile Money", "Airtel Money", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Rwanda",
      flag: "🇷🇼",
      region: "East Africa",
      paymentMethods: ["MTN Mobile Money", "Airtel Money", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Nigeria",
      flag: "🇳🇬",
      region: "West Africa",
      paymentMethods: ["Bank Transfer", "Visa", "Mastercard", "Verve", "USSD"]
    },
    {
      name: "Ghana",
      flag: "🇬🇭",
      region: "West Africa",
      paymentMethods: ["MTN Mobile Money", "Vodafone Cash", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "South Africa",
      flag: "🇿🇦",
      region: "Southern Africa",
      paymentMethods: ["Visa", "Mastercard", "Bank Transfer", "Instant EFT", "SnapScan"]
    },
    {
      name: "Zambia",
      flag: "🇿🇲",
      region: "Southern Africa",
      paymentMethods: ["MTN Mobile Money", "Airtel Money", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Ethiopia",
      flag: "🇪🇹",
      region: "East Africa",
      paymentMethods: ["Bank Transfer", "M-Birr", "HelloCash"]
    },
    {
      name: "Senegal",
      flag: "🇸🇳",
      region: "West Africa",
      paymentMethods: ["Orange Money", "Free Money", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Côte d'Ivoire",
      flag: "🇨🇮",
      region: "West Africa",
      paymentMethods: ["Orange Money", "MTN Mobile Money", "Moov Money", "Visa", "Mastercard"]
    },
    {
      name: "Cameroon",
      flag: "🇨🇲",
      region: "Central Africa",
      paymentMethods: ["Orange Money", "MTN Mobile Money", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Botswana",
      flag: "🇧🇼",
      region: "Southern Africa",
      paymentMethods: ["Visa", "Mastercard", "Bank Transfer", "Orange Money"]
    },
    {
      name: "Mozambique",
      flag: "🇲🇿",
      region: "Southern Africa",
      paymentMethods: ["M-Pesa", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Malawi",
      flag: "🇲🇼",
      region: "Southern Africa",
      paymentMethods: ["Airtel Money", "TNM Mpamba", "Visa", "Mastercard", "Bank Transfer"]
    },
    {
      name: "Zimbabwe",
      flag: "🇿🇼",
      region: "Southern Africa",
      paymentMethods: ["EcoCash", "OneMoney", "Telecash", "Visa", "Mastercard"]
    }
  ];

  const paymentMethodIcons = {
    "M-Pesa": Smartphone,
    "Airtel Money": Smartphone,
    "MTN Mobile Money": Smartphone,
    "Visa": CreditCard,
    "Mastercard": CreditCard,
    "Bank Transfer": Building2,
    "Orange Money": Smartphone,
    "Tigo Pesa": Smartphone,
    "Vodafone Cash": Smartphone,
    "EcoCash": Smartphone,
    "Verve": CreditCard,
    "USSD": Smartphone
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const regions = ["East Africa", "West Africa", "Southern Africa", "Central Africa"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Supported <span className="bg-gradient-primary bg-clip-text text-transparent">Countries</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Accept payments from customers across Africa and beyond. We support multiple payment methods in each country.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search countries or regions..."
                className="pl-12 pr-4 py-4 text-lg bg-card/80 backdrop-blur-sm border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Countries by Region */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {regions.map((region) => {
            const regionCountries = filteredCountries.filter(c => c.region === region);
            if (regionCountries.length === 0) return null;
            
            return (
              <div key={region} className="mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-8">{region}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regionCountries.map((country) => (
                    <Card key={country.name} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-4xl">{country.flag}</span>
                          <CardTitle className="text-2xl">{country.name}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{country.region}</p>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold text-foreground mb-3">Payment Methods</h4>
                        <div className="space-y-2">
                          {country.paymentMethods.map((method) => {
                            const Icon = paymentMethodIcons[method as keyof typeof paymentMethodIcons] || CreditCard;
                            return (
                              <div key={method} className="flex items-center gap-2 text-sm text-foreground">
                                <Icon className="w-4 h-4 text-primary" />
                                {method}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payment Methods Overview */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Payment Methods We Support
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We integrate with the most popular payment providers across Africa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Mobile Money</h3>
                <p className="text-muted-foreground">
                  M-Pesa, MTN, Airtel Money, Orange Money, and more
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Card Payments</h3>
                <p className="text-muted-foreground">
                  Visa, Mastercard, Verve, and local card schemes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Bank Transfers</h3>
                <p className="text-muted-foreground">
                  Direct bank transfers and instant EFT
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Countries;
