import { Info, ShieldCheck, Activity, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Title */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0f2942]">
          <Info className="h-4 w-4" />
          Institutional Profile
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f2942]">About NetPulse</h1>
        <p className="text-xs text-slate-600">
          Independent Public Broadband Measurement Portal for network performance diagnostics.
        </p>
      </div>

      {/* Main Document Body */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-slate-300 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">
            1. Mission & Purpose
          </h2>
          <p>
            NetPulse is an independent, browser-based broadband measurement platform designed to provide transparent, accurate, and accessible network throughput metrics to users, researchers, and network administrators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">
            2. Infrastructure & Measurement Architecture
          </h2>
          <p>
            Our test infrastructure relies on controlled HTTPS measurement endpoints across edge network nodes. By testing round-trip latency, binary stream download capacity, and byte array upload throughput, NetPulse calculates reliable network benchmarks without synthetic artificial inflation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">
            3. Transparency & Non-Affiliation Notice
          </h2>
          <p className="p-3 bg-slate-50 border border-slate-300 rounded-sm font-mono text-[11px] text-slate-700">
            NetPulse is an independent broadband measurement utility. It is not an official government agency and is not affiliated with or operated by any regulatory government authority.
          </p>
        </section>
      </div>
    </div>
  );
}
