import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  Zap,
  Database,
  Globe,
  Server,
  Key,
  Fingerprint,
  ShieldCheck,
  Award,
  Users,
  Clock
} from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using AES-256 encryption",
      details: "Military-grade encryption ensures your sensitive data is protected at all times"
    },
    {
      icon: Shield,
      title: "PCI DSS Compliance",
      description: "Level 1 PCI DSS certified for handling payment card data",
      details: "Highest level of security certification for payment processors"
    },
    {
      icon: Eye,
      title: "Fraud Detection",
      description: "Advanced AI-powered fraud detection and prevention systems",
      details: "Real-time monitoring and blocking of suspicious transactions"
    },
    {
      icon: Key,
      title: "Multi-Factor Authentication",
      description: "Secure access with MFA and biometric authentication options",
      details: "Multiple layers of authentication to protect your account"
    },
    {
      icon: Database,
      title: "Secure Data Centers",
      description: "ISO 27001 certified data centers with 24/7 monitoring",
      details: "Enterprise-grade infrastructure with redundant systems"
    },
    {
      icon: Globe,
      title: "Global Security Standards",
      description: "Compliant with international security and privacy regulations",
      details: "GDPR, CCPA, and local data protection laws compliance"
    }
  ];

  const certifications = [
    {
      name: "PCI DSS Level 1",
      status: "Certified",
      validUntil: "2025-12-31",
      description: "Payment Card Industry Data Security Standard",
      icon: ShieldCheck
    },
    {
      name: "ISO 27001",
      status: "Certified",
      validUntil: "2025-06-30",
      description: "Information Security Management System",
      icon: Award
    },
    {
      name: "SOC 2 Type II",
      status: "Certified",
      validUntil: "2025-03-31",
      description: "Service Organization Control 2",
      icon: CheckCircle
    },
    {
      name: "GDPR Compliance",
      status: "Compliant",
      validUntil: "Ongoing",
      description: "General Data Protection Regulation",
      icon: Users
    }
  ];

  const securityReports = [
    {
      title: "Security Whitepaper",
      description: "Comprehensive overview of our security architecture and practices",
      type: "PDF",
      size: "2.3 MB",
      updated: "2024-01-15"
    },
    {
      title: "PCI DSS Attestation",
      description: "Official PCI DSS compliance documentation and audit reports",
      type: "PDF",
      size: "1.8 MB",
      updated: "2024-01-10"
    },
    {
      title: "Penetration Test Report",
      description: "Latest third-party security assessment and vulnerability testing",
      type: "PDF",
      size: "3.1 MB",
      updated: "2024-01-05"
    },
    {
      title: "Privacy Impact Assessment",
      description: "Detailed analysis of data processing and privacy measures",
      type: "PDF",
      size: "1.5 MB",
      updated: "2024-01-01"
    }
  ];

  const securityMetrics = [
    {
      metric: "99.99%",
      label: "Uptime",
      description: "System availability"
    },
    {
      metric: "0",
      label: "Security Breaches",
      description: "Since launch"
    },
    {
      metric: "256-bit",
      label: "Encryption",
      description: "AES encryption"
    },
    {
      metric: "24/7",
      label: "Monitoring",
      description: "Security monitoring"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Security
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your security is our top priority. We implement industry-leading security measures to protect your data and ensure safe, reliable payment processing.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-primary hover:bg-blue-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download Security Report
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Certifications
            </Button>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityMetrics.map((metric) => (
              <Card key={metric.label} className="bg-card/80 backdrop-blur-sm border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-foreground mb-2">{metric.metric}</div>
                  <div className="text-sm font-medium text-foreground mb-1">{metric.label}</div>
                  <div className="text-xs text-muted-foreground">{metric.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Security Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-blue-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{feature.description}</p>
                        <p className="text-xs text-muted-foreground">{feature.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Security Certifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <Card key={cert.name} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-green-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{cert.name}</h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            {cert.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{cert.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Valid until: {cert.validUntil}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Security Reports */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Security Reports & Documentation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {securityReports.map((report) => (
              <Card key={report.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{report.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{report.type}</span>
                        <span>{report.size}</span>
                        <span>Updated: {report.updated}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Architecture */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Security Architecture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Server className="w-6 h-6 text-blue-primary" />
                  Infrastructure Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Data Centers</h4>
                  <p className="text-muted-foreground text-sm">
                    Enterprise-grade data centers with redundant systems, backup power, and 24/7 physical security.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Network Security</h4>
                  <p className="text-muted-foreground text-sm">
                    DDoS protection, firewalls, and intrusion detection systems to prevent unauthorized access.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Monitoring</h4>
                  <p className="text-muted-foreground text-sm">
                    Real-time monitoring and alerting for security events and system performance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Fingerprint className="w-6 h-6 text-blue-primary" />
                  Application Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Code Security</h4>
                  <p className="text-muted-foreground text-sm">
                    Regular security audits, static analysis, and penetration testing of our codebase.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">API Security</h4>
                  <p className="text-muted-foreground text-sm">
                    Rate limiting, authentication, and authorization controls for all API endpoints.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Data Protection</h4>
                  <p className="text-muted-foreground text-sm">
                    Encryption at rest and in transit, secure key management, and data anonymization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Security Team */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Security Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our security team is available to answer your questions and provide additional documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-primary hover:bg-blue-primary/90">
                Contact Security Team
              </Button>
              <Button variant="outline">
                Request Security Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security; 