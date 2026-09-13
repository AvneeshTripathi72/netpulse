import Link from "next/link";
import { Activity, Shield, FileText, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/50 py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Activity className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-base font-bold text-foreground">NetPulse</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Know your connection. High-precision browser-based internet speed testing, latency monitoring, and network diagnostics.
            </p>
          </div>

          {/* Nav Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Speed Test
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-400 transition-colors">
                  Test History
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link href="/diagnostics" className="hover:text-cyan-400 transition-colors">
                  Network Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Product */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Information</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About NetPulse
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Network Specs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Engine Specs</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Multi-stream binary byte transfer, jitter variation algorithm, and standard network diagnostics.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-cyan-400/90 font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Edge Engine Operational
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} NetPulse. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground/60">Vercel & Supabase Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
