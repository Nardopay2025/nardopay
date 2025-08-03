import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

export const RevenuePieChart = () => {
  // Sample data for revenue by link type
  const data = [
    { type: 'Payment Links', amount: 18500, color: '#3B82F6', bgColor: 'bg-blue-500' },
    { type: 'Donation Links', amount: 12300, color: '#10B981', bgColor: 'bg-green-500' },
    { type: 'Subscription Links', amount: 8900, color: '#8B5CF6', bgColor: 'bg-purple-500' },
    { type: 'Catalogues', amount: 5531, color: '#F59E0B', bgColor: 'bg-yellow-500' }
  ];

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const circumference = 2 * Math.PI * 40; // r=40

  // Calculate pie chart segments
  const createPieSegments = () => {
    let currentOffset = 0;
    
    return data.map((item, index) => {
      const percentage = (item.amount / total) * 100;
      const segmentLength = (percentage / 100) * circumference;
      const dashArray = `${segmentLength} ${circumference - segmentLength}`;
      
      const segment = (
        <circle
          key={index}
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={item.color}
          strokeWidth="20"
          strokeDasharray={dashArray}
          strokeDashoffset={currentOffset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-300"
        />
      );
      
      currentOffset -= segmentLength;
      return segment;
    });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Revenue by Link Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">${total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </div>
          
          {/* Pie Chart */}
          <div className="relative h-32 w-32 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {createPieSegments()}
            </svg>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">${(total / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = ((item.amount / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.bgColor}`} />
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                    <span className="text-sm font-medium">${item.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 