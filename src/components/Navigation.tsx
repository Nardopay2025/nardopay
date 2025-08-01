import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  Menu, 
  X, 
  CreditCard, 
  Link as LinkIcon, 
  ShoppingCart, 
  Wallet, 
  Code, 
  Building2, 
  Rocket, 
  Plane, 
  Calendar, 
  GraduationCap, 
  Store, 
  Truck, 
  Zap, 
  Heart, 
  BookOpen, 
  HelpCircle, 
  FileText,
  Globe,
  DollarSign,
  TrendingUp,
  Send
} from "lucide-react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const productItems = [
    { 
      name: "Payment Links", 
      href: "/products/payment-links", 
      description: "Create shareable payment links instantly",
      icon: LinkIcon 
    },
    { 
      name: "Catalogue", 
      href: "/products/catalogue", 
      description: "Build your online store with ease",
      icon: ShoppingCart 
    },

    { 
      name: "Send", 
      href: "/products/send", 
      description: "Send money anywhere in Africa",
      icon: Globe 
    },
    { 
      name: "Direct Pay", 
      href: "/products/direct-pay", 
      description: "Pay anyone with any payment method",
      icon: Send 
    },
    { 
      name: "API", 
      href: "/products/api", 
      description: "Integrate payments into your app",
      icon: Code 
    },
  ];

  const solutionItems = [
    {
      category: "By Sector", 
      items: [
        { 
          name: "Education", 
          href: "/solutions/education", 
          description: "Process tuition and fees",
          icon: GraduationCap 
        },
        { 
          name: "Healthcare", 
          href: "/solutions/healthcare", 
          description: "Process medical payments",
          icon: Heart 
        },
        { 
          name: "Agriculture", 
          href: "/solutions/agriculture", 
          description: "Support farmers and agribusiness",
          icon: Globe 
        },
        { 
          name: "NGOs & Charities", 
          href: "/solutions/ngos", 
          description: "Accept donations and manage funds",
          icon: Heart 
        },
      ]
    }
  ];

  const resourceItems = [
    { 
      name: "Documentation", 
      href: "/docs", 
      description: "API docs and integration guides",
      icon: FileText 
    },
    { 
      name: "Blog", 
      href: "/blog", 
      description: "Latest news and insights",
      icon: BookOpen 
    },
    { 
      name: "Help Center", 
      href: "/help", 
      description: "Get help and support",
      icon: HelpCircle 
    },
    { 
      name: "Status", 
      href: "/status", 
      description: "Check system status",
      icon: TrendingUp 
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">Nardopay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                <span>Products</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="grid grid-cols-1 gap-3">
                  {productItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.name} asChild className="p-3 rounded-lg hover:bg-muted/50">
                        <Link to={item.href} className="w-full flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-blue-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96 p-4">
                <div className="space-y-6">
                  {solutionItems.map((category) => (
                    <div key={category.category}>
                      <div className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                        {category.category}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {category.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem key={item.name} asChild className="p-3 rounded-lg hover:bg-muted/50">
                              <Link to={item.href} className="w-full flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-4 h-4 text-blue-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-foreground text-sm">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">{item.description}</div>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/docs" className="text-foreground hover:text-primary transition-colors">
              Developers
            </Link>
            
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                <span>Resources</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="grid grid-cols-1 gap-3">
                  {resourceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.name} asChild className="p-3 rounded-lg hover:bg-muted/50">
                        <Link to={item.href} className="w-full flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-blue-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link to="/products" className="text-foreground hover:text-primary">Products</Link>
              <Link to="/solutions" className="text-foreground hover:text-primary">Solutions</Link>
              <Link to="/developers" className="text-foreground hover:text-primary">Developers</Link>
              <Link to="/pricing" className="text-foreground hover:text-primary">Pricing</Link>
              <Link to="/resources" className="text-foreground hover:text-primary">Resources</Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;