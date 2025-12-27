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
  agent_id?: string | null;
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
                Agent ID
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
                  {new Date(log.created_at).toISOString().replace('T', ' ').replace('Z', ' GMT')}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-foreground whitespace-nowrap">
                  <Badge variant="outline" className="capitalize">
                    {log.source}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground whitespace-nowrap">
                  <span className="font-mono">{log.agent_id || "-"}</span>
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
                  {(() => {
                    console.log('Dashboard log object:', log); // Debug each log
                    let message = log.message;
                    
                    // If message is empty, try to extract from raw_json
                    if (!message && log.raw_json) {
                      try {
                        const rawData = typeof log.raw_json === 'string' ? JSON.parse(log.raw_json) : log.raw_json;
                        if (rawData.message) {
                          message = rawData.message;
                        } else if (rawData.correlation_type) {
                          message = rawData.correlation_type;
                        } else if (rawData.stage1 && rawData.stage2) {
                          const stage1 = rawData.stage1.wazuh_alert || 'Unknown event';
                          const stage2 = rawData.stage2.wazuh_alert || 'Unknown event';
                          message = `Correlated events: ${stage1} → ${stage2}`;
                        }
                      } catch (e) {
                        console.error('Error parsing raw_json:', e);
                      }
                    }
                    
                    console.log('Dashboard message found:', message);
                    return message || 'No description available';
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
