"use client";

import { useEffect, useState } from "react";
import { SpeedTestResult, ScoreRating } from "@/types/speed-test";
import { getSpeedTestHistory, deleteSpeedTest } from "@/lib/supabase/queries";
import { formatSpeed, formatPing, formatJitter, formatDate } from "@/lib/utils";
import { History, Trash2, ArrowUpDown, Filter, Download, ArrowUpRight, Share2 } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created_at" | "download_mbps" | "score">("created_at");

  useEffect(() => {
    async function loadHistory() {
      const items = await getSpeedTestHistory();
      setHistory(items);
      setLoading(false);
    }
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteSpeedTest(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredHistory = history
    .filter((item) => (filterRating === "all" ? true : item.score_rating.toLowerCase() === filterRating.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "download_mbps") return b.download_mbps - a.download_mbps;
      if (sortBy === "score") return b.score - a.score;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <History className="h-4 w-4" />
            Network Logs
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Speed Test History</h1>
          <p className="text-xs text-muted-foreground mt-1">Review, compare, and manage your past network measurements.</p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/60 text-xs">
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/60 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer"
            >
              <option value="created_at">Sort by Date</option>
              <option value="download_mbps">Sort by Download</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading speed test logs...
        </div>
      ) : filteredHistory.length === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 rounded-3xl border border-dashed border-border/60 text-center max-w-md mx-auto space-y-4 my-10">
          <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit mx-auto">
            <History className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No tests saved yet</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Run your first speed test to start building your network performance history.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            Start Speed Test
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block glass-panel rounded-2xl border border-border/60 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Download</th>
                  <th className="py-3.5 px-4">Upload</th>
                  <th className="py-3.5 px-4">Ping</th>
                  <th className="py-3.5 px-4">Jitter</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Server</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredHistory.map((item) => {
                  const dl = formatSpeed(item.download_mbps);
                  const ul = formatSpeed(item.upload_mbps);
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-medium text-foreground">{formatDate(item.created_at)}</td>
                      <td className="py-3.5 px-4 font-bold text-cyan-400">{dl.value} {dl.unit}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-400">{ul.value} {ul.unit}</td>
                      <td className="py-3.5 px-4">{formatPing(item.ping_ms)} ms</td>
                      <td className="py-3.5 px-4">{formatJitter(item.jitter_ms)} ms</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                          {item.score}/100 ({item.score_rating})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-muted-foreground max-w-[140px] truncate">{item.server_name}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          href={`/result/${item.id}`}
                          className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-cyan-400 inline-block"
                          title="View Result Page"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id!)}
                          className="p-1.5 rounded-lg bg-muted/60 hover:bg-rose-500/20 text-rose-400 inline-block transition-colors"
                          title="Delete test log"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredHistory.map((item) => {
              const dl = formatSpeed(item.download_mbps);
              const ul = formatSpeed(item.upload_mbps);
              return (
                <div key={item.id} className="glass-panel p-4 rounded-2xl border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{formatDate(item.created_at)}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold text-xs">
                      {item.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Download</span>
                      <div className="text-base font-black text-cyan-400">{dl.value} {dl.unit}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Upload</span>
                      <div className="text-base font-black text-blue-400">{ul.value} {ul.unit}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono border-t border-border/40 pt-2">
                    <span>Ping: {formatPing(item.ping_ms)}ms</span>
                    <div className="flex items-center gap-2">
                      <Link href={`/result/${item.id}`} className="text-cyan-400 text-xs font-sans hover:underline">
                        View Result
                      </Link>
                      <button onClick={() => handleDelete(item.id!)} className="text-rose-400 p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
