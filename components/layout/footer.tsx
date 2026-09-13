import Link from "next/link";
import { Activity, Globe, Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-300 bg-[#0b2545] text-slate-300 py-10 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-white text-[#0b2545] font-bold">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white uppercase tracking-tight">NetPulse</span>
            </Link>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              National Broadband Speed Measurement Portal. High-precision browser-based speed test utility.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Portal Services</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Speed Test Utility
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-300 transition-colors">
                  Test Execution Logs
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link href="/diagnostics" className="hover:text-cyan-300 transition-colors">
                  Network Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Information</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  About Portal
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Engine Specifications</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multi-connection binary byte transfer measurement with round-trip latency variance calculation.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Portal Operational
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} NetPulse Broadband Portal. All rights reserved.</p>
          <span>Broadband Measurement Utility</span>
        </div>
      </div>
    </footer>
  );
}
