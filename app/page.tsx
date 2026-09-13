import Link from "next/link";
import { SpeedTestCard } from "@/components/speed-test/speed-test-card";
import { NetworkInfoCard } from "@/components/network/network-info";
import { History, BarChart2, ShieldCheck, Gauge, Activity, Server } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Portal Banner Heading */}
      <div className="bg-white p-6 rounded-md border border-slate-300 shadow-sm space-y-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b2545] tracking-tight">
            Internet Broadband Speed Measurement Utility
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Official browser-based network throughput utility for measuring download speed, upload speed, latency, and jitter.
          </p>
        </div>

        {/* Quick Portal Links */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0b2545] border border-slate-300 font-bold text-xs uppercase"
          >
            <History className="h-4 w-4" />
            Logs
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0b2545] border border-slate-300 font-bold text-xs uppercase"
          >
            <BarChart2 className="h-4 w-4" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Main Speed Test Centerpiece */}
      <SpeedTestCard />

      {/* Network Specs Info Card */}
      <div className="max-w-4xl mx-auto">
        <NetworkInfoCard />
      </div>

      {/* Information Cards Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-5 rounded-md border border-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b2545] uppercase">
            <Gauge className="h-4 w-4 text-blue-700" />
            Standard Measurement
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Measures accurate data transfer rate using multi-connection binary byte streams.
          </p>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b2545] uppercase">
            <Activity className="h-4 w-4 text-blue-700" />
            Latency & Jitter
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluates round-trip timing and variance over consecutive HTTP ping requests.
          </p>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b2545] uppercase">
            <ShieldCheck className="h-4 w-4 text-blue-700" />
            Secure & Confidential
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Browser-native testing. Temporary payloads are discarded immediately after calculation.
          </p>
        </div>
      </div>
    </div>
  );
}
