import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Africa",
      company: "Kigali, Rwanda",
      rating: 5,
      content: "Nardopay has transformed how we handle payments. The integration was seamless and our customers love the multiple payment options. Our revenue increased by 40% in the first quarter!",
      avatar: "SJ",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "David Mwangi",
      role: "Founder, Mwangi Enterprises",
      company: "Nairobi, Kenya",
      rating: 5,
      content: "The local payment methods integration is incredible. Our customers can now pay with M-Pesa, which was a game-changer for our business. The support team is also very responsive.",
      avatar: "DM",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Aisha Rahman",
      role: "E-commerce Manager",
      company: "Accra, Ghana",
      rating: 5,
      content: "We've been using Nardopay for over a year now. The international payment processing is flawless, and the best part is no transaction fees - we only pay 2% when we withdraw. Highly recommended for any business in Africa.",
      avatar: "AR",
      image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Operations Director",
      company: "Johannesburg, South Africa",
      rating: 5,
      content: "The API integration was straightforward, and the documentation is excellent. We've processed millions of transactions without any issues. Nardopay is our trusted payment partner.",
      avatar: "MC",
      image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Fatima Hassan",
      role: "Business Owner",
      company: "Dar es Salaam, Tanzania",
      rating: 5,
      content: "As a small business owner, I was worried about payment processing costs. Nardopay's no transaction fees policy and excellent service made it easy to get started. We only pay 2% when we withdraw!",
      avatar: "FH",
      image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Kwame Osei",
      role: "Digital Marketing Consultant",
      company: "Kumasi, Ghana",
      rating: 5,
      content: "The payment links feature is brilliant for my consulting business. I can send invoices instantly and get paid within minutes. The mobile app is also very user-friendly.",
      avatar: "KO",
      image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Trusted by businesses across Africa
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our customers have to say about their experience with Nardopay
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-blue-primary/30 mb-4" />
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to avatar initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center hidden">
                      <span className="text-sm font-semibold text-primary-foreground">
                        {testimonial.avatar}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">0</div>
            <div className="text-muted-foreground">Hidden Fees</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">4.9/5</div>
            <div className="text-muted-foreground">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 