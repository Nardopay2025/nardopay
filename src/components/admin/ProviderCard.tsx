import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProviderCardProps {
  name: string;
  status: "connected" | "disconnected";
  successRate: number;
  volume24h: string;
  onClick: () => void;
}

export const ProviderCard = ({ name, status, successRate, volume24h, onClick }: ProviderCardProps) => {
  const isConnected = status === "connected";
  const successTrend = successRate >= 95 ? "up" : "down";

  return (
    <Card 
      className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:translate-y-[-4px] transition-all duration-300 hover:shadow-glow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{name.charAt(0)}</span>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{name}</h4>
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="mt-1 text-xs"
            >
              {status}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold">{successRate}%</span>
            {successTrend === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
          <span className="text-lg font-bold">{volume24h}</span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Configure
      </Button>
    </Card>
  );
};
