import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Users,
  Globe,
  Shield,
  Zap
} from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@nardopay.com",
      description: "Get in touch with our team"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+250 1 234 5678",
      description: "Call us during business hours"
    },
    {
      icon: MapPin,
      title: "Office",
      value: "Kigali, Rwanda",
      description: "Visit our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon-Fri, 8AM-6PM GMT",
      description: "We're here to help"
    }
  ];

  const departments = [
    {
      name: "General Inquiries",
      email: "hello@nardopay.com",
      description: "General questions about our services and company"
    },
    {
      name: "Sales",
      email: "sales@nardopay.com",
      description: "Questions about pricing, features, and getting started"
    },
    {
      name: "Support",
      email: "support@nardopay.com",
      description: "Technical support and account assistance"
    },
    {
      name: "Partnerships",
      email: "partnerships@nardopay.com",
      description: "Business partnerships and integrations"
    },
    {
      name: "Press",
      email: "press@nardopay.com",
      description: "Media inquiries and press releases"
    },
    {
      name: "Careers",
      email: "careers@nardopay.com",
      description: "Job opportunities and recruitment"
    }
  ];

  const faqs = [
    {
      question: "How do I get started with Nardopay?",
      answer: "Getting started is easy! Simply sign up for an account, complete the verification process, and you can start accepting payments within minutes."
    },
    {
      question: "What fees does Nardopay charge?",
      answer: "Nardopay charges NO transaction fees. We only charge a 2% fee when you withdraw your money to your bank account or mobile wallet."
    },
    {
      question: "What payment methods do you support?",
      answer: "We support a wide range of payment methods including credit cards, mobile money, bank transfers, and digital wallets across 100+ countries."
    },
    {
      question: "How long does it take to receive payments?",
      answer: "Most payments are processed instantly. Settlement times vary by payment method, typically 1-3 business days for bank transfers."
    },
    {
      question: "Is Nardopay secure?",
      answer: "Yes! We are PCI DSS Level 1 compliant and implement industry-leading security measures to protect your data and transactions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Have questions? We're here to help. Get in touch with our team and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <Card key={info.title} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-blue-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                    <p className="text-foreground mb-2">{info.value}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact Form and Departments */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-blue-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" placeholder="Enter your company name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..."
                      rows={5}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-primary hover:bg-blue-primary/90">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Departments */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Contact by Department</h2>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <Card key={dept.name} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{dept.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{dept.description}</p>
                          <a 
                            href={`mailto:${dept.email}`}
                            className="text-blue-primary hover:text-blue-primary/80 text-sm font-medium"
                          >
                            {dept.email}
                          </a>
                        </div>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Office Location */}
        <div className="mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-primary" />
                Visit Our Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Kigali Innovation City</h3>
                  <p className="text-muted-foreground mb-6">
                    Located in the heart of East Africa's fastest-growing tech hub, our office in Kigali serves as the headquarters for our operations across the continent.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-primary" />
                      <div>
                        <div className="font-medium text-foreground">Address</div>
                        <div className="text-sm text-muted-foreground">Kigali Innovation City, Rwanda</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-primary" />
                      <div>
                        <div className="font-medium text-foreground">Business Hours</div>
                        <div className="text-sm text-muted-foreground">Monday - Friday, 8:00 AM - 6:00 PM GMT</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-primary" />
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <div className="text-sm text-muted-foreground">+250 1 234 5678</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Office Map Placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of businesses already using Nardopay to accept payments globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-primary hover:bg-blue-primary/90">
                Start Your Free Trial
              </Button>
              <Button variant="outline">
                Schedule a Demo
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact; 