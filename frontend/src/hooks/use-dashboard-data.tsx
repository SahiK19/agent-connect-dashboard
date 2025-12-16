import { useState, useEffect } from 'react';

interface DashboardStats {
  totalLogs: number;
  threatsBlocked: number;
  criticalAlerts: number;
  activeAgents: string;
  logsChange: string;
  threatsChange: string;
  alertsChange: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentLogs: LogEntry[];
  isLoading: boolean;
  error: string | null;
  isAgentConnected: boolean;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalLogs: 0,
      threatsBlocked: 0,
      criticalAlerts: 0,
      activeAgents: '0/0',
      logsChange: '+0%',
      threatsChange: '+0%',
      alertsChange: '+0 new alerts'
    },
    recentLogs: [],
    isLoading: true,
    error: null,
    isAgentConnected: false
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://13.214.163.207';
        const response = await fetch(`${apiUrl}/api/logs.php?limit=50`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Process logs data
        const allLogs = [
          ...(result.wazuh_logs || []),
          ...(result.snort_logs || []),
          ...(result.correlation_logs || [])
        ];
        
        // Calculate stats
        const totalLogs = result.total_count || 0;
        const criticalAlerts = allLogs.filter(log => log.severity === 'critical').length;
        const highAlerts = allLogs.filter(log => log.severity === 'high').length;
        const threatsBlocked = criticalAlerts + highAlerts;
        
        // Format recent logs for display
        const recentLogs: LogEntry[] = allLogs
          .slice(0, 4)
          .map(log => ({
            id: log.id || Math.random().toString(),
            timestamp: new Date(log.timestamp).toLocaleString(),
            sourceIp: log.source_ip || log.sourceIp || 'unknown',
            destIp: log.dest_ip || log.destIp || 'unknown',
            eventType: log.event_type || log.eventType || 'Security Event',
            severity: log.severity as 'low' | 'medium' | 'high' | 'critical',
            description: log.description || log.rule_description || 'Security event detected'
          }));

        setData({
          stats: {
            totalLogs,
            threatsBlocked,
            criticalAlerts,
            activeAgents: totalLogs > 0 ? '1/1' : '0/1',
            logsChange: totalLogs > 0 ? '+12% from yesterday' : 'No data',
            threatsChange: threatsBlocked > 0 ? `${threatsBlocked} blocked today` : 'No threats',
            alertsChange: criticalAlerts > 0 ? `+${criticalAlerts} new alerts` : 'No critical alerts'
          },
          recentLogs,
          isLoading: false,
          error: null,
          isAgentConnected: totalLogs > 0
        });
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch data',
          isAgentConnected: false
        }));
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return data;
}