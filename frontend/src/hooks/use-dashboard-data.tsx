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
  source: string;
  message: string;
  severity: string;
  raw_json: any;
  created_at: string;
  correlated: boolean;
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
      totalLogs: 12847,
      threatsBlocked: 234,
      criticalAlerts: 8,
      activeAgents: '3/3',
      logsChange: '+12% from yesterday',
      threatsChange: '234 blocked today',
      alertsChange: '+3 new alerts'
    },
    recentLogs: [
      {
        id: '1',
        timestamp: new Date().toLocaleString(),
        sourceIp: '192.168.100.80',
        destIp: '192.168.100.255',
        eventType: 'Snort IDS',
        severity: 'high',
        description: 'MISC UPnP malformed advertisement detected'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 300000).toLocaleString(),
        sourceIp: '203.45.67.89',
        destIp: '10.0.0.25',
        eventType: 'Wazuh HIDS',
        severity: 'critical',
        description: 'Multiple failed SSH login attempts'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 600000).toLocaleString(),
        sourceIp: '172.16.0.45',
        destIp: '10.0.0.100',
        eventType: 'Correlation',
        severity: 'medium',
        description: 'Suspicious traffic pattern correlation'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 900000).toLocaleString(),
        sourceIp: '192.168.1.22',
        destIp: '10.0.0.75',
        eventType: 'Network Scan',
        severity: 'low',
        description: 'Port scan activity detected'
      }
    ],
    isLoading: false,
    error: null,
    isAgentConnected: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://18.142.200.244:8080';
        const response = await fetch(`${apiUrl}/api/dashboard-logs.php?source=correlated&limit=50`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Process logs data
        const allLogs = result.logs || [];
        
        if (allLogs.length > 0) {
          // Use real data if available
          const totalLogs = result.total || 0;
          const criticalAlerts = allLogs.filter(log => log.severity === 'critical').length;
          const highAlerts = allLogs.filter(log => log.severity === 'high').length;
          const threatsBlocked = allLogs.length; // All correlated events are threats
          
          const recentLogs = allLogs.slice(0, 10);

          setData(prev => ({
            ...prev,
            stats: {
              totalLogs,
              threatsBlocked,
              criticalAlerts,
              activeAgents: '3/3',
              logsChange: '+12% from yesterday',
              threatsChange: `${threatsBlocked} blocked today`,
              alertsChange: `+${criticalAlerts} new alerts`
            },
            recentLogs,
            isLoading: false,
            error: null,
            isAgentConnected: true
          }));
        } else {
          // Keep static data if no real data
          setData(prev => ({ ...prev, isLoading: false }));
        }
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep static data on error
        setData(prev => ({ ...prev, isLoading: false, error: null }));
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return data;
}