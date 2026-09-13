"use client";

import Link from "next/link";
import { Activity, ShieldAlert } from "lucide-react";

export function TopStatusBar() {
  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] font-sans py-1.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          NetPulse Public Broadband Measurement Portal
        </span>
        <span className="hidden md:inline-block text-slate-600">|</span>
        <span className="hidden md:inline-block text-slate-400">
          Independent Network Measurement Service
        </span>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono">
        <Link href="/status" className="flex items-center gap-1.5 hover:text-white transition-colors">
          <span>System Status:</span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            OPERATIONAL
          </span>
        </Link>
      </div>
    </div>
  );
}
