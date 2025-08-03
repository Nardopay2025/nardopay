import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';

export const IncomeChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Mock data for different time periods
  const getChartData = (period: string) => {
    switch (period) {
      case '7':
        return {
          data: [
            { label: 'Mon', value: 1200 },
            { label: 'Tue', value: 1800 },
            { label: 'Wed', value: 1400 },
            { label: 'Thu', value: 2200 },
            { label: 'Fri', value: 1900 },
            { label: 'Sat', value: 2500 },
            { label: 'Sun', value: 2100 }
          ],
          total: 13100,
          growth: '+15.2%'
        };
      case '30':
        return {
          data: [
            { label: 'Jan', value: 4000 },
            { label: 'Feb', value: 3000 },
            { label: 'Mar', value: 2000 },
            { label: 'Apr', value: 2780 },
            { label: 'May', value: 1890 },
            { label: 'Jun', value: 2390 },
            { label: 'Jul', value: 3490 }
          ],
          total: 19550,
          growth: '+20.1%'
        };
      case '90':
        return {
          data: [
            { label: 'Q1', value: 9000 },
            { label: 'Q2', value: 12000 },
            { label: 'Q3', value: 15000 },
            { label: 'Q4', value: 18000 }
          ],
          total: 54000,
          growth: '+25.3%'
        };
      case '365':
        return {
          data: [
            { label: '2020', value: 35000 },
            { label: '2021', value: 42000 },
            { label: '2022', value: 48000 },
            { label: '2023', value: 55000 }
          ],
          total: 180000,
          growth: '+14.6%'
        };
      default:
        return {
          data: [
            { label: 'Jan', value: 4000 },
            { label: 'Feb', value: 3000 },
            { label: 'Mar', value: 2000 },
            { label: 'Apr', value: 2780 },
            { label: 'May', value: 1890 },
            { label: 'Jun', value: 2390 },
            { label: 'Jul', value: 3490 }
          ],
          total: 19550,
          growth: '+20.1%'
        };
    }
  };

  const chartData = getChartData(selectedPeriod);
  const maxValue = Math.max(...chartData.data.map(d => d.value));

  // Generate SVG points for the line chart
  const generatePoints = () => {
    const width = 280; // SVG width
    const height = 100; // SVG height
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    return chartData.data.map((point, index) => {
      const x = padding + (index / (chartData.data.length - 1)) * chartWidth;
      const y = padding + (1 - point.value / maxValue) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Income Overview
          </CardTitle>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">${chartData.total.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{chartData.growth}</span>
            </div>
          </div>
          {/* Line Chart */}
          <div className="relative h-48 w-full">
            <svg className="w-full h-full" viewBox="0 0 300 120">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Line chart data */}
              <polyline
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                points={generatePoints()}
                className="text-blue-500"
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
              
              {/* Data points */}
              {chartData.data.map((point, index) => {
                const width = 280;
                const height = 100;
                const padding = 20;
                const chartWidth = width - (padding * 2);
                const chartHeight = height - (padding * 2);
                const x = padding + (index / (chartData.data.length - 1)) * chartWidth;
                const y = padding + (1 - point.value / maxValue) * chartHeight;
                
                return (
                  <circle key={index} cx={x} cy={y} r="3" fill="#3B82F6"/>
                );
              })}
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {chartData.data.map((point, index) => (
                <span key={index}>{point.label}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 