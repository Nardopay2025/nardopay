import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, Bell, Mail, DollarSign, Database, CreditCard } from "lucide-react";
import PaymentProvidersSettings from "@/components/admin/PaymentProvidersSettings";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSettings() {
  const [businessName, setBusinessName] = useState<string>("Your Business");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>("#111827");
  const [secondaryColor, setSecondaryColor] = useState<string>("#1f2937");

  useEffect(() => {
    const loadBranding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("business_name, logo_url, primary_color, secondary_color")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setBusinessName(data.business_name || "Your Business");
        setLogoUrl(data.logo_url);
        if (data.primary_color) setPrimaryColor(data.primary_color);
        if (data.secondary_color) setSecondaryColor(data.secondary_color);
      }
    };
    loadBranding();
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="providers" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Mail className="h-4 w-4" />
            Branding
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Platform Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Nardopay" />
              </div>
              <div>
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@nardopay.com" />
              </div>
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Nardopay Inc." />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Feature Flags</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New User Signups</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to register</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Put platform in maintenance mode</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Require email verification for new users</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Checkout Branding</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input id="logo-url" value={logoUrl ?? ""} onChange={(e) => setLogoUrl(e.target.value || null)} placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <Input id="secondary-color" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">This preview updates live. Save to persist your branding.</p>
              </div>

              {/* Live Preview - mirrors checkout layout */}
              <div className="rounded-xl overflow-hidden border border-border">
                <div
                  className="min-h-[420px] w-full flex"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                >
                  {/* Left branding panel */}
                  <div
                    className="hidden lg:flex w-1/5 xl:w-1/4 items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    <div className="p-4 text-center">
                      {logoUrl ? (
                        <img src={logoUrl} alt={businessName} className="mx-auto h-10 object-contain mb-2" />
                      ) : (
                        <div className="text-lg font-semibold mb-1">{businessName}</div>
                      )}
                      <div className="text-white/80 text-xs">Payment #AB12CD34</div>
                      <div className="text-xl font-bold mt-1">KES 1,250.00</div>
                    </div>
                  </div>

                  {/* Center content */}
                  <div className="flex-1 min-w-0 bg-background flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-sm p-4">
                        <div className="text-sm text-muted-foreground mb-2">Secure Payment</div>
                        <div className="h-40 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          Checkout iframe preview
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="h-9 rounded bg-muted" />
                          <div className="h-9 rounded bg-muted" />
                          <div className="h-9 rounded bg-muted col-span-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right branding panel */}
                  <div
                    className="hidden lg:flex w-1/5 xl:w-1/4 items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }}
                  >
                    <div className="p-4 text-center">
                      <div className="text-[10px] uppercase tracking-wide text-white/80 mb-1">Secured by</div>
                      <div className="text-sm font-semibold">NardoPay</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Password Complexity</Label>
                  <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div>
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" className="mt-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">API Security</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                <Input id="rate-limit" type="number" defaultValue="60" className="mt-2" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>API Key Rotation</Label>
                  <p className="text-sm text-muted-foreground">Automatically rotate API keys monthly</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send alerts for high-value transactions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Failed Payment Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify admins of failed payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Reports</Label>
                  <p className="text-sm text-muted-foreground">Send daily summary reports</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payments Settings */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Transaction Fees</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                <Input id="platform-fee" type="number" step="0.01" defaultValue="2.5" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="min-transaction">Minimum Transaction Amount</Label>
                <Input id="min-transaction" type="number" defaultValue="10" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="max-transaction">Maximum Transaction Amount</Label>
                <Input id="max-transaction" type="number" defaultValue="1000000" className="mt-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Settlement</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="settlement-delay">Settlement Delay (days)</Label>
                <Input id="settlement-delay" type="number" defaultValue="2" className="mt-2" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Settlement</Label>
                  <p className="text-sm text-muted-foreground">Automatically process settlements</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Providers Settings */}
        <TabsContent value="providers" className="space-y-4">
          <PaymentProvidersSettings />
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Backup Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Daily automated database backups</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div>
                <Label htmlFor="retention">Backup Retention (days)</Label>
                <Input id="retention" type="number" defaultValue="30" className="mt-2" />
              </div>
              <Separator />
              <div className="pt-2">
                <Button variant="outline">Run Backup Now</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
