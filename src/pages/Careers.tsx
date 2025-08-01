import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Zap,
  Globe,
  Shield,
  Award,
  ArrowRight,
  Filter,
  Briefcase,
  GraduationCap,
  Coffee,
  Wifi,
  Calendar
} from "lucide-react";
import { useState } from "react";

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const departments = [
    "All Departments",
    "Engineering",
    "Product",
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "Legal"
  ];

  const locations = [
    "All Locations",
    "Kigali, Rwanda",
    "Remote",
    "Lagos, Nigeria",
    "Nairobi, Kenya",
    "Cape Town, South Africa"
  ];

  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Kigali, Rwanda",
      type: "Full-time",
      experience: "5+ years",
      description: "Build scalable payment infrastructure and APIs that power millions of transactions across Africa.",
      requirements: [
        "Strong experience with Node.js, Python, or Go",
        "Experience with cloud platforms (AWS, GCP)",
        "Knowledge of payment systems and fintech",
        "Experience with microservices architecture"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance",
        "Remote work options",
        "Professional development budget"
      ]
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Lead product strategy and development for our payment platform, focusing on African market needs.",
      requirements: [
        "Experience in fintech or payments",
        "Strong analytical and strategic thinking",
        "Experience with user research and data analysis",
        "Knowledge of African markets"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance",
        "Remote work options",
        "Professional development budget"
      ]
    },
    {
      id: 3,
      title: "Sales Manager",
      department: "Sales",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "4+ years",
      description: "Drive revenue growth by acquiring and managing relationships with key merchants across West Africa.",
      requirements: [
        "Experience in B2B sales",
        "Knowledge of payment industry",
        "Strong relationship building skills",
        "Experience in African markets"
      ],
      benefits: [
        "Competitive salary and commission",
        "Health insurance",
        "Travel opportunities",
        "Professional development budget"
      ]
    },
    {
      id: 4,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Nairobi, Kenya",
      type: "Full-time",
      experience: "2+ years",
      description: "Create compelling marketing campaigns to increase brand awareness and drive merchant acquisition.",
      requirements: [
        "Experience in digital marketing",
        "Strong content creation skills",
        "Knowledge of social media platforms",
        "Experience in fintech marketing"
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Creative freedom",
        "Professional development budget"
      ]
    },
    {
      id: 5,
      title: "Operations Analyst",
      department: "Operations",
      location: "Cape Town, South Africa",
      type: "Full-time",
      experience: "3+ years",
      description: "Optimize operational processes and ensure smooth payment processing across all markets.",
      requirements: [
        "Strong analytical skills",
        "Experience in operations or fintech",
        "Knowledge of regulatory compliance",
        "Process improvement experience"
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Professional development",
        "International exposure"
      ]
    },
    {
      id: 6,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "2+ years",
      description: "Build beautiful, responsive user interfaces for our payment platform and merchant dashboard.",
      requirements: [
        "Strong React/TypeScript skills",
        "Experience with modern CSS frameworks",
        "Knowledge of web accessibility",
        "Experience with payment UIs"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance",
        "Remote work options",
        "Latest tools and equipment"
      ]
    }
  ];

  const culture = [
    {
      icon: Heart,
      title: "Mission-Driven",
      description: "We're passionate about empowering African businesses and making a positive impact."
    },
    {
      icon: Globe,
      title: "Global Team",
      description: "Work with talented individuals from across Africa and around the world."
    },
    {
      icon: Zap,
      title: "Fast-Paced",
      description: "Move quickly, iterate, and ship products that make a difference."
    },
    {
      icon: Shield,
      title: "Inclusive",
      description: "Diverse perspectives and backgrounds make us stronger as a team."
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Competitive Compensation",
      description: "Salary, equity, and performance bonuses"
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: Calendar,
      title: "Flexible Time Off",
      description: "Unlimited PTO and flexible working hours"
    },
    {
      icon: GraduationCap,
      title: "Learning & Growth",
      description: "Professional development budget and learning opportunities"
    },
    {
      icon: Coffee,
      title: "Team Events",
      description: "Regular team building and social events"
    },
    {
      icon: Wifi,
      title: "Remote Work",
      description: "Work from anywhere with our remote-first culture"
    }
  ];

  const filteredJobs = jobListings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Help us build the future of payments in Africa. We're looking for passionate individuals who want to make a difference.
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search jobs by title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-card/80 backdrop-blur-sm border-border/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by:</span>
            </div>
            {departments.slice(0, 4).map((dept) => (
              <Badge key={dept} variant="outline" className="cursor-pointer hover:bg-blue-primary hover:text-white">
                {dept}
              </Badge>
            ))}
          </div>
        </div>

        {/* Culture */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Culture</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {culture.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="bg-card/80 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-blue-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-blue-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Job Listings */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Open Positions ({filteredJobs.length})
            </h2>
            <div className="flex gap-2">
              <Badge variant="outline">All Departments</Badge>
              <Badge variant="outline">All Locations</Badge>
            </div>
          </div>

          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Requirements</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-primary mt-1">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Benefits</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {job.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{job.experience} experience</Badge>
                    <Button className="bg-blue-primary hover:bg-blue-primary/90">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Don't See the Right Role?</h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-primary hover:bg-blue-primary/90">
                Submit General Application
              </Button>
              <Button variant="outline">
                Contact Recruiting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Careers; 