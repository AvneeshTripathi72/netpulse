"use client";

import { useEffect, useState } from "react";
import { SpeedTestResult } from "@/types/speed-test";
import { getSpeedTestHistory, deleteSpeedTest } from "@/lib/supabase/queries";
import { formatSpeed, formatPing, formatJitter, formatDate } from "@/lib/utils";
import { History, Trash2, ArrowUpDown, Filter, ArrowUpRight, FileText } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0f2942] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <FileText className="h-4 w-4" />
            Official Measurement Logs
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f2942]">Test Execution History</h1>
          <p className="text-xs text-slate-600 mt-1">Review, audit, and manage historical broadband performance measurement logs.</p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 font-sans">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-100 border border-slate-300 text-xs">
            <Filter className="h-3.5 w-3.5 text-[#0f2942]" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none cursor-pointer font-bold"
            >
              <option value="all">All Assessments</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-100 border border-slate-300 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#0f2942]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-900 focus:outline-none cursor-pointer font-bold"
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
        <div className="py-20 text-center text-xs font-mono text-slate-500 animate-pulse">
          Loading measurement log database...
        </div>
      ) : filteredHistory.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-10 rounded-sm border border-slate-300 text-center max-w-md mx-auto space-y-4 my-8 shadow-sm">
          <div className="p-3 rounded-sm bg-slate-100 text-[#0f2942] w-fit mx-auto border border-slate-300">
            <History className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-[#0f2942]">No Measurements Logged</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Run a broadband speed test to start building your measurement log history.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#0f2942] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider"
          >
            START SPEED TEST
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Report Table */}
          <div className="hidden md:block bg-white rounded-sm border border-slate-300 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0f2942] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Measurement ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Download</th>
                  <th className="py-3 px-4">Upload</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Jitter</th>
                  <th className="py-3 px-4">Server</th>
                  <th className="py-3 px-4">Assessment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredHistory.map((item) => {
                  const dl = formatSpeed(item.download_mbps);
                  const ul = formatSpeed(item.upload_mbps);
                  const dateObj = new Date(item.created_at || Date.now());
                  const dateCode = dateObj.toISOString().slice(0, 10).replace(/-/g, "");
                  const shortId = (item.id || "8F42A").replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase();
                  const mId = `NP-${dateCode}-${shortId || "8F42A"}`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0f2942]">{mId}</td>
                      <td className="py-3 px-4 font-sans text-slate-700">{formatDate(item.created_at)}</td>
                      <td className="py-3 px-4 font-bold text-blue-900">{dl.value} {dl.unit}</td>
                      <td className="py-3 px-4 font-bold text-blue-700">{ul.value} {ul.unit}</td>
                      <td className="py-3 px-4">{formatPing(item.ping_ms)} ms</td>
                      <td className="py-3 px-4">{formatJitter(item.jitter_ms)} ms</td>
                      <td className="py-3 px-4 font-sans text-slate-600 max-w-[130px] truncate">{item.server_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-[#0f2942] border border-slate-300 font-bold uppercase text-[10px]">
                          {item.score_rating} ({item.score})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/result/${item.id}`}
                          className="p-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-[#0f2942] inline-block border border-slate-300"
                          title="View Result Details"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id!)}
                          className="p-1.5 rounded-sm bg-slate-100 hover:bg-rose-100 text-rose-700 inline-block border border-slate-300 transition-colors"
                          title="Delete measurement log"
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
              const dateObj = new Date(item.created_at || Date.now());
              const dateCode = dateObj.toISOString().slice(0, 10).replace(/-/g, "");
              const shortId = (item.id || "8F42A").replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase();
              const mId = `NP-${dateCode}-${shortId || "8F42A"}`;

              return (
                <div key={item.id} className="bg-white p-4 rounded-sm border border-slate-300 shadow-sm space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-[#0f2942]">{mId}</span>
                    <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-[#0f2942] border border-slate-300 font-bold text-[10px] uppercase">
                      {item.score_rating}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-sans">{formatDate(item.created_at)}</div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Download</span>
                      <div className="text-base font-black text-[#0f2942]">{dl.value} {dl.unit}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Upload</span>
                      <div className="text-base font-black text-blue-800">{ul.value} {ul.unit}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono border-t border-slate-200 pt-2">
                    <span>Ping: {formatPing(item.ping_ms)}ms</span>
                    <div className="flex items-center gap-2">
                      <Link href={`/result/${item.id}`} className="text-blue-800 font-bold text-xs font-sans hover:underline">
                        Details →
                      </Link>
                      <button onClick={() => handleDelete(item.id!)} className="text-rose-700 p-1">
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
