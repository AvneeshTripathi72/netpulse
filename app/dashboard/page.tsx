"use client";

import { useEffect, useState } from "react";
import { SpeedTestResult } from "@/types/speed-test";
import { getSpeedTestHistory } from "@/lib/supabase/queries";
import { formatSpeed, formatPing, formatDate } from "@/lib/utils";
import { BarChart2, TrendingUp, Clock } from "lucide-react";
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
      <div className="py-20 text-center text-xs font-mono text-slate-500 animate-pulse">
        Aggregating measurement statistics...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <div className="p-3 rounded-sm bg-slate-100 text-[#0f2942] w-fit mx-auto border border-slate-300">
          <BarChart2 className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-[#0f2942]">No Dashboard Data Available</h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Your aggregated network performance statistics will appear here after you complete and log a speed test.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#0f2942] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider"
        >
          START SPEED TEST
        </Link>
      </div>
    );
  }

  // Calculate Summary Statistics
  const totalTests = history.length;
  const avgDownload = history.reduce((acc, h) => acc + h.download_mbps, 0) / totalTests;
  const avgUpload = history.reduce((acc, h) => acc + h.upload_mbps, 0) / totalTests;
  const avgPing = history.reduce((acc, h) => acc + h.ping_ms, 0) / totalTests;

  const chartData = [...history]
    .reverse()
    .map((h) => ({
      date: formatDate(h.created_at).split(",")[0],
      download: Number(h.download_mbps.toFixed(2)),
      upload: Number(h.upload_mbps.toFixed(2)),
      ping: Number(h.ping_ms.toFixed(1)),
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-1">
        <div className="flex items-center gap-2 text-[#0f2942] text-xs font-mono font-bold uppercase tracking-wider">
          <BarChart2 className="h-4 w-4" />
          Analytics Hub
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f2942]">Network Performance Dashboard</h1>
        <p className="text-xs text-slate-600">Aggregated throughput statistics and latency time series trend graphs.</p>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Download</div>
          <div className="text-2xl font-black font-mono text-[#0f2942] mt-1">{formatSpeed(avgDownload).value}</div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">{formatSpeed(avgDownload).unit}</div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Upload</div>
          <div className="text-2xl font-black font-mono text-blue-900 mt-1">{formatSpeed(avgUpload).value}</div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">{formatSpeed(avgUpload).unit}</div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Latency</div>
          <div className="text-2xl font-black font-mono text-[#0f2942] mt-1">{formatPing(avgPing)}</div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">ms (Ping)</div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Measurements Logged</div>
          <div className="text-2xl font-black font-mono text-[#0f2942] mt-1">{totalTests}</div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">Completed Logs</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed Trend Area Chart */}
        <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-[#0f2942] uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-700" />
              Download & Upload Throughput Trend
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Mbps</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f2942",
                    borderColor: "#334155",
                    borderRadius: "4px",
                    fontSize: "11px",
                    color: "#ffffff",
                  }}
                />
                <Area type="monotone" dataKey="download" name="Download" stroke="#0f2942" strokeWidth={2} fill="#0f2942" fillOpacity={0.1} />
                <Area type="monotone" dataKey="upload" name="Upload" stroke="#0284c7" strokeWidth={2} fill="#0284c7" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency History Chart */}
        <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-[#0f2942] uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-700" />
              Latency & Ping Stability Trend
            </h3>
            <span className="text-[10px] font-mono text-slate-500">ms</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f2942",
                    borderColor: "#334155",
                    borderRadius: "4px",
                    fontSize: "11px",
                    color: "#ffffff",
                  }}
                />
                <Area type="monotone" dataKey="ping" name="Ping (ms)" stroke="#1e3a8a" strokeWidth={2} fill="#1e3a8a" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
