import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Globe, HelpCircle, Shield, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const resourceCategories = [
    {
      icon: BookOpen,
      title: "Blog & Guides",
      description: "Learn best practices, tips, and insights about online payments and business growth.",
      items: [
        { title: "How NardoPay Works", href: "/blog/how-nardopay-works" },
        { title: "E-commerce Success Stories", href: "/blog/ecommerce-success" },
        { title: "Revolutionizing Finance", href: "/blog/revolutionizing-finance" },
        { title: "View All Blog Posts", href: "/blog" }
      ],
      color: "text-blue-500"
    },
    {
      icon: Zap,
      title: "Use Cases",
      description: "Discover how businesses like yours are using NardoPay to grow and succeed.",
      items: [
        { title: "Startups", href: "/solutions/startups" },
        { title: "Freelancers", href: "/solutions/freelancers" },
        { title: "Online Business", href: "/solutions/online-business" },
        { title: "View All Use Cases", href: "/use-cases" }
      ],
      color: "text-purple-500"
    },
    {
      icon: Globe,
      title: "Countries & Coverage",
      description: "Check if we support your country and explore our global payment network.",
      items: [
        { title: "Supported Countries", href: "/countries" },
        { title: "International Payments", href: "/#international-payments" },
        { title: "Currency Support", href: "/pricing" }
      ],
      color: "text-green-500"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Learn how we keep your payments safe and compliant with global standards.",
      items: [
        { title: "Security Overview", href: "/security" },
        { title: "Privacy Policy", href: "/privacy-policy" },
        { title: "Terms of Service", href: "/terms-of-service" }
      ],
      color: "text-red-500"
    },
    {
      icon: FileText,
      title: "Integrations",
      description: "Connect NardoPay with your favorite tools and platforms.",
      items: [
        { title: "Pesapal Partnership", href: "/blog/pesapal-partnership" },
        { title: "Available Integrations", href: "/integrations" },
        { title: "API Documentation", href: "/contact" }
      ],
      color: "text-orange-500"
    },
    {
      icon: HelpCircle,
      title: "Support",
      description: "Get help and answers to your questions about using NardoPay.",
      items: [
        { title: "Contact Support", href: "/contact" },
        { title: "Frequently Asked Questions", href: "/#faq" },
        { title: "About Us", href: "/about" }
      ],
      color: "text-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Resources & Learning Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to know about accepting payments, growing your business, 
            and making the most of NardoPay.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <Icon className={`w-12 h-12 mb-4 ${category.color}`} />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.items.map((item) => (
                        <li key={item.title}>
                          <Link 
                            to={item.href}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Guides</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Learn how to create your first payment link and start accepting payments in minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/blog/how-nardopay-works">Read Guide</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>
                  Optimize your payment process and increase conversion rates with proven strategies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/blog/ecommerce-success">Read Guide</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <CardTitle>Security Guide</CardTitle>
                <CardDescription>
                  Understand how NardoPay protects your business and your customers' data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/security">Read Guide</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our support team is here to help you succeed. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">About NardoPay</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
