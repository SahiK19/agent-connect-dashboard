import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import SeverityDistribution from "@/components/dashboard/SeverityDistribution";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import {
  Shield,
  AlertTriangle,
  Activity,
  Server,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { stats, recentLogs, isLoading, error, isAgentConnected } = useDashboardData();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Connection Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <h1 className="text-2xl font-bold text-foreground">Correlated Dashboard</h1>
            <p className="text-muted-foreground">
              Multi-stage attack detection and correlation analysis.
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
            title="Correlated Events"
            value={stats.totalLogs.toLocaleString()}
            change={stats.logsChange}
            changeType="positive"
            icon={Activity}
            iconColor="primary"
          />
          <StatsCard
            title="Multi-Stage Attacks"
            value={stats.threatsBlocked.toString()}
            change={stats.threatsChange}
            changeType="positive"
            icon={Shield}
            iconColor="success"
          />
          <StatsCard
            title="Critical Alerts"
            value={stats.criticalAlerts.toString()}
            change={stats.alertsChange}
            changeType={stats.criticalAlerts > 0 ? "negative" : "positive"}
            icon={AlertTriangle}
            iconColor="destructive"
          />
          <StatsCard
            title="Active Agents"
            value={stats.activeAgents}
            change={isAgentConnected ? "Agent online" : "Agent offline"}
            changeType={isAgentConnected ? "positive" : "negative"}
            icon={Server}
            iconColor={isAgentConnected ? "success" : "destructive"}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <SeverityDistribution displayedRows={recentLogs} />
        </div>

        {/* Recent Logs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Correlated Events
            </h2>
            <Link to="/correlated-logs">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <LogsTable logs={recentLogs} />
        </div>
      </div>
    </DashboardLayout>
  );
}
