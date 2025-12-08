import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Server, 
  Activity, 
  Cpu, 
  HardDrive,
  RefreshCw,
  Trash2,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const agents = [
  {
    id: "1",
    name: "prod-server-01",
    status: "connected",
    lastHeartbeat: "2 seconds ago",
    os: "Ubuntu 22.04 LTS",
    cpu: 23,
    memory: 45,
    version: "1.2.4",
  },
  {
    id: "2",
    name: "prod-server-02",
    status: "connected",
    lastHeartbeat: "5 seconds ago",
    os: "Ubuntu 22.04 LTS",
    cpu: 67,
    memory: 78,
    version: "1.2.4",
  },
  {
    id: "3",
    name: "web-server-01",
    status: "connected",
    lastHeartbeat: "1 second ago",
    os: "Debian 12",
    cpu: 12,
    memory: 34,
    version: "1.2.4",
  },
  {
    id: "4",
    name: "db-server-01",
    status: "disconnected",
    lastHeartbeat: "15 minutes ago",
    os: "CentOS 8",
    cpu: 0,
    memory: 0,
    version: "1.2.3",
  },
];

const statusConfig = {
  connected: {
    color: "bg-success",
    text: "Connected",
    textColor: "text-success",
  },
  disconnected: {
    color: "bg-destructive",
    text: "Disconnected",
    textColor: "text-destructive",
  },
};

export default function AgentStatus() {
  const connectedCount = agents.filter((a) => a.status === "connected").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agent Status</h1>
            <p className="text-muted-foreground">Monitor your connected agents and their health</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center glow-success">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{connectedCount}</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center glow-destructive">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {agents.length - connectedCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Disconnected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{agents.length}</p>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent List */}
        <div className="space-y-4">
          {agents.map((agent) => {
            const status = statusConfig[agent.status as keyof typeof statusConfig];
            return (
              <Card
                key={agent.id}
                className={cn(
                  "transition-all duration-300",
                  agent.status === "disconnected" && "opacity-70"
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Agent Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                          <Server className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
                            status.color
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {agent.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            v{agent.version}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{agent.os}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {agent.lastHeartbeat}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", status.textColor)}
                      >
                        {status.text}
                      </Badge>
                    </div>

                    {/* Metrics */}
                    {agent.status === "connected" && (
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-muted-foreground" />
                          <div className="w-24">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">CPU</span>
                              <span className="text-foreground font-medium">{agent.cpu}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  agent.cpu > 80 ? "bg-destructive" : agent.cpu > 60 ? "bg-warning" : "bg-primary"
                                )}
                                style={{ width: `${agent.cpu}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-muted-foreground" />
                          <div className="w-24">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Memory</span>
                              <span className="text-foreground font-medium">{agent.memory}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  agent.memory > 80 ? "bg-destructive" : agent.memory > 60 ? "bg-warning" : "bg-success"
                                )}
                                style={{ width: `${agent.memory}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
