import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { HidsAnalytics } from "@/components/dashboard/HidsAnalytics";
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

const mockLogs = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:05",
    sourceIp: "localhost",
    eventType: "File Modification",
    severity: "high" as const,
    description: "Unauthorized modification detected in /etc/passwd",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:28:12",
    sourceIp: "localhost",
    eventType: "Process Anomaly",
    severity: "critical" as const,
    description: "Suspicious process spawned with elevated privileges",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:25:33",
    sourceIp: "localhost",
    eventType: "Login Attempt",
    severity: "medium" as const,
    description: "Multiple failed root login attempts via SSH",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:20:18",
    sourceIp: "localhost",
    eventType: "File Access",
    severity: "low" as const,
    description: "Sensitive configuration file accessed",
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:15:42",
    sourceIp: "localhost",
    eventType: "Rootkit Detection",
    severity: "critical" as const,
    description: "Potential rootkit signatures detected in system binaries",
  },
  {
    id: "6",
    timestamp: "2024-01-15 14:10:55",
    sourceIp: "localhost",
    eventType: "Registry Change",
    severity: "medium" as const,
    description: "Startup registry key modified by unknown process",
  },
  {
    id: "7",
    timestamp: "2024-01-15 14:05:30",
    sourceIp: "localhost",
    eventType: "File Integrity",
    severity: "high" as const,
    description: "Critical system file hash mismatch detected",
  },
  {
    id: "8",
    timestamp: "2024-01-15 14:00:12",
    sourceIp: "localhost",
    eventType: "User Activity",
    severity: "low" as const,
    description: "New user account created without proper authorization",
  },
];

export default function HidsLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.sourceIp.includes(searchQuery) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchesEventType = eventTypeFilter === "all" || log.eventType === eventTypeFilter;
    return matchesSearch && matchesSeverity && matchesEventType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">HIDS Logs</h1>
            <p className="text-muted-foreground">Host-based Intrusion Detection System logs</p>
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
        <HidsAnalytics />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by host or description..."
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
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="File Modification">File Modification</SelectItem>
                <SelectItem value="Process Anomaly">Process Anomaly</SelectItem>
                <SelectItem value="Login Attempt">Login Attempt</SelectItem>
                <SelectItem value="File Integrity">File Integrity</SelectItem>
                <SelectItem value="Rootkit Detection">Rootkit Detection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {mockLogs.length} logs
          </p>
        </div>

        {/* Logs Table */}
        <LogsTable logs={filteredLogs} type="hids" />

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
