import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a payment, or contact our support team. This may include your name, email address, 
                  phone number, business information, and payment details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Transaction Information</h3>
                <p className="text-muted-foreground">
                  We collect information about your transactions, including payment amounts, currency, 
                  payment method, and transaction status to process payments and provide customer support.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Device and Usage Information</h3>
                <p className="text-muted-foreground">
                  We automatically collect information about your device and how you use our services, 
                  including IP address, browser type, operating system, and usage patterns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Processing Payments</h3>
                <p className="text-muted-foreground">
                  We use your information to process payments, verify your identity, and prevent fraud.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Customer Support</h3>
                <p className="text-muted-foreground">
                  We use your information to provide customer support, respond to inquiries, and resolve issues.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Service Improvement</h3>
                <p className="text-muted-foreground">
                  We use aggregated, anonymized data to improve our services, develop new features, and enhance security.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Legal Compliance</h3>
                <p className="text-muted-foreground">
                  We use your information to comply with applicable laws, regulations, and legal processes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-primary" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Payment Processors</h3>
                <p className="text-muted-foreground">
                  We share payment information with trusted payment processors to complete transactions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Legal Requirements</h3>
                <p className="text-muted-foreground">
                  We may share information when required by law or to protect our rights and safety.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Business Transfers</h3>
                <p className="text-muted-foreground">
                  In the event of a merger or acquisition, your information may be transferred to the new entity.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your information, including 
                encryption, secure servers, and regular security audits. We are PCI DSS compliant and 
                follow best practices for data protection.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Access and Update</h3>
                <p className="text-muted-foreground">
                  You can access and update your personal information through your account settings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Portability</h3>
                <p className="text-muted-foreground">
                  You can request a copy of your data in a portable format.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Deletion</h3>
                <p className="text-muted-foreground">
                  You can request deletion of your account and associated data, subject to legal requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-foreground">Email: privacy@nardopay.com</p>
                <p className="text-foreground">Address: Kigali, Rwanda</p>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 