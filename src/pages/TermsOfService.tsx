import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Terms of Service
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
                <CheckCircle className="w-6 h-6 text-blue-primary" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using Nardopay's services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nardopay provides payment processing services that allow businesses to accept payments 
                from customers worldwide. Our services include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Payment processing and settlement</li>
                <li>Multi-currency support</li>
                <li>Mobile money integration</li>
                <li>API and SDK access</li>
                <li>Customer support services</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Account Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old and have the legal capacity to enter into contracts 
                  to use our services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                <p className="text-muted-foreground">
                  You must provide accurate, complete, and up-to-date information when creating your account. 
                  You are responsible for maintaining the security of your account credentials.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Business Verification</h3>
                <p className="text-muted-foreground">
                  We may require additional verification documents for business accounts, including 
                  business registration, identification documents, and proof of address.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Fees and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Transaction Fees</h3>
                <p className="text-muted-foreground">
                  We charge a percentage fee on successful transactions. Fee rates vary by payment method 
                  and region. All fees are clearly displayed before processing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Currency Conversion</h3>
                <p className="text-muted-foreground">
                  Currency conversion fees may apply when processing payments in different currencies. 
                  Exchange rates are updated regularly and displayed during checkout.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Refunds</h3>
                <p className="text-muted-foreground">
                  Refund policies are determined by individual merchants. We process refunds according 
                  to the merchant's instructions and applicable regulations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-primary" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You agree not to use our services for any illegal or unauthorized purpose, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Money laundering or terrorist financing</li>
                <li>Fraudulent transactions or chargebacks</li>
                <li>Violation of applicable laws or regulations</li>
                <li>Infringement of intellectual property rights</li>
                <li>Distribution of harmful or malicious content</li>
                <li>Attempting to gain unauthorized access to our systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-blue-primary" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nardopay's liability is limited to the amount of fees paid in the 12 months preceding 
                the claim. We are not liable for indirect, incidental, or consequential damages.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Suspension</h3>
                <p className="text-muted-foreground">
                  We may suspend or terminate your account if you violate these terms or engage in 
                  suspicious or fraudulent activity.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain transaction data as required by law and for legitimate business purposes, 
                  even after account termination.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update these terms from time to time. We will notify you of significant changes 
                via email or through our platform. Continued use of our services constitutes acceptance 
                of updated terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-foreground">Email: legal@nardopay.com</p>
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

export default TermsOfService; 