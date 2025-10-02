import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const HowNardoPayWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              How NardoPay Works: A Complete Guide
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Yvone Khavetsa</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>March 15, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&h=600&fit=crop" 
              alt="How NardoPay Works"
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Discover how NardoPay simplifies payments for African businesses with our easy-to-use platform. From payment links to global reach, here's everything you need to know.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">What is NardoPay?</h2>
            <p className="text-muted-foreground mb-6">
              NardoPay is a comprehensive payment platform designed specifically for African businesses. We enable you to accept payments from customers anywhere in the world using their preferred payment method—whether that's mobile money, credit cards, or bank transfers.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">How It Works</h2>
            <p className="text-muted-foreground mb-6">
              Getting started with NardoPay is incredibly simple. Here's how it works in three easy steps:
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Create Your Account</h3>
            <p className="text-muted-foreground mb-6">
              Sign up for a free NardoPay account in less than 2 minutes. No credit card required to get started. Simply provide your basic business information, and you're ready to go.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Generate Payment Links</h3>
            <p className="text-muted-foreground mb-6">
              Create custom payment links for your products, services, or donations. You can create one-time payment links, subscription links, or even build a complete product catalog. Share these links via email, social media, WhatsApp, or embed them on your website.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Get Paid Instantly</h3>
            <p className="text-muted-foreground mb-6">
              When customers click your payment link, they're taken to a secure checkout page where they can pay using their preferred method. Funds are deposited into your NardoPay wallet immediately, and you can withdraw to your bank account anytime.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Key Features</h2>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Payment Links</h3>
            <p className="text-muted-foreground mb-6">
              Create and share payment links in seconds. Perfect for invoicing, selling products, or accepting donations. Each link is customizable with your branding, product details, and pricing.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Product Catalog</h3>
            <p className="text-muted-foreground mb-6">
              Build a beautiful online store without any coding. Add products with images, descriptions, and variants. Your customers can browse and purchase directly from your catalog.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Subscription Billing</h3>
            <p className="text-muted-foreground mb-6">
              Set up recurring payments for memberships, subscriptions, or service retainers. NardoPay automatically bills your customers and manages the entire subscription lifecycle.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Multi-Currency Support</h3>
            <p className="text-muted-foreground mb-6">
              Accept payments in multiple currencies and get paid in your local currency. We handle all the currency conversion automatically at competitive rates.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Who Should Use NardoPay?</h2>
            <p className="text-muted-foreground mb-6">
              NardoPay is perfect for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>E-commerce stores selling physical or digital products</li>
              <li>Freelancers and consultants invoicing clients</li>
              <li>Content creators monetizing their work</li>
              <li>NGOs and charities accepting donations</li>
              <li>Agencies managing multiple client payments</li>
              <li>Startups building subscription-based services</li>
            </ul>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Security & Compliance</h2>
            <p className="text-muted-foreground mb-6">
              Your security is our top priority. NardoPay is PCI DSS compliant and uses bank-level encryption to protect all transactions. We never store sensitive card information, and all payments are processed through secure, certified payment gateways.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground mb-6">
              We believe in transparent, straightforward pricing. There are no setup fees, no monthly fees, and no hidden charges. You only pay a small transaction fee when you successfully receive a payment. The more you process, the lower your fees.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-6">
              Ready to start accepting payments? Create your free NardoPay account today and start receiving payments from customers across Africa and around the world.
            </p>

            <div className="bg-gradient-hero p-8 rounded-lg mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Start Accepting Payments Today</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of African businesses using NardoPay to grow their revenue.
              </p>
              <Link to="/login">
                <Button variant="hero" size="lg">Create Free Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default HowNardoPayWorks;
