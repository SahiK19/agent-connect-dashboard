import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { StatsCard } from "./StatsCard";
import { Network, AlertTriangle, Shield, TrendingUp } from "lucide-react";

const activityData = [
  { time: "00:00", events: 12 },
  { time: "04:00", events: 19 },
  { time: "08:00", events: 45 },
  { time: "12:00", events: 67 },
  { time: "16:00", events: 89 },
  { time: "20:00", events: 34 },
  { time: "24:00", events: 18 },
];

const attackTypeData = [
  { name: "Port Scan", value: 35, color: "hsl(187, 94%, 43%)" },
  { name: "SQL Injection", value: 25, color: "hsl(0, 84%, 60%)" },
  { name: "Brute Force", value: 20, color: "hsl(45, 93%, 47%)" },
  { name: "DDoS", value: 12, color: "hsl(280, 85%, 55%)" },
  { name: "Malware", value: 8, color: "hsl(142, 76%, 36%)" },
];

const sourceIpData = [
  { ip: "192.168.1.x", count: 45 },
  { ip: "203.45.67.x", count: 32 },
  { ip: "172.16.0.x", count: 28 },
  { ip: "45.33.32.x", count: 22 },
  { ip: "103.21.58.x", count: 15 },
];

export function NidsAnalytics() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Events"
          value="1,284"
          change="+12.5%"
          changeType="positive"
          icon={Network}
        />
        <StatsCard
          title="Critical Alerts"
          value="23"
          change="+5.2%"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="destructive"
        />
        <StatsCard
          title="Blocked Attacks"
          value="156"
          change="+18.3%"
          changeType="positive"
          icon={Shield}
          iconColor="success"
        />
        <StatsCard
          title="Avg Response"
          value="1.2s"
          change="-8.1%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Network Activity</h3>
            <p className="text-sm text-muted-foreground">Events over the last 24 hours</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="nidsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(187, 94%, 43%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(187, 94%, 43%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
                <XAxis dataKey="time" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 8%)",
                    border: "1px solid hsl(222, 47%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 98%)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="hsl(187, 94%, 43%)"
                  fill="url(#nidsAreaGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Types Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Attack Types</h3>
            <p className="text-sm text-muted-foreground">Distribution by category</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {attackTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 8%)",
                    border: "1px solid hsl(222, 47%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 98%)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {attackTypeData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Source IPs */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Top Source IPs</h3>
          <p className="text-sm text-muted-foreground">Most active suspicious sources</p>
        </div>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceIpData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" horizontal={false} />
              <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="ip" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 8%)",
                  border: "1px solid hsl(222, 47%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 98%)",
                }}
              />
              <Bar dataKey="count" fill="hsl(187, 94%, 43%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
