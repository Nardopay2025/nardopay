import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EcommerceSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <header className="mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              How NardoPay Can Help Your E-commerce Store Succeed
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Yvone Khavetsa</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 20, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>9 min read</span>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&h=600&fit=crop" 
              alt="E-commerce Success"
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Boost your online store's conversion rates and reach global customers with NardoPay's comprehensive e-commerce payment solutions.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The E-commerce Opportunity in Africa</h2>
            <p className="text-muted-foreground mb-6">
              E-commerce is booming across Africa. More people are shopping online than ever before, and the trend shows no signs of slowing down. But to capitalize on this opportunity, you need a payment solution that works for your customers.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Payment Challenge</h2>
            <p className="text-muted-foreground mb-6">
              Many e-commerce stores in Africa lose sales at checkout because they don't offer the right payment methods. Your customers want to pay with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Mobile money (M-Pesa, MTN, Airtel Money)</li>
              <li>Credit and debit cards (Visa, Mastercard)</li>
              <li>Bank transfers</li>
              <li>Local payment methods specific to their country</li>
            </ul>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">How NardoPay Solves This</h2>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Multiple Payment Methods in One Place</h3>
            <p className="text-muted-foreground mb-6">
              With NardoPay, you can accept all major payment methods through a single integration. No need to set up separate accounts with different payment providers.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Beautiful Product Catalogs</h3>
            <p className="text-muted-foreground mb-6">
              Create a stunning online store using NardoPay's product catalog feature. Add products with images, descriptions, variants (size, color), and pricing. Your catalog is automatically mobile-optimized for maximum conversions.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Fast Checkout Experience</h3>
            <p className="text-muted-foreground mb-6">
              Every second counts at checkout. NardoPay's streamlined checkout process minimizes friction and abandoned carts. Customers can complete their purchase in just a few clicks.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Instant Payment Confirmation</h3>
            <p className="text-muted-foreground mb-6">
              Both you and your customers receive instant payment confirmations. This builds trust and allows you to fulfill orders immediately.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Multi-Currency Support</h3>
            <p className="text-muted-foreground mb-6">
              Sell to customers across Africa and beyond. NardoPay supports multiple currencies, and customers can pay in their local currency while you receive payments in yours.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Real Success Stories</h2>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Fashion Boutique in Nairobi</h3>
            <p className="text-muted-foreground mb-6">
              A small fashion boutique in Nairobi was struggling to accept online payments. After switching to NardoPay, they saw a 40% increase in online sales within the first month. The ability to accept M-Pesa payments was a game-changer.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Handmade Crafts Store in Lagos</h3>
            <p className="text-muted-foreground mb-6">
              An artisan selling handmade crafts expanded from local sales to international customers using NardoPay. The multi-currency support and card payment options opened up new markets.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Electronics Retailer in Kigali</h3>
            <p className="text-muted-foreground mb-6">
              A mid-sized electronics retailer integrated NardoPay with their existing website. The seamless checkout experience reduced cart abandonment by 35%.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Best Practices for E-commerce</h2>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Display All Payment Options Clearly</h3>
            <p className="text-muted-foreground mb-6">
              Show customers all available payment methods before they start checkout. This builds confidence and reduces surprises.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Optimize for Mobile</h3>
            <p className="text-muted-foreground mb-6">
              Most African customers shop on mobile devices. Ensure your product pages and checkout flow work perfectly on smartphones.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Provide Excellent Customer Support</h3>
            <p className="text-muted-foreground mb-6">
              Be available to help customers with payment questions. Quick responses build trust and increase conversion rates.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Use Clear Product Descriptions</h3>
            <p className="text-muted-foreground mb-6">
              High-quality images and detailed descriptions reduce returns and increase customer satisfaction.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-6">
              Setting up NardoPay for your e-commerce store takes just minutes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Create your free NardoPay account</li>
              <li>Add your products to the catalog</li>
              <li>Customize your checkout page with your branding</li>
              <li>Share your store link or embed it on your website</li>
              <li>Start selling!</li>
            </ul>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Pricing That Works</h2>
            <p className="text-muted-foreground mb-6">
              No setup fees, no monthly subscriptions. Pay only when you make sales. As your business grows, you'll benefit from lower transaction fees.
            </p>

            <div className="bg-gradient-hero p-8 rounded-lg mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Start Selling Online Today</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of e-commerce stores using NardoPay to grow their business.
              </p>
              <Link to="/login">
                <Button variant="hero" size="lg">Create Your Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EcommerceSuccess;
