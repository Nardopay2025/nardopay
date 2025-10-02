import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PesapalPartnership = () => {
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
              NardoPay Partners with Pesapal: Visa and Mastercard Now Accepted
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Yvone Khavetsa</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>March 10, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=600&fit=crop" 
              alt="Partnership Announcement"
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Exciting news! Through our strategic partnership with Pesapal, NardoPay users can now accept Visa and Mastercard payments from customers worldwide.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">A Game-Changing Partnership</h2>
            <p className="text-muted-foreground mb-6">
              We're thrilled to announce our partnership with Pesapal, one of East Africa's leading payment service providers. This collaboration brings a significant upgrade to NardoPay's payment processing capabilities, allowing our users to accept international card payments seamlessly.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">What This Means for You</h2>
            <p className="text-muted-foreground mb-6">
              With this integration, NardoPay merchants can now:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Accept Visa credit and debit card payments from anywhere in the world</li>
              <li>Process Mastercard transactions with instant settlement</li>
              <li>Provide customers with a familiar, trusted payment experience</li>
              <li>Increase conversion rates by offering more payment options</li>
              <li>Expand your customer base to international markets</li>
            </ul>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">About Pesapal</h2>
            <p className="text-muted-foreground mb-6">
              Pesapal has been a pioneer in the African payment space since 2009, processing millions of transactions for businesses across East Africa. Their robust infrastructure and commitment to security make them the perfect partner for NardoPay.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Seamless Integration</h2>
            <p className="text-muted-foreground mb-6">
              The best part? You don't need to do anything. If you're already using NardoPay, Visa and Mastercard payment options are automatically enabled on all your payment links and checkout pages. Your customers will simply see these new payment options when they're ready to pay.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Security First</h2>
            <p className="text-muted-foreground mb-6">
              Both NardoPay and Pesapal are PCI DSS Level 1 compliant, ensuring that all card transactions are processed with the highest level of security. Customer card information is encrypted and never stored on our servers.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Competitive Rates</h2>
            <p className="text-muted-foreground mb-6">
              We've negotiated competitive processing rates for card payments, ensuring you keep more of what you earn. Card payment fees are automatically deducted from each transaction, with no hidden charges or surprise fees.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">What's Next?</h2>
            <p className="text-muted-foreground mb-6">
              This partnership is just the beginning. We're continuously working to expand our payment options and improve our service. Stay tuned for more exciting announcements in the coming months.
            </p>

            <div className="bg-gradient-hero p-8 rounded-lg mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Start Accepting Card Payments Today</h3>
              <p className="text-muted-foreground mb-6">
                Visa and Mastercard payments are now live on all NardoPay accounts.
              </p>
              <Link to="/login">
                <Button variant="hero" size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default PesapalPartnership;
