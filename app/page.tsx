import Link from "next/link";
import { SpeedTestCard } from "@/components/speed-test/speed-test-card";
import { NetworkInfoCard } from "@/components/network/network-info";
import { HostDetailsCard } from "@/components/network/host-details";
import { History, BarChart2, ShieldCheck, Gauge, Activity, Zap, Server, CheckCircle2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 space-y-10">
      {/* Micro Startup Hero Header Section */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center space-y-5">
          {/* Micro Startup Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f2942]/10 border border-[#0f2942]/20 text-[#0f2942] text-xs font-semibold tracking-wide shadow-xs animate-fade-in">
            <Zap className="h-3.5 w-3.5 fill-[#0f2942] text-[#0f2942]" />
            <span>NetPulse v2.5 Engine — Real-time Broadband Telemetry</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2942] tracking-tight max-w-3xl mx-auto leading-tight">
            High-Precision Internet Speed Test & Host Telemetry
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Instant browser-native throughput measurement. Evaluate download speed, upload bandwidth, round-trip latency, jitter, and host server node performance in seconds.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-slate-100 text-[#0f2942] border border-slate-300 font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
            >
              <History className="h-4 w-4 text-[#0f2942]" />
              <span>Test Logs</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0f2942] hover:bg-[#163a5c] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
            >
              <BarChart2 className="h-4 w-4 text-cyan-400" />
              <span>Analytics Dashboard</span>
            </Link>

            <Link
              href="/diagnostics"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-slate-100 text-[#0f2942] border border-slate-300 font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
            >
              <Activity className="h-4 w-4 text-[#0f2942]" />
              <span>Full Diagnostics</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container Area */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Speed Test Centerpiece */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-[#0f2942]" />
              Live Measurement Console
            </h2>
            <span className="text-xs text-slate-500 font-mono">Status: Ready</span>
          </div>
          <SpeedTestCard />
        </section>

        {/* Dedicated Host & Infrastructure Telemetry Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Server className="h-4 w-4 text-[#0f2942]" />
              Host & Infrastructure Telemetry
            </h2>
            <span className="text-xs text-emerald-700 font-mono font-bold">● Multi-Region Edge</span>
          </div>
          <HostDetailsCard />
        </section>

        {/* Network & Client Specs Info Card */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#0f2942]" />
              Client Connection Details
            </h2>
            <span className="text-xs text-slate-500 font-mono">Browser API</span>
          </div>
          <NetworkInfoCard />
        </section>

        {/* Micro Startup Feature Grid */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-[#0f2942] tracking-tight">
              Enterprise-Grade Network Diagnostics
            </h3>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              Built with Next.js App Router, binary streaming chunk engines, and low-overhead HTTP probe telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f2942] uppercase tracking-wider">
                <Gauge className="h-4.5 w-4.5 text-blue-600" />
                Binary Chunk Engine
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parallel HTTP streaming payload chunks designed to accurately saturate your broadband connection without buffer bloat.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f2942] uppercase tracking-wider">
                <Activity className="h-4.5 w-4.5 text-blue-600" />
                Latency & Jitter
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates mean round-trip ping time and standard variation across sequential probes to assess gaming and VoIP stability.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f2942] uppercase tracking-wider">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
                Privacy & Security
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No persistent local tracking cookies or heavy client libraries. Temporary test arrays are garbage collected instantly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
