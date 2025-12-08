import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Log {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp?: string;
  eventType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

interface LogsTableProps {
  logs: Log[];
  type: "nids" | "hids";
}

const severityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/20 text-warning border-warning/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
  critical: "bg-destructive text-destructive-foreground",
};

export function LogsTable({ logs, type }: LogsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Source IP
              </th>
              {type === "nids" && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Dest IP
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Event Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-secondary/20 transition-colors duration-150"
              >
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-foreground whitespace-nowrap">
                  {log.sourceIp}
                </td>
                {type === "nids" && (
                  <td className="px-4 py-3 text-sm font-mono text-foreground whitespace-nowrap">
                    {log.destIp}
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {log.eventType}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", severityColors[log.severity])}
                  >
                    {log.severity}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                  {log.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
