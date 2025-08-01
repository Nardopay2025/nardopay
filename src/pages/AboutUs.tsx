import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Zap,
  Shield,
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  ArrowRight
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    {
      number: "100+",
      label: "Countries Supported",
      icon: Globe
    },
    {
      number: "0%",
      label: "Transaction Fees",
      icon: Shield
    },
    {
      number: "24/7",
      label: "Support",
      icon: Users
    },
    {
      number: "99.9%",
      label: "Uptime",
      icon: Zap
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do, ensuring their success is our success."
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description: "Building trust through robust security measures and transparent business practices."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Empowering African businesses to compete globally through innovative payment solutions."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Continuously innovating to provide cutting-edge payment technology and exceptional user experiences."
    }
  ];

  const team = [
    {
      name: "Takura Ndoro",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Visionary leader with deep expertise in fintech and a passion for democratizing payments across Africa."
    },
    {
      name: "Smart Israel",
      role: "COO & Co-founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Operations expert driving strategic growth and operational excellence across the continent."
    },
    {
      name: "Anesu Kafesu",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Technology leader building scalable payment infrastructure and innovative fintech solutions."
    },
    {
      name: "Emmanuel Nyadongo",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Product strategist focused on creating seamless payment experiences for African businesses."
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
            About Nardopay
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're on a mission to democratize payments across Africa, enabling businesses of all sizes to accept payments from anywhere in the world and send money anywhere in Africa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-primary hover:bg-blue-primary/90">
              Join Our Team
            </Button>
            <Button variant="outline" size="lg">
              View Our Story
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-blue-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  To empower African businesses with the tools they need to compete globally by providing seamless, secure, and affordable payment solutions that work everywhere.
                </p>
                <p className="text-muted-foreground">
                  We believe that every business, regardless of size or location, should have access to world-class payment technology that enables them to grow and succeed.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-primary" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  To become the leading payment platform in Africa, connecting businesses and consumers across the continent and beyond through innovative financial technology.
                </p>
                <p className="text-muted-foreground">
                  We envision a future where African businesses can easily accept payments from anywhere in the world and send money anywhere in Africa with just a few clicks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Icon className="w-12 h-12 text-blue-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-blue-primary flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-blue-primary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>



        {/* Office */}
        <div className="mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-primary" />
                Our Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Kigali, Rwanda</h3>
                  <p className="text-muted-foreground mb-4">
                    Located in the heart of East Africa's fastest-growing tech hub, our office in Kigali serves as the headquarters for our operations across the continent.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Address:</strong> Kigali Innovation City, Rwanda
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Phone:</strong> +250 1 234 5678
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Email:</strong> hello@nardopay.com
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">Office Image Placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Join Us in Building the Future of Payments</h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals who share our passion for innovation and commitment to empowering African businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-primary hover:bg-blue-primary/90">
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline">
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 