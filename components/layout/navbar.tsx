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
    { name: "History", href: "/history" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "Methodology", href: "/methodology" },
    { name: "Status", href: "/status" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-200 shadow-xs sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0f2942] text-white font-black shadow-xs">
            <Activity className="h-4.5 w-4.5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#0f2942] leading-none uppercase">
              NetPulse
            </span>
            <span className="text-[9px] tracking-wider text-slate-500 font-semibold uppercase mt-0.5">
              Broadband Portal
            </span>
          </div>
        </Link>

        {/* Clean Header Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-1 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors",
                  isActive
                    ? "text-[#0f2942] font-bold border-b-2 border-[#0f2942]"
                    : "text-slate-600 hover:text-[#0f2942]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#0f2942] hover:bg-[#163a5c] text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors shadow-xs"
          >
            <Zap className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
            <span>Start Test</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex h-8 w-8 items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-3 space-y-1 shadow-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded",
                  isActive
                    ? "bg-[#0f2942] text-white font-bold"
                    : "text-slate-700 hover:bg-slate-100"
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
