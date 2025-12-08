import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "00:00", nids: 12, hids: 8, correlated: 4 },
  { time: "04:00", nids: 19, hids: 12, correlated: 7 },
  { time: "08:00", nids: 45, hids: 28, correlated: 18 },
  { time: "12:00", nids: 67, hids: 42, correlated: 25 },
  { time: "16:00", nids: 89, hids: 56, correlated: 32 },
  { time: "20:00", nids: 34, hids: 22, correlated: 12 },
  { time: "24:00", nids: 18, hids: 14, correlated: 6 },
];

export function ActivityChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Activity Overview</h3>
        <p className="text-sm text-muted-foreground">Log activity over the last 24 hours</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="nidsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187, 94%, 43%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(187, 94%, 43%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="hidsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="correlatedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280, 85%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(280, 85%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis
              dataKey="time"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
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
              dataKey="nids"
              stroke="hsl(187, 94%, 43%)"
              fill="url(#nidsGradient)"
              strokeWidth={2}
              name="NIDS"
            />
            <Area
              type="monotone"
              dataKey="hids"
              stroke="hsl(142, 76%, 36%)"
              fill="url(#hidsGradient)"
              strokeWidth={2}
              name="HIDS"
            />
            <Area
              type="monotone"
              dataKey="correlated"
              stroke="hsl(280, 85%, 55%)"
              fill="url(#correlatedGradient)"
              strokeWidth={2}
              name="Correlated"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">NIDS Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">HIDS Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(280, 85%, 55%)" }} />
          <span className="text-sm text-muted-foreground">Correlated</span>
        </div>
      </div>
    </div>
  );
}
