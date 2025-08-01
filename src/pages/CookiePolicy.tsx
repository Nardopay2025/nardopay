import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Shield, Info } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Cookie className="w-8 h-8 text-blue-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Cookie Policy
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
                <Info className="w-6 h-6 text-blue-primary" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                analyzing how you use our site, and personalizing content.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies are necessary for the website to function properly. They enable basic 
                  functions like page navigation, access to secure areas, and form submissions.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Authentication and security</li>
                  <li>Session management</li>
                  <li>Payment processing</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Page views and navigation patterns</li>
                  <li>Time spent on pages</li>
                  <li>Error tracking and performance monitoring</li>
                  <li>User journey analysis</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Functional Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences and settings.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Language preferences</li>
                  <li>Currency settings</li>
                  <li>Theme preferences</li>
                  <li>Form data retention</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies are used to track visitors across websites to display relevant and 
                  engaging advertisements.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Ad targeting and retargeting</li>
                  <li>Social media integration</li>
                  <li>Campaign effectiveness tracking</li>
                  <li>Cross-site tracking</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use third-party services that may set their own cookies, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
                <li><strong>Payment Processors:</strong> Secure payment processing and fraud detection</li>
                <li><strong>Customer Support:</strong> Live chat and support ticket management</li>
                <li><strong>Social Media:</strong> Social media integration and sharing features</li>
                <li><strong>Advertising:</strong> Targeted advertising and marketing campaigns</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-primary" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Browser Settings</h3>
                <p className="text-muted-foreground">
                  You can control cookies through your browser settings. Most browsers allow you to 
                  block or delete cookies, though this may affect website functionality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Cookie Consent</h3>
                <p className="text-muted-foreground">
                  When you first visit our website, you'll see a cookie consent banner where you can 
                  choose which types of cookies to accept.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Opt-Out Options</h3>
                <p className="text-muted-foreground">
                  You can opt out of certain third-party cookies through their respective opt-out 
                  mechanisms or by contacting us directly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Cookie Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Session Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies are deleted when you close your browser and are used for temporary 
                  session management.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Persistent Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies remain on your device for a set period (usually 30 days to 2 years) 
                  and are used to remember your preferences and settings.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-primary" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are committed to protecting your privacy. Cookie data is processed in accordance 
                with our Privacy Policy and applicable data protection laws. We do not sell or rent 
                cookie data to third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for legal reasons. We will notify you of significant changes through our website 
                or email communications.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies or this Cookie Policy, please contact us at:
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

export default CookiePolicy; 