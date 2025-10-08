import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const mockAlerts = [
  { id: 1, type: "error", message: "Pesapal webhook delivery failed", time: "2 min ago" },
  { id: 2, type: "warning", message: "High chargeback rate detected for Acme Corp", time: "15 min ago" },
  { id: 3, type: "info", message: "New merchant onboarding pending review", time: "1 hour ago" },
  { id: 4, type: "success", message: "All providers healthy", time: "2 hours ago" },
];

export const AlertsPanel = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-success" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getAlertBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      error: "destructive",
      warning: "secondary",
      info: "default",
      success: "default",
    };
    return variants[type] || "default";
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
          >
            {getAlertIcon(alert.type)}
            <div className="flex-1">
              <p className="text-sm text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
            <Badge variant={getAlertBadge(alert.type)} className="text-xs">
              {alert.type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
