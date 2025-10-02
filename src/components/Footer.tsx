import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: "Payment Links", href: "/products/payment-links" },
      { name: "Catalogue", href: "/products/catalogue" },
      { name: "Subscription Links", href: "/products/subscription-links" },
      { name: "Donation Links", href: "/products/donation-links" },
    ],
    solutions: [
      { name: "Startups", href: "/solutions/startups" },
      { name: "Freelancers", href: "/solutions/freelancers" },
      { name: "Online Business", href: "/solutions/online-business" },
      { name: "Agencies", href: "/solutions/agencies" },
      { name: "NGOs & Charities", href: "/solutions/ngos" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Mission", href: "/mission" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" }
    ],
    support: [
      { name: "Use Cases", href: "/use-cases" },
      { name: "Countries", href: "/countries" },
      { name: "Integrations", href: "/integrations" },
      { name: "Security", href: "/security" },
      { name: "Pricing", href: "/pricing" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" }
  ];

  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "100+ countries supported"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "PCI DSS compliant"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time payments"
    }
  ];

  return (
    <footer className="bg-gradient-secondary border-t border-border/50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Nardopay</h3>
              <p className="text-muted-foreground mb-6">
                The unified payment platform for African businesses. Accept payments, manage transactions, and grow your business globally.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-primary" />
                    <div>
                      <div className="font-medium text-foreground">{feature.title}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Newsletter */}
            <div className="mb-8">
              <h4 className="font-semibold text-foreground mb-3">Stay updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm"
                />
                <Button size="sm" variant="hero">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-primary" />
              <div>
                <div className="font-medium text-foreground">Email</div>
                <div className="text-sm text-muted-foreground">support@nardopay.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-primary" />
              <div>
                <div className="font-medium text-foreground">Phone</div>
                <div className="text-sm text-muted-foreground">+250 798 654 834</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-primary" />
              <div>
                <div className="font-medium text-foreground">Address</div>
                <div className="text-sm text-muted-foreground">Kigali, Rwanda</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Nardopay. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 