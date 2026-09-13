import { HelpCircle, Info, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="border-b border-border/60 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase">
          <HelpCircle className="h-3.5 w-3.5" />
          About NetPulse
        </div>
        <h1 className="text-4xl font-black text-foreground">Know Your Connection</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          NetPulse is a modern, high-precision browser-based internet speed test and network telemetry suite.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="glass-panel p-8 rounded-3xl border border-border/80 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">How NetPulse Works</h2>
          <p>
            When you initiate a speed test on NetPulse, our browser engine executes multi-stage network benchmarks directly in your web browser:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs text-foreground">
            <li><strong className="text-cyan-400">Latency & Jitter:</strong> Measures round-trip micro-requests to establish ping speed and packet timing consistency.</li>
            <li><strong className="text-cyan-400">Download Throughput:</strong> Fetches binary streams across parallel HTTP connections to measure real-time byte reception.</li>
            <li><strong className="text-cyan-400">Upload Throughput:</strong> Sends byte payloads using progress events to measure outbound transmission speed.</li>
          </ul>
        </div>

        <div className="space-y-3 border-t border-border/40 pt-6">
          <h2 className="text-xl font-bold text-foreground">Factors Impacting Test Speed</h2>
          <p>
            Speed results can vary depending on Wi-Fi signal strength, device CPU performance, browser tab overhead, edge server proximity, network congestion, and ISP throttle policies.
          </p>
        </div>

        <div className="space-y-3 border-t border-border/40 pt-6">
          <h2 className="text-xl font-bold text-foreground">Transparency & Accuracy Disclaimer</h2>
          <p className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-xs font-mono">
            "NetPulse provides browser-level network measurements. While built with multi-sample stream analysis to maximize accuracy, browser measurements may differ slightly from raw hardware ISP-level speed tests."
          </p>
        </div>
      </div>
    </div>
  );
}
