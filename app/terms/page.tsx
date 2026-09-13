import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-border/60 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase">
          <FileText className="h-3.5 w-3.5" />
          Terms of Service
        </div>
        <h1 className="text-3xl font-black text-foreground">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: September 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-border/80 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Usage of Service</h2>
          <p>
            NetPulse provides browser-based network bandwidth and latency diagnostic tools. By accessing or using NetPulse, you agree to use the service for lawful network monitoring purposes only.
          </p>
        </section>

        <section className="space-y-2 border-t border-border/40 pt-4">
          <h2 className="text-lg font-bold text-foreground">2. Estimates & Accuracy</h2>
          <p>
            All test measurements, Mbps figures, ping times, and connection scores provided by NetPulse are estimations based on browser execution performance and current network conditions.
          </p>
        </section>
      </div>
    </div>
  );
}
