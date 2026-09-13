"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Speed Test", href: "/" },
    { name: "Test History", href: "/history" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "Methodology", href: "/methodology" },
    { name: "Status", href: "/status" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="w-full bg-[#0f2942] text-white border-b border-slate-700 shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-[#0f2942] font-black shadow-sm border border-slate-300">
            <Activity className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
              NetPulse
            </span>
            <span className="text-[9px] tracking-widest text-slate-300 uppercase font-semibold">
              Public Broadband Measurement Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all",
                  isActive
                    ? "bg-[#1e3a8a] text-cyan-300 border-b-2 border-cyan-400 font-bold"
                    : "text-slate-200 hover:text-white hover:bg-[#1e3a8a]/50"
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
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm border border-blue-700"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            START TEST
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-sm border border-slate-600 text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-700 bg-[#0f2942] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-sm text-xs font-semibold uppercase transition-colors",
                  isActive
                    ? "bg-[#1e3a8a] text-cyan-300 font-bold"
                    : "text-slate-200 hover:bg-[#1e3a8a]/50"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
