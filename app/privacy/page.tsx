import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0f2942]">
          <ShieldCheck className="h-4 w-4" />
          Data Protection Policy
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f2942]">Privacy & Data Handling Policy</h1>
        <p className="text-xs text-slate-600">Document Reference: NP-POL-PRIVACY-2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-sm border border-slate-300 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">1. Information Collected</h2>
          <p>
            When executing a measurement test, NetPulse samples technical network properties including your IP address, coarse geolocation (country and city), ISP network name, throughput values (Mbps), latency (ms), and jitter (ms).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">2. Information NOT Collected</h2>
          <p>
            NetPulse does not inspect, monitor, or record your web browsing activity, DNS queries, packet contents, or personal files. Test binary payloads are processed in RAM and discarded immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">3. Data Retention & User Rights</h2>
          <p>
            Anonymous speed measurements saved to local history reside within your browser's LocalStorage. If logged into a user account, saved records are isolated securely using PostgreSQL Row Level Security (RLS). Users retain full rights to delete their test logs at any time.
          </p>
        </section>
      </div>
    </div>
  );
}
