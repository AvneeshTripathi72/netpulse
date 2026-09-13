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
  Award,
} from "lucide-react";
import Link from "next/link";

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

  const handleCopy = () => {
    const summary = `NetPulse Speed Test Result:
Download: ${dl.value} ${dl.unit}
Upload: ${ul.value} ${ul.unit}
Ping: ${result.ping_ms} ms
Jitter: ${result.jitter_ms} ms
NetPulse Score: ${result.score}/100 (${result.score_rating})
Server: ${result.server_name}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/result/${result.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My NetPulse Speed Test Result",
          text: `Download: ${dl.value} ${dl.unit} | Ping: ${result.ping_ms}ms`,
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
    <div className="w-full space-y-6 animate-fade-in">
      {/* Top Banner: Connection Quality Score */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-border/80 relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          <div
            className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border-2 font-mono font-black text-3xl shadow-xl"
            style={{ borderColor: quality.color, color: quality.color, backgroundColor: `${quality.color}15` }}
          >
            {result.score}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                NetPulse Score
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${quality.badgeClass}`}>
                {quality.rating}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mt-1">Your Connection is {quality.rating}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-md">{quality.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full md:w-auto">
          <button
            onClick={onReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Test Again
          </button>
          <button
            onClick={handleShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border/60 text-sm font-semibold transition-colors"
          >
            {shared ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            {shared ? "Link Copied" : "Share"}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border/60 text-sm font-semibold transition-colors"
            title="Copy result summary"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Grid of 4 Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Download Card */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 relative">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Download</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Download className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-foreground">{dl.value}</div>
          <div className="text-xs font-semibold text-muted-foreground mt-0.5">{dl.unit}</div>
        </div>

        {/* Upload Card */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 relative">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Upload</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Upload className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-foreground">{ul.value}</div>
          <div className="text-xs font-semibold text-muted-foreground mt-0.5">{ul.unit}</div>
        </div>

        {/* Ping Card */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 relative">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Ping</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-foreground">{formatPing(result.ping_ms)}</div>
          <div className="text-xs font-semibold text-muted-foreground mt-0.5">ms (Latency)</div>
        </div>

        {/* Jitter Card */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 relative">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Jitter</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-foreground">{formatJitter(result.jitter_ms)}</div>
          <div className="text-xs font-semibold text-muted-foreground mt-0.5">ms (Variation)</div>
        </div>
      </div>

      {/* Recommendations & Server Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recommended Applications */}
        <div className="md:col-span-2 glass-panel p-5 rounded-2xl border border-border/60">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-cyan-400" />
            Capabilities & Recommendations
          </h4>
          <div className="flex flex-wrap gap-2">
            {quality.recommendations.map((rec, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 text-xs font-medium text-foreground border border-border/40"
              >
                <Check className="h-3.5 w-3.5 text-cyan-400" />
                {rec}
              </span>
            ))}
          </div>
        </div>

        {/* Server & Timestamp Info */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Server className="h-4 w-4 text-cyan-400" />
            <span>Test Server</span>
          </div>
          <div className="text-sm font-semibold text-foreground truncate">{result.server_name}</div>
          <div className="text-xs text-muted-foreground font-mono">Tested on {formatDate(result.created_at)}</div>
        </div>
      </div>
    </div>
  );
}
