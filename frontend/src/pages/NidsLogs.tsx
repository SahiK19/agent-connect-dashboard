import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { NidsAnalytics } from "@/components/dashboard/NidsAnalytics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download, RefreshCw } from "lucide-react";

export default function NidsLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://18.142.200.244:8080/api/dashboard-logs.php?source=snort&limit=100');
        const data = await response.json();
        setLogs(data.logs || []);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading Snort logs...</p>
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
            <h1 className="text-2xl font-bold text-foreground">NIDS Logs</h1>
            <p className="text-muted-foreground">Network Intrusion Detection System logs</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Analytics Section */}
        <NidsAnalytics />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by IP or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} Snort logs
          </p>
        </div>

        {/* Logs Table */}
        <LogsTable logs={filteredLogs} />

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="secondary" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
