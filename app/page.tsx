import Link from "next/link";
import { SpeedTestCard } from "@/components/speed-test/speed-test-card";
import { NetworkInfoCard } from "@/components/network/network-info";
import { Zap, History, Shield, Gauge, Cpu } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold tracking-wide uppercase">
          <Zap className="h-3.5 w-3.5" />
          Internet Performance Test
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          Test your internet speed in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">seconds.</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Measure your download speed, upload speed, ping, jitter, and connection quality with a fast browser-based network engine.
        </p>

        {/* Quick CTA Links */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border/60 font-semibold text-sm transition-colors"
          >
            <History className="h-4 w-4" />
            View History
          </Link>
          <Link
            href="/diagnostics"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border/60 font-semibold text-sm transition-colors"
          >
            <Cpu className="h-4 w-4" />
            Diagnostics
          </Link>
        </div>
      </div>

      {/* Main Speed Test Centerpiece */}
      <SpeedTestCard />

      {/* Network Specs Info Card */}
      <div className="max-w-4xl mx-auto">
        <NetworkInfoCard />
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
            <Gauge className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Real Network Engine</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Multi-stream binary byte transfer accurately measures throughput without synthetic or random placeholders.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
            <History className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Test History & Trends</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Automatically track past test records, export summaries, and compare network fluctuations across devices.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Privacy-First Architecture</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Payloads are discarded immediately after calculation. No personal data retention or background tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
