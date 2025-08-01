import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  CreditCard, 
  Users, 
  Globe, 
  Shield, 
  Zap,
  Stethoscope,
  Calculator,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Calendar,
  FileText,
  Activity
} from "lucide-react";

const Healthcare = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Medical Payment Processing",
      description: "Accept payments for consultations, procedures, medications, and other healthcare services with multiple payment options."
    },
    {
      icon: Globe,
      title: "International Patient Support",
      description: "Enable international patients to pay for medical services in their local currency with competitive exchange rates."
    },
    {
      icon: Users,
      title: "Patient Portal Integration",
      description: "Seamlessly integrate payment processing into your existing patient management systems and healthcare portals."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant Processing",
      description: "Secure payment processing that meets healthcare industry standards and data protection requirements."
    },
    {
      icon: Calculator,
      title: "Insurance & Billing Management",
      description: "Handle insurance claims, co-pays, deductibles, and complex billing scenarios with ease."
    },
    {
      icon: Zap,
      title: "Real-time Payment Confirmation",
      description: "Instant payment confirmations and automated receipt generation for patients and healthcare providers."
    }
  ];

  const benefits = [
    {
      title: "Improved Patient Experience",
      description: "Convenient payment options reduce financial barriers and improve patient satisfaction and retention."
    },
    {
      title: "Streamlined Billing Process",
      description: "Automate payment collection and reduce administrative overhead for healthcare staff."
    },
    {
      title: "Better Cash Flow Management",
      description: "Faster payment processing and settlement times improve financial planning and operations."
    },
    {
      title: "Enhanced Security",
      description: "Advanced fraud protection and secure data handling protect sensitive patient information."
    }
  ];

  const useCases = [
    {
      title: "Hospitals & Clinics",
      description: "Process payments for inpatient and outpatient services, consultations, and medical procedures.",
      icon: Heart
    },
    {
      title: "Specialist Practices",
      description: "Handle payments for specialized medical services, treatments, and consultations.",
      icon: Stethoscope
    },
    {
      title: "Pharmaceutical Services",
      description: "Accept payments for medications, prescriptions, and pharmaceutical products.",
      icon: Activity
    },
    {
      title: "Telemedicine Platforms",
      description: "Integrate payments for virtual consultations and remote healthcare services.",
      icon: Globe
    }
  ];

  const testimonials = [
    {
      name: "Dr. Aisha Bello",
      role: "Medical Director",
      institution: "Lagos Medical Center",
      content: "Nardopay has revolutionized our payment process. Patients can now pay easily and securely from anywhere."
    },
    {
      name: "Dr. John Kamau",
      role: "CEO",
      institution: "Nairobi Healthcare Group",
      content: "Our administrative costs have reduced significantly while improving patient satisfaction with payment options."
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
              <Heart className="w-12 h-12 text-blue-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Healthcare Solutions
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Streamline payment processing for healthcare institutions. Accept payments from patients worldwide 
              with our secure, HIPAA-compliant payment platform designed specifically for the healthcare industry.
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
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Nardopay for Healthcare?</h2>
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
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What Our Healthcare Partners Say</h2>
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
              <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Transform Your Healthcare Payments?</h3>
              <p className="text-muted-foreground mb-6">
                Join leading healthcare institutions already using Nardopay to streamline their payment operations.
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

export default Healthcare; 