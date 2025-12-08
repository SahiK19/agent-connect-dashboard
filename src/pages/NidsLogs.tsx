import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LogsTable } from "@/components/dashboard/LogsTable";
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
  {
    id: "5",
    timestamp: "2024-01-15 14:15:42",
    sourceIp: "45.33.32.156",
    destIp: "10.0.0.30",
    eventType: "DDoS Attack",
    severity: "critical" as const,
    description: "High volume traffic spike from multiple sources",
  },
  {
    id: "6",
    timestamp: "2024-01-15 14:10:55",
    sourceIp: "192.168.2.88",
    destIp: "10.0.0.45",
    eventType: "Port Scan",
    severity: "medium" as const,
    description: "Sequential port scanning detected",
  },
  {
    id: "7",
    timestamp: "2024-01-15 14:05:30",
    sourceIp: "103.21.58.144",
    destIp: "10.0.0.60",
    eventType: "Malware",
    severity: "high" as const,
    description: "Known malware signature detected in traffic",
  },
  {
    id: "8",
    timestamp: "2024-01-15 14:00:12",
    sourceIp: "192.168.1.150",
    destIp: "10.0.0.15",
    eventType: "Data Exfiltration",
    severity: "critical" as const,
    description: "Large outbound data transfer to unknown destination",
  },
];

export default function NidsLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.sourceIp.includes(searchQuery) ||
      log.destIp?.includes(searchQuery) ||
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
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Port Scan">Port Scan</SelectItem>
                <SelectItem value="SQL Injection">SQL Injection</SelectItem>
                <SelectItem value="Brute Force">Brute Force</SelectItem>
                <SelectItem value="DDoS Attack">DDoS Attack</SelectItem>
                <SelectItem value="Malware">Malware</SelectItem>
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
        <LogsTable logs={filteredLogs} type="nids" />

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
