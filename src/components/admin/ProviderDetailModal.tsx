import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, EyeOff, RefreshCw, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProviderDetailModalProps {
  provider: {
    name: string;
    status: string;
    successRate: number;
    volume24h: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

export const ProviderDetailModal = ({ provider, open, onClose }: ProviderDetailModalProps) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const { toast } = useToast();

  if (!provider) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-sm border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{provider.name}</DialogTitle>
            <Badge variant={provider.status === "connected" ? "default" : "destructive"}>
              {provider.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="webhook">Webhooks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                <p className="text-2xl font-bold">{provider.volume24h}</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-2xl font-bold">{provider.successRate}%</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Avg Settlement</p>
                <p className="text-2xl font-bold">2.5h</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label>API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value="pk_live_xxxxxxxxxxxxxxxxxxxx"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy("pk_live_xxxxxxxxxxxxxxxxxxxx")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Secret Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="password" value="sk_live_xxxxxxxxxxxxxxxxxxxx" readOnly />
                  <Button variant="outline" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Rotate Keys
              </Button>
              <p className="text-xs text-muted-foreground">Last rotated: Jan 1, 2025</p>
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label>Webhook URL</Label>
                <Input
                  className="mt-1"
                  placeholder="https://your-domain.com/webhooks/provider"
                  defaultValue="https://api.nardopay.com/webhooks/pesapal"
                />
              </div>
              <Button variant="outline" className="w-full">
                <TestTube className="w-4 h-4 mr-2" />
                Test Webhook
              </Button>
              <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm font-medium mb-2">Recent Deliveries</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jan 15, 14:23</span>
                    <Badge variant="default" className="text-xs">Success</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jan 15, 13:45</span>
                    <Badge variant="destructive" className="text-xs">Failed</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="font-medium">Sandbox Mode</p>
                  <p className="text-sm text-muted-foreground">Use test environment</p>
                </div>
                <Switch checked={sandboxMode} onCheckedChange={setSandboxMode} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="font-medium">Auto Retries</p>
                  <p className="text-sm text-muted-foreground">Retry failed transactions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="font-medium">3DS Enforcement</p>
                  <p className="text-sm text-muted-foreground">Require 3D Secure</p>
                </div>
                <Switch />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
