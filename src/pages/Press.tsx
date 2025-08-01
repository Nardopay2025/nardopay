import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar,
  Users,
  TrendingUp,
  Award,
  Globe,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const Press = () => {
  const pressReleases = [
    {
      date: "2024-01-15",
      title: "Nardopay Raises $10M Series A to Expand Across Africa",
      summary: "Funding will accelerate product development and market expansion across the continent.",
      category: "Funding",
      readTime: "3 min read"
    },
    {
      date: "2024-01-10",
      title: "Nardopay Achieves PCI DSS Level 1 Compliance",
      summary: "Company reaches highest security standard for payment processors, ensuring customer data protection.",
      category: "Security",
      readTime: "2 min read"
    },
    {
      date: "2024-01-05",
      title: "Nardopay Launches Mobile Money Integration",
      summary: "New feature enables seamless integration with major mobile money providers across Africa.",
      category: "Product",
      readTime: "4 min read"
    },
    {
      date: "2023-12-20",
      title: "Nardopay Reaches 50,000 Active Merchants",
      summary: "Milestone achievement demonstrates rapid growth and adoption across African markets.",
      category: "Growth",
      readTime: "2 min read"
    },
    {
      date: "2023-12-15",
      title: "Nardopay Expands to 100+ Countries",
      summary: "Global expansion enables African businesses to accept payments from customers worldwide.",
      category: "Expansion",
      readTime: "3 min read"
    },
    {
      date: "2023-12-10",
      title: "Nardopay Named Top Fintech Startup in Africa",
      summary: "Recognition from leading industry publication highlights innovation and impact.",
      category: "Awards",
      readTime: "2 min read"
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo",
      description: "High-resolution Nardopay logos in various formats",
      type: "PNG, SVG, JPG",
      size: "2.1 MB"
    },
    {
      title: "Brand Guidelines",
      description: "Complete brand guidelines and style guide",
      type: "PDF",
      size: "5.3 MB"
    },
    {
      title: "Product Screenshots",
      description: "High-quality screenshots of our platform",
      type: "PNG",
      size: "8.7 MB"
    },
    {
      title: "Team Photos",
      description: "Professional headshots of our leadership team",
      type: "JPG",
      size: "3.2 MB"
    },
    {
      title: "Company Fact Sheet",
      description: "Key facts and statistics about Nardopay",
      type: "PDF",
      size: "1.8 MB"
    },
    {
      title: "Press Kit",
      description: "Complete press kit with all media assets",
      type: "ZIP",
      size: "25.4 MB"
    }
  ];

  const inTheNews = [
    {
      source: "TechCrunch",
      title: "Nardopay Raises $10M to Democratize Payments in Africa",
      date: "2024-01-15",
      url: "#"
    },
    {
      source: "VentureBeat",
      title: "African Fintech Startup Nardopay Expands to 100+ Countries",
      date: "2023-12-15",
      url: "#"
    },
    {
      source: "Forbes",
      title: "The Rise of African Fintech: Nardopay's Journey",
      date: "2023-11-20",
      url: "#"
    },
    {
      source: "Reuters",
      title: "Nardopay Achieves PCI DSS Compliance",
      date: "2024-01-10",
      url: "#"
    }
  ];

  const awards = [
    {
      title: "Best Fintech Startup 2024",
      organization: "African Tech Awards",
      date: "2024-01-20"
    },
    {
      title: "Innovation in Payments",
      organization: "Fintech Africa Summit",
      date: "2023-12-05"
    },
    {
      title: "Top 50 African Startups",
      organization: "TechCabal",
      date: "2023-11-15"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Press & Media
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Stay updated with the latest news, press releases, and media resources from Nardopay.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-primary hover:bg-blue-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download Media Kit
            </Button>
            <Button variant="outline" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Contact Press
            </Button>
          </div>
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{release.category}</Badge>
                        <span className="text-sm text-muted-foreground">{release.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{release.title}</h3>
                      <p className="text-muted-foreground mb-4">{release.summary}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(release.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-blue-primary hover:text-blue-primary/80">
                      Read Full Release
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Media Kit</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaKit.map((item) => (
              <Card key={item.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* In the News */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">In the News</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {inTheNews.map((article) => (
              <Card key={article.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground">{article.source}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-3">{article.title}</h3>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-primary hover:text-blue-primary/80">
                    Read Article
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Awards & Recognition</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award) => (
              <Card key={award.title} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-blue-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{award.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{award.organization}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(award.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Press Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-primary" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <div className="text-sm text-muted-foreground">press@nardopay.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-primary" />
                  <div>
                    <div className="font-medium text-foreground">Phone</div>
                    <div className="text-sm text-muted-foreground">+250 1 234 5678</div>
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
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our press releases and media updates to stay informed about Nardopay's latest news and announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-primary hover:bg-blue-primary/90">
                Subscribe to Press Releases
              </Button>
              <Button variant="outline">
                Follow Us on Social Media
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Press; 