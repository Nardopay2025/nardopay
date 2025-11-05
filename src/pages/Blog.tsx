import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Tag,
  ArrowRight,
  Filter,
  BookOpen,
  TrendingUp,
  Zap,
  Globe,
  Shield
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All Posts",
    "Product Updates",
    "Industry Insights",
    "Company News",
    "Tutorials",
    "Case Studies"
  ];

  const blogPosts = [
    {
      id: 1,
      title: "How NardoPay Works: A Complete Guide",
      excerpt: "Discover how NardoPay simplifies payments for African businesses with our easy-to-use platform. From payment links to global reach.",
      author: "Yvone Khavetsa",
      date: "2024-03-15",
      readTime: "8 min read",
      category: "Getting Started",
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=250&fit=crop",
      tags: ["Guide", "Payment Processing", "Getting Started"],
      slug: "/blog/how-nardopay-works"
    },
    {
      id: 2,
      title: "NardoPay Partners with Pesapal: Visa and Mastercard Now Accepted",
      excerpt: "Exciting news! Through our partnership with Pesapal, NardoPay users can now accept Visa and Mastercard payments from customers worldwide.",
      author: "Yvone Khavetsa",
      date: "2024-03-10",
      readTime: "5 min read",
      category: "Product Updates",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
      tags: ["Partnership", "Visa", "Mastercard", "Pesapal"],
      slug: "/blog/pesapal-partnership"
    },
    {
      id: 3,
      title: "How NardoPay is Revolutionizing Finance in Africa",
      excerpt: "From mobile money to international payments, learn how NardoPay is transforming the financial landscape for African entrepreneurs and businesses.",
      author: "Yvone Khavetsa",
      date: "2024-03-05",
      readTime: "10 min read",
      category: "Industry Insights",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      tags: ["Fintech", "Africa", "Innovation", "Revolution"],
      slug: "/blog/revolutionizing-finance"
    },
    {
      id: 4,
      title: "How to Use NardoPay with Vibe Coding and AI",
      excerpt: "Integrate NardoPay payments into your AI-powered applications and Vibe coding projects. A practical guide for developers building the future.",
      author: "Yvone Khavetsa",
      date: "2024-02-28",
      readTime: "12 min read",
      category: "Tutorials",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      tags: ["AI", "Vibe Coding", "Integration", "Developer"],
      slug: "/blog/vibe-coding-ai"
    },
    {
      id: 5,
      title: "How NardoPay Can Help Your E-commerce Store Succeed",
      excerpt: "Boost your online store's conversion rates and reach global customers with NardoPay's comprehensive e-commerce payment solutions.",
      author: "Yvone Khavetsa",
      date: "2024-02-20",
      readTime: "9 min read",
      category: "E-commerce",
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=250&fit=crop",
      tags: ["E-commerce", "Online Store", "Sales", "Growth"],
      slug: "/blog/ecommerce-success"
    },
    {
      id: 7,
      title: "The Impact of Digital Payments on African Economies",
      excerpt: "Analyzing how digital payment adoption is transforming economic growth and financial inclusion across Africa.",
      author: "Sarah Johnson",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Industry Insights",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      tags: ["Digital Payments", "Economy", "Financial Inclusion"]
    },
    {
      id: 8,
      title: "Nardopay's Journey: From Startup to Regional Leader",
      excerpt: "The story of how Nardopay grew from a small startup in Kigali to become a leading payment platform in Africa.",
      author: "Kwame Osei",
      date: "2024-01-03",
      readTime: "11 min read",
      category: "Company News",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      tags: ["Company", "Growth", "Startup"]
    }
  ];

  const featuredPost = blogPosts[0];

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Nardopay Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Insights, updates, and stories from the world of payments in Africa.
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-card/80 backdrop-blur-sm border-border/50"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-blue-primary hover:text-white">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Featured Post</h2>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline">{featuredPost.category}</Badge>
                    <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{featuredPost.title}</h3>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link to={featuredPost.slug}>
                    <Button className="bg-blue-primary hover:bg-blue-primary/90">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div
                  className="rounded-r-lg h-full min-h-[300px]"
                  style={{
                    backgroundImage: `url('${featuredPost.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Latest Articles ({filteredPosts.length})
            </h2>
            <div className="flex gap-2">
              <Badge variant="outline">All Posts</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(1).map((post) => (
              <Card key={post.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div
                    className="h-48 rounded-t-lg"
                    style={{
                      backgroundImage: `url('${post.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Link to={post.slug}>
                      <Button variant="ghost" size="sm" className="text-blue-primary hover:text-blue-primary/80 p-0 h-auto">
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-blue-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to get the latest insights, product updates, and industry news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="bg-blue-primary hover:bg-blue-primary/90">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog; 