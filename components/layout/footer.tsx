import Link from "next/link";
import { Activity, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-300 bg-[#0f2942] text-slate-300 py-10 text-xs mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white text-[#0f2942] font-black">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white uppercase tracking-tight">NetPulse</span>
            </Link>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Public Broadband Measurement Portal — Independent Network Telemetry & Diagnostic System.
            </p>
          </div>

          {/* Service Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Service</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Speed Test
                </Link>
              </li>
              <li>
                <Link href="/diagnostics" className="hover:text-cyan-300 transition-colors">
                  Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-300 transition-colors">
                  Test History
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Information</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/methodology" className="hover:text-cyan-300 transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  About NetPulse
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

          {/* System Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">System</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/status" className="hover:text-cyan-300 transition-colors">
                  Service Status
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Measurement Nodes: 5 Active</span>
              </li>
              <li>
                <span className="text-slate-400">Protocol: HTTPS Binary Stream</span>
              </li>
            </ul>
          </div>

          {/* Contact & Disclaimer Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Notes</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              For technical queries or feedback, use our feedback portal.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-3 rounded-sm bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Disclaimer:</strong> NetPulse is an independent broadband measurement service and is not affiliated with or operated by any government agency.
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 NetPulse. Independent Network Measurement Service.</p>
          <p>Controlled Laboratory & Browser-Based Benchmark</p>
        </div>
      </div>
    </footer>
  );
}
