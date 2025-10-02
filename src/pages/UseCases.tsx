import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Repeat, Heart, GraduationCap, Briefcase, Users, Smartphone, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const UseCases = () => {
  const useCases = [
    {
      icon: ShoppingCart,
      title: "E-commerce & Online Stores",
      description: "Accept payments for physical and digital products",
      details: "Perfect for online retailers selling products globally. Create product catalogs, manage inventory, and process orders seamlessly.",
      benefits: [
        "Multi-currency support for global sales",
        "Instant payment confirmation",
        "Automated order notifications",
        "Mobile-optimized checkout"
      ],
      cta: "Start Selling",
      link: "/solutions/online-business"
    },
    {
      icon: Repeat,
      title: "Subscription Services",
      description: "Recurring billing for memberships and SaaS",
      details: "Ideal for subscription-based businesses, membership sites, and SaaS platforms. Automate recurring payments and manage customer subscriptions effortlessly.",
      benefits: [
        "Automated recurring billing",
        "Flexible billing cycles",
        "Trial period support",
        "Subscription analytics"
      ],
      cta: "Learn More",
      link: "/products/subscription-links"
    },
    {
      icon: Heart,
      title: "Donations & Fundraising",
      description: "Accept donations for causes and charities",
      details: "Built for NGOs, charities, and fundraising campaigns. Create branded donation pages and accept contributions from supporters worldwide.",
      benefits: [
        "One-time and recurring donations",
        "Transparent fee structure",
        "Donor management tools",
        "Campaign tracking"
      ],
      cta: "Start Fundraising",
      link: "/solutions/ngos"
    },
    {
      icon: GraduationCap,
      title: "Online Education",
      description: "Sell courses, workshops, and educational content",
      details: "Perfect for course creators, educators, and online learning platforms. Sell courses, workshops, and educational materials with instant access.",
      benefits: [
        "Course enrollment payments",
        "Instant content delivery",
        "Student payment tracking",
        "Certificate programs"
      ],
      cta: "Get Started",
      link: "/solutions/online-business"
    },
    {
      icon: Briefcase,
      title: "Freelancing & Services",
      description: "Get paid for consulting and professional services",
      details: "Designed for freelancers, consultants, and service providers. Send invoices, create service packages, and get paid faster.",
      benefits: [
        "Custom service packages",
        "Booking and scheduling",
        "Client payment tracking",
        "Professional invoicing"
      ],
      cta: "Start Earning",
      link: "/solutions/freelancers"
    },
    {
      icon: Users,
      title: "Agencies & Teams",
      description: "Multi-client billing and project payments",
      details: "Built for agencies managing multiple clients and projects. Streamline billing, track payments, and manage team operations.",
      benefits: [
        "Multi-client management",
        "Project-based billing",
        "Team payment tracking",
        "Client reporting"
      ],
      cta: "Learn More",
      link: "/solutions/agencies"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps & Games",
      description: "In-app purchases and digital content",
      details: "For mobile app developers and game creators. Monetize your apps with seamless payment integration for in-app purchases.",
      benefits: [
        "In-app purchase support",
        "Digital content delivery",
        "Global payment methods",
        "Real-time payment tracking"
      ],
      cta: "Get Started",
      link: "/solutions/startups"
    },
    {
      icon: Globe,
      title: "International Payments",
      description: "Cross-border transactions and remittances",
      details: "Accept payments from customers worldwide. Support for multiple currencies and local payment methods across Africa and beyond.",
      benefits: [
        "Multi-currency support",
        "Local payment methods",
        "Competitive exchange rates",
        "Fast settlement"
      ],
      cta: "Go Global",
      link: "/pricing"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Use Cases</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how businesses across industries use NardoPay to accept payments, grow revenue, and reach customers globally.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                    <CardDescription className="text-base">{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{useCase.details}</p>
                    <ul className="space-y-2">
                      {useCase.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Link to={useCase.link}>
                      <Button variant="outline" className="w-full mt-4">
                        {useCase.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of businesses using NardoPay to power their payments.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button variant="hero" size="lg">Create Account</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UseCases;
