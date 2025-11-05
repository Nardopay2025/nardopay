import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Image, ShoppingCart, BarChart3, Zap, Globe, Shield, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutPreview from "@/components/checkout/CheckoutPreview";

const Catalogue = () => {
  const features = [
    {
      icon: Package,
      title: "Product Management",
      description: "Easily add, edit, and organize unlimited products with rich descriptions"
    },
    {
      icon: Image,
      title: "Beautiful Galleries",
      description: "Showcase products with high-quality images and detailed photo galleries"
    },
    {
      icon: ShoppingCart,
      title: "Integrated Checkout",
      description: "Seamless payment flow from product view to completed purchase"
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Track performance with detailed analytics on views, sales, and revenue"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Create your online store in minutes without coding or technical skills"
    },
    {
      icon: Globe,
      title: "Share Anywhere",
      description: "Share your catalogue link on social media, WhatsApp, or your website"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level security for all transactions with fraud protection"
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "Accept cards, mobile money, and bank transfers from customers"
    }
  ];

  const useCases = [
    {
      title: "Retail Businesses",
      description: "Sell physical products online without a complicated e-commerce setup",
      examples: ["Clothing stores", "Electronics", "Beauty products"]
    },
    {
      title: "Digital Products",
      description: "Showcase and sell digital goods with instant delivery",
      examples: ["E-books", "Templates", "Online courses"]
    },
    {
      title: "Food & Beverage",
      description: "Display your menu and accept orders with ease",
      examples: ["Restaurants", "Bakeries", "Catering services"]
    },
    {
      title: "Handmade Crafts",
      description: "Perfect for artisans and creators selling unique products",
      examples: ["Jewelry", "Art", "Custom items"]
    }
  ];

  const benefits = [
    "No website required - just share your catalogue link",
    "Mobile-optimized shopping experience for customers",
    "Inventory management and stock tracking",
    "Customer order history and management",
    "Customizable product categories and filters",
    "Real-time notifications for new orders"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-primary/10 text-blue-primary rounded-full text-sm font-semibold">
                  Product Catalogue
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Online Store,
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Ready to Share</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create a beautiful product catalogue in minutes. Showcase unlimited products with images, accept payments, and start selling online—no website or coding needed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">Create Your Catalogue</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Preview Card (standardized) */}
            <div className="relative">
              <CheckoutPreview
                businessName="Nardo Boutique"
                headerGradient="linear-gradient(135deg, #3B82F6, #1D4ED8)"
                productName="Premium T-Shirt"
                productDescription="High-quality cotton"
                amount="USD 25.00"
                imageUrl="https://images.unsplash.com/photo-1520975922284-8b456906c813?auto=format&fit=crop&q=80&w=1600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to sell online
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional e-commerce features without the complexity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Perfect for any type of business
            </h2>
            <p className="text-xl text-muted-foreground">
              From physical products to digital goods, catalogues work for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {useCase.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-primary rounded-full"></div>
                        <span className="text-foreground">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why choose Nardopay catalogues
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Start selling in 3 simple steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle>Add Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload your products with images, descriptions, and prices
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle>Share Your Catalogue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share your catalogue link on social media, WhatsApp, or anywhere
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle>Receive Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customers browse, buy, and pay - you get instant notifications
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start selling?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses selling online with Nardopay catalogues
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">Create Your Catalogue</Link>
          </Button>
          <p className="text-muted-foreground mt-4">No credit card required • Free to start</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Catalogue;
