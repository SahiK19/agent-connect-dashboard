import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Log {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: string;
  raw_json: any;
  created_at: string;
  correlated: boolean;
}

interface LogsTableProps {
  logs: Log[];
}

const severityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/20 text-warning border-warning/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
  critical: "bg-destructive text-destructive-foreground",
};

export function LogsTable({ logs }: LogsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Correlated
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Message
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
                  {log.id}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-foreground whitespace-nowrap">
                  <Badge variant="outline" className="capitalize">
                    {log.source}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", 
                      log.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
                      log.severity === 'high' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                      log.severity === 'medium' ? 'bg-warning/20 text-warning border-warning/30' :
                      'bg-muted text-muted-foreground'
                    )}
                  >
                    {log.severity}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant={log.correlated ? "default" : "secondary"}>
                    {log.correlated ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-md truncate">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
