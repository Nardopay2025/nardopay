import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RevolutionizingFinance = () => {
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
              How NardoPay is Revolutionizing Finance in Africa
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Yvone Khavetsa</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>March 5, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>10 min read</span>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop" 
              alt="African Financial Revolution"
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              From mobile money to international payments, learn how NardoPay is transforming the financial landscape for African entrepreneurs and businesses.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The African Financial Challenge</h2>
            <p className="text-muted-foreground mb-6">
              For decades, African businesses have faced significant challenges when it comes to accepting payments. Traditional banking infrastructure was limited, international payments were expensive and slow, and many customers didn't have access to credit cards or bank accounts.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">The Mobile Money Revolution</h2>
            <p className="text-muted-foreground mb-6">
              The introduction of mobile money services like M-Pesa transformed the landscape. Suddenly, millions of Africans had access to digital financial services through their mobile phones. However, businesses still struggled to integrate these payment methods into their operations.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Enter NardoPay</h2>
            <p className="text-muted-foreground mb-6">
              NardoPay was founded with a simple mission: make it easy for any African business to accept payments, regardless of the payment method or where their customers are located.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Breaking Down Barriers</h2>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Unified Payment Platform</h3>
            <p className="text-muted-foreground mb-6">
              Instead of integrating with dozens of different payment providers, businesses can now accept all payment methods through a single NardoPay account. Mobile money, cards, bank transfers—all in one place.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">2. No Technical Knowledge Required</h3>
            <p className="text-muted-foreground mb-6">
              You don't need to be a developer or have a website to start accepting payments. NardoPay's payment links work anywhere—share them via WhatsApp, email, or social media, and start getting paid.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Instant Settlement</h3>
            <p className="text-muted-foreground mb-6">
              Unlike traditional payment processors that hold your money for days or weeks, NardoPay deposits funds into your wallet immediately. Withdraw to your bank account whenever you need.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Affordable for Everyone</h3>
            <p className="text-muted-foreground mb-6">
              No setup fees, no monthly fees, no minimum transaction volumes. Pay only when you get paid. This makes professional payment processing accessible to businesses of all sizes, from solo entrepreneurs to large enterprises.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Real Impact Stories</h2>
            <p className="text-muted-foreground mb-6">
              Across Africa, NardoPay is enabling:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Artisans in rural Kenya selling their crafts internationally</li>
              <li>Tech startups in Lagos accepting subscription payments</li>
              <li>NGOs in Kigali receiving donations from around the world</li>
              <li>Freelance designers in Nairobi getting paid by international clients</li>
              <li>E-commerce stores in Accra processing hundreds of orders daily</li>
            </ul>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Financial Inclusion at Scale</h2>
            <p className="text-muted-foreground mb-6">
              By making payment acceptance simple and affordable, NardoPay is contributing to financial inclusion across Africa. Small businesses that were previously cash-only can now participate in the digital economy. Entrepreneurs can start online businesses without significant upfront investment.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Looking Ahead</h2>
            <p className="text-muted-foreground mb-6">
              We're just getting started. As we expand to more countries and add new features, our commitment remains the same: empower every African business to accept payments easily, securely, and affordably.
            </p>

            <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Join the Revolution</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're a small business owner, a freelancer, or running a large enterprise, NardoPay is here to help you grow. The financial revolution in Africa is happening now, and we want you to be part of it.
            </p>

            <div className="bg-gradient-hero p-8 rounded-lg mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Be Part of the Change</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of African businesses revolutionizing how they accept payments.
              </p>
              <Link to="/login">
                <Button variant="hero" size="lg">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default RevolutionizingFinance;
