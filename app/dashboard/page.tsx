"use client";

import { useEffect, useState } from "react";
import { SpeedTestResult } from "@/types/speed-test";
import { getSpeedTestHistory } from "@/lib/supabase/queries";
import { formatSpeed, formatPing, formatDate } from "@/lib/utils";
import { BarChart2, TrendingUp, Zap, Clock, ShieldCheck } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Link from "next/link";

export default function DashboardPage() {
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const items = await getSpeedTestHistory();
      setHistory(items);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-muted-foreground animate-pulse">
        Calculating network metrics & generating trend graphs...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit mx-auto">
          <BarChart2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">No Analytics Available</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Your network statistics will appear here after you save your first speed test.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
        >
          Run Speed Test
        </Link>
      </div>
    );
  }

  // Calculate Summary Statistics
  const totalTests = history.length;
  const avgDownload = history.reduce((acc, h) => acc + h.download_mbps, 0) / totalTests;
  const avgUpload = history.reduce((acc, h) => acc + h.upload_mbps, 0) / totalTests;
  const avgPing = history.reduce((acc, h) => acc + h.ping_ms, 0) / totalTests;

  const bestDownload = Math.max(...history.map((h) => h.download_mbps));
  const bestUpload = Math.max(...history.map((h) => h.upload_mbps));

  // Reverse chronological for time series chart (oldest to newest)
  const chartData = [...history]
    .reverse()
    .map((h) => ({
      date: formatDate(h.created_at).split(",")[0],
      download: Number(h.download_mbps.toFixed(2)),
      upload: Number(h.upload_mbps.toFixed(2)),
      ping: Number(h.ping_ms.toFixed(1)),
      score: h.score,
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-border/60 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <BarChart2 className="h-4 w-4" />
          Analytics Hub
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Performance Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">Aggregated statistics and historical network speed trends.</p>
      </div>

      {/* Top 5 Key Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">Avg Download</div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">{formatSpeed(avgDownload).value}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{formatSpeed(avgDownload).unit}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">Avg Upload</div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">{formatSpeed(avgUpload).value}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{formatSpeed(avgUpload).unit}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">Avg Ping</div>
          <div className="text-2xl font-black font-mono text-indigo-400 mt-1">{formatPing(avgPing)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">ms latency</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">Peak Download</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{formatSpeed(bestDownload).value}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{formatSpeed(bestDownload).unit}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60 col-span-2 lg:col-span-1">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">Tests Saved</div>
          <div className="text-2xl font-black font-mono text-foreground mt-1">{totalTests}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Total logs</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed Trend Area Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Bandwidth Speed History
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">Download vs Upload (Mbps)</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashDl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dashUl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="download" name="Download" stroke="#06b6d4" strokeWidth={2} fill="url(#dashDl)" />
                <Area type="monotone" dataKey="upload" name="Upload" stroke="#3b82f6" strokeWidth={2} fill="url(#dashUl)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency History Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              Latency & Ping Stability
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">Ping (ms)</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashPing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="ping" name="Ping (ms)" stroke="#818cf8" strokeWidth={2} fill="url(#dashPing)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
