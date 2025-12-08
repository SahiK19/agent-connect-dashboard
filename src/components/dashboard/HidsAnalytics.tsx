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
import { Server, AlertTriangle, FileWarning, Activity } from "lucide-react";

const activityData = [
  { time: "00:00", events: 8 },
  { time: "04:00", events: 12 },
  { time: "08:00", events: 28 },
  { time: "12:00", events: 42 },
  { time: "16:00", events: 56 },
  { time: "20:00", events: 22 },
  { time: "24:00", events: 14 },
];

const eventTypeData = [
  { name: "File Modification", value: 30, color: "hsl(142, 76%, 36%)" },
  { name: "Process Anomaly", value: 25, color: "hsl(0, 84%, 60%)" },
  { name: "Login Attempt", value: 20, color: "hsl(45, 93%, 47%)" },
  { name: "File Integrity", value: 15, color: "hsl(280, 85%, 55%)" },
  { name: "Rootkit", value: 10, color: "hsl(187, 94%, 43%)" },
];

const affectedHostsData = [
  { host: "web-server-01", count: 38 },
  { host: "db-server-01", count: 25 },
  { host: "app-server-02", count: 22 },
  { host: "file-server", count: 18 },
  { host: "mail-server", count: 12 },
];

export function HidsAnalytics() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Events"
          value="856"
          change="+8.3%"
          changeType="positive"
          icon={Server}
        />
        <StatsCard
          title="Critical Alerts"
          value="12"
          change="-2.1%"
          changeType="positive"
          icon={AlertTriangle}
          iconColor="destructive"
        />
        <StatsCard
          title="File Changes"
          value="234"
          change="+15.7%"
          changeType="negative"
          icon={FileWarning}
          iconColor="warning"
        />
        <StatsCard
          title="Active Hosts"
          value="18"
          change="+2"
          changeType="positive"
          icon={Activity}
          iconColor="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Host Activity</h3>
            <p className="text-sm text-muted-foreground">Events over the last 24 hours</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="hidsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
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
                  stroke="hsl(142, 76%, 36%)"
                  fill="url(#hidsAreaGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Types Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Event Types</h3>
            <p className="text-sm text-muted-foreground">Distribution by category</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
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
            {eventTypeData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Affected Hosts */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Most Affected Hosts</h3>
          <p className="text-sm text-muted-foreground">Hosts with most security events</p>
        </div>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={affectedHostsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" horizontal={false} />
              <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="host" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 8%)",
                  border: "1px solid hsl(222, 47%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 98%)",
                }}
              />
              <Bar dataKey="count" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
