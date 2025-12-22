import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ActivityData {
  hour: number;
  nids: number;
  hids: number;
  correlated: number;
}

interface ApiResponse {
  snort: Array<{ hour: number; count: number }>;
  wazuh: Array<{ hour: number; count: number }>;
  correlated: Array<{ hour: number; count: number }>;
}

const ActivityOverviewChart = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://18.142.200.244:5000/api/activity-overview');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData: ApiResponse = await response.json();
      
      // Normalize data into 24-hour buckets
      const normalizedData: ActivityData[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const snortEntry = apiData.snort.find(item => item.hour === hour);
        const wazuhEntry = apiData.wazuh.find(item => item.hour === hour);
        const correlatedEntry = apiData.correlated.find(item => item.hour === hour);
        
        normalizedData.push({
          hour,
          nids: snortEntry?.count || 0,
          hids: wazuhEntry?.count || 0,
          correlated: correlatedEntry?.count || 0
        });
      }
      
      setData(normalizedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">24-Hour Activity Overview</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">24-Hour Activity Overview</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">24-Hour Activity Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="hour" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => `${value}:00`}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F9FAFB'
            }}
            labelFormatter={(value) => `Hour: ${value}:00`}
          />
          <Legend 
            wrapperStyle={{ color: '#F9FAFB' }}
          />
          <Line 
            type="monotone" 
            dataKey="nids" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="NIDS Events"
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="hids" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="HIDS Events"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="correlated" 
            stroke="#F59E0B" 
            strokeWidth={2}
            name="Correlated Events"
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityOverviewChart;