// Dashboard
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ThreatDistribution } from "@/components/dashboard/ThreatDistribution";
import { LogsTable } from "@/components/dashboard/LogsTable";
import {
  Shield,
  AlertTriangle,
  Activity,
  Server,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const recentLogs = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:05",
    sourceIp: "192.168.1.105",
    destIp: "10.0.0.50",
    eventType: "Port Scan",
    severity: "medium" as const,
    description: "Multiple port connections detected from single source",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:28:12",
    sourceIp: "203.45.67.89",
    destIp: "10.0.0.25",
    eventType: "SQL Injection",
    severity: "critical" as const,
    description: "Attempted SQL injection in login form",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:25:33",
    sourceIp: "172.16.0.45",
    destIp: "10.0.0.100",
    eventType: "Brute Force",
    severity: "high" as const,
    description: "Multiple failed SSH login attempts",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:20:18",
    sourceIp: "192.168.1.22",
    destIp: "10.0.0.75",
    eventType: "Suspicious Traffic",
    severity: "low" as const,
    description: "Unusual outbound traffic pattern detected",
  },
];

export default function Dashboard() {
  const isAgentConnected = true; // This would come from your backend

  if (!isAgentConnected) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-warning/20 flex items-center justify-center mx-auto mb-6 glow-warning">
              <AlertTriangle className="w-10 h-10 text-warning" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Agent Not Connected
            </h2>
            <p className="text-muted-foreground mb-6">
              To view analytics and logs, you need to install and connect the
              SecureWatch agent to your infrastructure.
            </p>
            <Link to="/install-agent">
              <Button variant="hero" size="lg">
                Install Agent
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, John. Here's your security overview.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-success/30 bg-success/10">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">
              Agent Connected
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Logs Today"
            value="12,847"
            change="+12% from yesterday"
            changeType="positive"
            icon={Activity}
            iconColor="primary"
          />
          <StatsCard
            title="Threats Blocked"
            value="234"
            change="-5% from yesterday"
            changeType="positive"
            icon={Shield}
            iconColor="success"
          />
          <StatsCard
            title="Critical Alerts"
            value="8"
            change="+3 new alerts"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="destructive"
          />
          <StatsCard
            title="Active Agents"
            value="8/8"
            change="All agents online"
            changeType="positive"
            icon={Server}
            iconColor="success"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <ThreatDistribution />
        </div>

        {/* Recent Logs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
            <Link to="/nids-logs">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <LogsTable logs={recentLogs} type="nids" />
        </div>
      </div>
    </DashboardLayout>
  );
}
