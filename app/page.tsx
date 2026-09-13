import Link from "next/link";
import { SpeedTestCard } from "@/components/speed-test/speed-test-card";
import { NetworkInfoCard } from "@/components/network/network-info";
import { Zap, History, Gauge, Shield, Activity, BarChart2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Clean Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        {/* Simple Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 text-xs font-semibold uppercase tracking-wide">
          <Zap className="h-3.5 w-3.5" />
          Fast & Accurate Speed Test
        </div>

        {/* Crisp Heading */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Test your internet speed in seconds.
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Measure your download speed, upload speed, ping latency, and jitter with a fast, ad-free browser test.
        </p>

        {/* Navigation CTAs */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-xs transition-colors shadow-sm"
          >
            <History className="h-4 w-4 text-cyan-600" />
            View History
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-xs transition-colors shadow-sm"
          >
            <BarChart2 className="h-4 w-4 text-cyan-600" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Main Centerpiece Speed Test Dashboard */}
      <SpeedTestCard />

      {/* Network Specs Info Card */}
      <div className="max-w-4xl mx-auto">
        <NetworkInfoCard />
      </div>

      {/* Simple 3 Feature Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
            <Gauge className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Real Throughput</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Multi-stream binary byte transfer measures real connection capacity without synthetic numbers.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ping & Jitter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Continuous round-trip sampling measures network responsiveness and packet stability.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Private & Safe</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No software installation required. Test data stays in your browser and payloads are discarded.
          </p>
        </div>
      </div>
    </div>
  );
}
