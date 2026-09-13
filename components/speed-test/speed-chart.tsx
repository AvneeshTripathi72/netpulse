"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface SpeedChartProps {
  data: { timestamp: number; download?: number; upload?: number }[];
}

export function SpeedChart({ data }: SpeedChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-36 w-full flex items-center justify-center border border-dashed border-border/40 rounded-xl bg-muted/20 text-xs text-muted-foreground font-mono">
        Speed graph will populate in real-time during test
      </div>
    );
  }

  return (
    <div className="h-36 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="timestamp"
            tickFormatter={(t) => `${t.toFixed(1)}s`}
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
          />
          <YAxis stroke="#64748b" fontSize={10} tickLine={false} />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f8fafc",
            }}
            formatter={(value: any) => [`${Number(value).toFixed(2)} Mbps`]}
            labelFormatter={(label) => `Time: ${Number(label).toFixed(1)}s`}
          />

          <Area
            type="monotone"
            dataKey="download"
            name="Download"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#downloadGradient)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="upload"
            name="Upload"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#uploadGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
