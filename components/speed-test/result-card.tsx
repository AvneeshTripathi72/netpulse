"use client";

import { useState } from "react";
import { SpeedTestResult } from "@/types/speed-test";
import { calculateConnectionScore } from "@/lib/speed-test/scoring";
import { formatSpeed, formatPing, formatJitter, formatDate } from "@/lib/utils";
import {
  Download,
  Upload,
  Clock,
  Activity,
  Share2,
  Copy,
  RotateCcw,
  Check,
  Server,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

interface ResultCardProps {
  result: SpeedTestResult;
  onReset: () => void;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const quality = calculateConnectionScore({
    downloadMbps: result.download_mbps,
    uploadMbps: result.upload_mbps,
    pingMs: result.ping_ms,
    jitterMs: result.jitter_ms,
  });

  const dl = formatSpeed(result.download_mbps);
  const ul = formatSpeed(result.upload_mbps);

  // Generate unique Measurement ID format (NP-YYYYMMDD-XXXXX)
  const dateObj = new Date(result.created_at || Date.now());
  const dateCode = dateObj.toISOString().slice(0, 10).replace(/-/g, "");
  const shortId = (result.id || "8F42A").replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase();
  const measurementId = `NP-${dateCode}-${shortId || "8F42A"}`;

  const handleCopy = () => {
    const summary = `NetPulse Broadband Measurement Result:
Measurement ID: ${measurementId}
Download Speed: ${dl.value} ${dl.unit}
Upload Speed: ${ul.value} ${ul.unit}
Latency (Ping): ${result.ping_ms} ms
Jitter: ${result.jitter_ms} ms
Assessment: ${result.score_rating} (${result.score}/100)
Test Server: ${result.server_name}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/result/${result.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NetPulse Measurement Result: ${measurementId}`,
          text: `Download: ${dl.value} ${dl.unit} | Latency: ${result.ping_ms}ms`,
          url: shareUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Top Banner: Status Header & Measurement ID */}
      <div className="bg-[#0f2942] text-white p-5 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
            <FileCheck className="h-4 w-4" />
            MEASUREMENT COMPLETE
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Connection Performance Result</h3>
          <p className="text-xs text-slate-300 mt-0.5">{quality.description}</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-sm text-right font-mono">
          <div className="text-[10px] uppercase text-slate-400">Measurement ID</div>
          <div className="text-sm font-bold text-cyan-300 tracking-wider">{measurementId}</div>
        </div>
      </div>

      {/* Grid of 4 Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Download Card */}
        <div className="bg-white p-4 rounded-sm border border-slate-300 relative">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Download</span>
            <Download className="h-4 w-4 text-blue-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#0f2942]">{dl.value}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">{dl.unit}</div>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-4 rounded-sm border border-slate-300 relative">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
            <Upload className="h-4 w-4 text-blue-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#0f2942]">{ul.value}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">{ul.unit}</div>
        </div>

        {/* Latency Card */}
        <div className="bg-white p-4 rounded-sm border border-slate-300 relative">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Latency (Ping)</span>
            <Clock className="h-4 w-4 text-blue-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#0f2942]">{formatPing(result.ping_ms)}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">ms</div>
        </div>

        {/* Jitter Card */}
        <div className="bg-white p-4 rounded-sm border border-slate-300 relative">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Jitter</span>
            <Activity className="h-4 w-4 text-blue-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#0f2942]">{formatJitter(result.jitter_ms)}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">ms</div>
        </div>
      </div>

      {/* Assessment & Server Details Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assessment Score */}
        <div className="md:col-span-2 bg-white p-5 rounded-sm border border-slate-300 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Connection Assessment</span>
            <span className="px-3 py-1 rounded-sm bg-[#0f2942] text-white font-mono font-bold text-xs uppercase">
              {result.score_rating} ({result.score}/100)
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {quality.recommendations.map((rec, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-300"
              >
                <Check className="h-3.5 w-3.5 text-blue-700" />
                {rec}
              </span>
            ))}
          </div>
        </div>

        {/* Server & Date Information */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#0f2942] uppercase">
            <Server className="h-4 w-4" />
            <span>Test Server</span>
          </div>
          <div className="font-semibold text-slate-900 truncate">{result.server_name}</div>
          <div className="text-slate-500 font-mono">Date: {formatDate(result.created_at)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={onReset}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-[#0f2942] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <RotateCcw className="h-4 w-4" />
          RUN TEST AGAIN
        </button>
        <button
          onClick={handleShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-bold uppercase transition-colors"
        >
          {shared ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          {shared ? "LINK COPIED" : "SHARE RESULT"}
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-bold uppercase transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "COPIED" : "COPY SUMMARY"}
        </button>
      </div>
    </div>
  );
}
