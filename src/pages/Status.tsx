import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  RefreshCw,
  Wifi,
  Server,
  Database,
  Shield,
  Globe,
  Zap,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useState } from "react";

const Status = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateStatus = () => {
    setLastUpdated(new Date());
  };

  const overallStatus = {
    status: "operational",
    uptime: "99.98%",
    lastIncident: "2024-01-15",
    responseTime: "45ms"
  };

  const services = [
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.99%",
      responseTime: "25ms",
      description: "Core API endpoints and authentication",
      icon: Wifi
    },
    {
      name: "Payment Processing",
      status: "operational",
      uptime: "99.97%",
      responseTime: "120ms",
      description: "Payment processing and transaction handling",
      icon: Zap
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      responseTime: "15ms",
      description: "Primary database and data storage",
      icon: Database
    },
    {
      name: "Webhooks",
      status: "operational",
      uptime: "99.95%",
      responseTime: "200ms",
      description: "Real-time event notifications",
      icon: Server
    },
    {
      name: "Security Services",
      status: "operational",
      uptime: "99.99%",
      responseTime: "30ms",
      description: "Fraud detection and security monitoring",
      icon: Shield
    },
    {
      name: "International Payments",
      status: "operational",
      uptime: "99.96%",
      responseTime: "180ms",
      description: "Cross-border payment processing",
      icon: Globe
    }
  ];

  const recentIncidents = [
    {
      date: "2024-01-15",
      time: "14:30 GMT",
      title: "Scheduled Maintenance - API Gateway",
      status: "resolved",
      description: "Routine maintenance completed successfully. No service interruption.",
      duration: "15 minutes"
    },
    {
      date: "2024-01-10",
      time: "09:15 GMT",
      title: "Database Performance Optimization",
      status: "resolved",
      description: "Database optimization completed. Improved response times by 20%.",
      duration: "45 minutes"
    },
    {
      date: "2024-01-05",
      time: "16:20 GMT",
      title: "Payment Processing Update",
      status: "resolved",
      description: "Updated payment processing algorithms. Enhanced security features deployed.",
      duration: "30 minutes"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "outage":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return CheckCircle;
      case "degraded":
        return AlertTriangle;
      case "outage":
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded Performance";
      case "outage":
        return "Major Outage";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-blue-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              System Status
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Real-time status of Nardopay services and infrastructure
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button onClick={updateStatus} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Overall Status */}
        <div className="mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(overallStatus.status)}`}></div>
                Overall System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">{overallStatus.uptime}</div>
                  <div className="text-muted-foreground">Uptime (30 days)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">{overallStatus.responseTime}</div>
                  <div className="text-muted-foreground">Average Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">0</div>
                  <div className="text-muted-foreground">Active Incidents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-muted-foreground">Monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Status */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Service Status</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              const StatusIcon = getStatusIcon(service.status);
              return (
                <Card key={service.name} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-blue-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      <StatusIcon className={`w-5 h-5 ${service.status === 'operational' ? 'text-green-500' : service.status === 'degraded' ? 'text-yellow-500' : 'text-red-500'}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge 
                          variant={service.status === 'operational' ? 'default' : 'secondary'}
                          className={service.status === 'operational' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {getStatusText(service.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Uptime</span>
                        <span className="text-sm font-medium text-foreground">{service.uptime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Response Time</span>
                        <span className="text-sm font-medium text-foreground">{service.responseTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Recent Incidents</h2>
          <div className="space-y-6">
            {recentIncidents.map((incident, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <h3 className="font-semibold text-foreground">{incident.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {incident.date} at {incident.time} • Duration: {incident.duration}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {incident.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{incident.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Performance Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-blue-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">99.98%</div>
                <div className="text-sm text-muted-foreground">Monthly Uptime</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-blue-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">45ms</div>
                <div className="text-sm text-muted-foreground">Average Response</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-blue-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Security Score</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">30</div>
                <div className="text-sm text-muted-foreground">Days Since Last Issue</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subscribe to Updates */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Get notified about system status updates, maintenance windows, and incidents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-primary hover:bg-blue-primary/90">
                Subscribe to Updates
              </Button>
              <Button variant="outline">
                View Status Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Status; 