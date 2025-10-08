import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export const KPICard = ({ title, value, change, changeType = "neutral", icon: Icon }: KPICardProps) => {
  const changeColorClass = {
    positive: "text-green-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  }[changeType];

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:translate-y-[-4px] transition-all duration-300 hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
          {change && (
            <p className={`text-xs ${changeColorClass}`}>
              {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
};
