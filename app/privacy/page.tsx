import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-border/60 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase">
          <Shield className="h-3.5 w-3.5" />
          Privacy & Security
        </div>
        <h1 className="text-3xl font-black text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: September 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-border/80 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>
            When you run a speed test on NetPulse, we temporarily collect technical network telemetry including your IP address, estimated location (country/city), ISP provider name, download/upload throughput values, ping latency, and jitter.
          </p>
        </section>

        <section className="space-y-2 border-t border-border/40 pt-4">
          <h2 className="text-lg font-bold text-foreground">2. Payload Handling & Processing</h2>
          <p>
            Speed test binary payloads transferred during download and upload tests are generated transiently and discarded immediately from RAM. We do not store payload contents on disk.
          </p>
        </section>

        <section className="space-y-2 border-t border-border/40 pt-4">
          <h2 className="text-lg font-bold text-foreground">3. Local Storage & Authentication</h2>
          <p>
            Anonymous speed test history is saved locally in your web browser using HTML5 LocalStorage. If you create an account, saved tests are synced securely with your user ID via Supabase Row Level Security (RLS).
          </p>
        </section>
      </div>
    </div>
  );
}
