import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  CreditCard, 
  Users, 
  Globe, 
  Shield, 
  Zap,
  BookOpen,
  Calculator,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Calendar,
  FileText
} from "lucide-react";

const Education = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Tuition Payment Processing",
      description: "Accept tuition payments from students worldwide with multiple payment methods including mobile money, cards, and bank transfers."
    },
    {
      icon: Globe,
      title: "International Student Support",
      description: "Enable international students to pay tuition in their local currency with automatic conversion and competitive exchange rates."
    },
    {
      icon: Users,
      title: "Student Portal Integration",
      description: "Seamlessly integrate payment processing into your existing student management systems and portals."
    },
    {
      icon: Shield,
      title: "Secure Payment Processing",
      description: "PCI DSS compliant payment processing with advanced fraud protection and secure data handling."
    },
    {
      icon: Calculator,
      title: "Fee Management",
      description: "Set up different fee structures, payment plans, and installment options for various programs and courses."
    },
    {
      icon: Zap,
      title: "Instant Payment Confirmation",
      description: "Real-time payment confirmations and automated receipt generation for students and administrators."
    }
  ];

  const benefits = [
    {
      title: "Reduced Administrative Burden",
      description: "Automate payment collection and reconciliation, freeing up staff time for student support."
    },
    {
      title: "Improved Cash Flow",
      description: "Faster payment processing and settlement times improve your institution's financial planning."
    },
    {
      title: "Enhanced Student Experience",
      description: "Convenient payment options reduce barriers for students and improve enrollment rates."
    },
    {
      title: "Global Reach",
      description: "Accept payments from students in 100+ countries, expanding your international student base."
    }
  ];

  const useCases = [
    {
      title: "Universities & Colleges",
      description: "Process tuition, accommodation, and other fees for undergraduate and graduate programs.",
      icon: GraduationCap
    },
    {
      title: "Schools & Academies",
      description: "Handle school fees, uniform payments, and extracurricular activity costs.",
      icon: BookOpen
    },
    {
      title: "Training Centers",
      description: "Accept payments for professional development courses and certification programs.",
      icon: Users
    },
    {
      title: "Online Learning Platforms",
      description: "Integrate payments for online courses, webinars, and digital learning resources.",
      icon: Globe
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Mwangi",
      role: "Finance Director",
      institution: "Nairobi University",
      content: "Nardopay has transformed how we handle international student payments. The process is now seamless and secure."
    },
    {
      name: "Prof. Kwame Osei",
      role: "Registrar",
      institution: "Accra Business School",
      content: "Our administrative overhead has reduced by 60% since implementing Nardopay's payment solutions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="w-12 h-12 text-blue-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Education Solutions
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Streamline tuition collection and fee management for educational institutions of all sizes. 
              Accept payments from students worldwide with our secure, scalable payment platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-blue-primary hover:bg-blue-primary/90">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-blue-primary mb-4" />
                      <h3 className="font-semibold text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Nardopay for Education?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Perfect For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <Card key={useCase.title} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-blue-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-3">{useCase.title}</h3>
                      <p className="text-muted-foreground text-sm">{useCase.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What Our Education Partners Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.institution}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Transform Your Payment Process?</h3>
              <p className="text-muted-foreground mb-6">
                Join leading educational institutions already using Nardopay to streamline their payment operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-primary hover:bg-blue-primary/90">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Education; 