"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, Menu, X, Zap, History, BarChart2, Radio, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Speed Test", href: "/" },
    { name: "Test History", href: "/history" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "About Portal", href: "/about" },
  ];

  return (
    <header className="w-full border-b border-slate-300 shadow-sm">
      {/* Top Govt/Enterprise Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-sans py-1 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-100 flex items-center gap-1">
            <Globe className="h-3 w-3 text-cyan-400" />
            National Broadband Speed Portal
          </span>
          <span className="hidden sm:inline-block text-slate-400">|</span>
          <span className="hidden sm:inline-block text-slate-400">Network Telemetry & Measurement Utility</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span>Status: <strong className="text-emerald-400">OPERATIONAL</strong></span>
        </div>
      </div>

      {/* Main Navy Header Navbar */}
      <div className="bg-[#0b2545] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Emblem Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#0b2545] shadow-sm font-black border border-slate-200">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
                NetPulse
              </span>
              <span className="text-[10px] tracking-wider text-cyan-300 uppercase font-semibold">
                Broadband Measurement Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all",
                    isActive
                      ? "bg-[#133c6d] text-cyan-300 border-b-2 border-cyan-400"
                      : "text-slate-200 hover:text-white hover:bg-[#133c6d]/60"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              Start Test
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-[#0b2545] px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-md text-xs font-semibold uppercase transition-colors",
                    isActive
                      ? "bg-[#133c6d] text-cyan-300 font-bold"
                      : "text-slate-200 hover:bg-[#133c6d]/50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
