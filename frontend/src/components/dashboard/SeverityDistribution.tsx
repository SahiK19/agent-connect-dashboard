import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SeverityData {
  label: string;
  count: number;
  percentage: number;
}

const SeverityDistribution = () => {
  const [data, setData] = useState<SeverityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://18.142.200.244:5000/api/severity-distribution";

  const colorMap = {
    Critical: '#ef4444', // red-500
    High: '#f97316',     // orange-500
    Medium: '#eab308',   // yellow-500
    Low: '#22c55e'       // green-500
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartConfig = {
    Critical: { label: "Critical", color: colorMap.Critical },
    High: { label: "High", color: colorMap.High },
    Medium: { label: "Medium", color: colorMap.Medium },
    Low: { label: "Low", color: colorMap.Low }
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {entry.value} ({data.find(d => d.label === entry.value)?.percentage.toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Severity Distribution
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Security alerts by severity level
        </p>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Severity Distribution
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Security alerts by severity level
        </p>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Severity Distribution
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Security alerts by severity level
        </p>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Severity Distribution
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Security alerts by severity level
      </p>
      
      <ChartContainer config={chartConfig} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colorMap[entry.label as keyof typeof colorMap]} 
                />
              ))}
            </Pie>
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {data.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Count: {data.count}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Percentage: {data.percentage.toFixed(1)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default SeverityDistribution;